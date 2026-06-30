"""Train and persist the NEERVANA water-quality model.

Usage:  python ml/train.py   (or  npm run ml:train)
"""
import json

from model import MODEL_PATH, train_and_save

if __name__ == "__main__":
    bundle = train_and_save()
    print("✓ Trained NEERVANA water-quality model")
    print(f"  saved to: {MODEL_PATH}")
    print(f"  classes : {bundle['classes']}")
    print("  metrics :")
    print(json.dumps(bundle["metrics"], indent=4))
