"""NEERVANA water-quality model.

Trains scikit-learn models that map ESP32 water-sensor readings
(turbidity, TDS, pH, temperature) to:
  - a water-quality status  (safe / advisory / critical)  — classifier
  - a Water Quality Index 0-100                            — regressor

Synthetic-but-realistic labelled data is generated from a physical-ish scoring
function plus noise, so the model is fully trainable offline with no dataset.
"""
import os
from datetime import datetime, timezone

import numpy as np
import pandas as pd
from joblib import dump, load
from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor
from sklearn.metrics import accuracy_score, f1_score, mean_absolute_error, r2_score
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler

FEATURES = ["turbidity", "tds", "ph", "temperature"]
MODEL_DIR = os.path.join(os.path.dirname(__file__), "model")
MODEL_PATH = os.path.join(MODEL_DIR, "water_quality.joblib")


def _synth_wqi(turbidity, tds, ph, temperature, rng):
    """Latent Water Quality Index. Higher turbidity/TDS, pH away from ~7.2 and
    high temperature all degrade water quality."""
    wqi = np.full(len(turbidity), 100.0)
    wqi -= np.clip(turbidity, 0, None) * 3.2
    wqi -= np.clip(tds - 300.0, 0, None) * 0.03
    wqi -= np.abs(ph - 7.2) * 6.5
    wqi -= np.clip(temperature - 25.0, 0, None) * 0.8
    wqi += rng.normal(0.0, 3.0, size=len(turbidity))
    return np.clip(wqi, 0.0, 100.0)


def generate_dataset(n=4000, seed=42):
    rng = np.random.default_rng(seed)
    turbidity = rng.gamma(2.0, 2.3, n)                      # ~0..25 NTU
    tds = rng.normal(450.0, 190.0, n).clip(40.0, 1500.0)    # ppm
    ph = rng.normal(7.2, 0.7, n).clip(5.0, 9.8)
    temperature = rng.normal(26.0, 3.6, n).clip(12.0, 42.0)  # deg C
    wqi = _synth_wqi(turbidity, tds, ph, temperature, rng)
    status = np.where(wqi >= 70, "safe", np.where(wqi >= 45, "advisory", "critical"))
    return pd.DataFrame(
        {"turbidity": turbidity, "tds": tds, "ph": ph, "temperature": temperature, "wqi": wqi, "status": status}
    )


def train_and_save(model_path=MODEL_PATH):
    df = generate_dataset()
    X = df[FEATURES].values
    y_status = df["status"].values
    y_wqi = df["wqi"].values

    X_tr, X_te, sc_tr, sc_te, wqi_tr, wqi_te = train_test_split(
        X, y_status, y_wqi, test_size=0.2, random_state=0, stratify=y_status
    )

    clf = Pipeline(
        [("scaler", StandardScaler()), ("rf", RandomForestClassifier(n_estimators=200, max_depth=12, random_state=0))]
    )
    reg = Pipeline(
        [("scaler", StandardScaler()), ("rf", RandomForestRegressor(n_estimators=200, max_depth=14, random_state=0))]
    )
    clf.fit(X_tr, sc_tr)
    reg.fit(X_tr, wqi_tr)

    metrics = {
        "accuracy": round(float(accuracy_score(sc_te, clf.predict(X_te))), 4),
        "f1_macro": round(float(f1_score(sc_te, clf.predict(X_te), average="macro")), 4),
        "wqi_mae": round(float(mean_absolute_error(wqi_te, reg.predict(X_te))), 3),
        "wqi_r2": round(float(r2_score(wqi_te, reg.predict(X_te))), 4),
        "n_train": int(len(X_tr)),
        "n_test": int(len(X_te)),
    }
    bundle = {
        "clf": clf,
        "reg": reg,
        "features": FEATURES,
        "classes": [str(c) for c in clf.classes_],
        "trained_at": datetime.now(timezone.utc).isoformat(),
        "metrics": metrics,
    }
    os.makedirs(os.path.dirname(model_path), exist_ok=True)
    dump(bundle, model_path)
    return bundle


def load_model(model_path=MODEL_PATH):
    return load(model_path)


def load_or_train(model_path=MODEL_PATH):
    if os.path.exists(model_path):
        return load_model(model_path)
    return train_and_save(model_path)
