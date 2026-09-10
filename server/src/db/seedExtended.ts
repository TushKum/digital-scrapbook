import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { prisma } from './prisma';
import { logger } from '../logger';

// Idempotent seed for the extended tables (data_sources, disease_reports,
// water_samples, rainfall_observations, alerts, response_events, sensor_readings).
// Data lives in repo fixtures under data/seed/ and data/. Every row carries a
// `provenance` value — real | real-reference | rule-based | synthetic-simulated —
// so nothing here is mistaken for a live government feed.
//
// PREREQ: run `prisma migrate deploy` + `prisma generate` first (these models
// must exist in the generated client). Run with: `tsx server/src/db/seedExtended.ts`.

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../../..');
const j = (p: string) => JSON.parse(readFileSync(resolve(ROOT, p), 'utf8'));
const num = (v: string) => (v === '' ? null : Number(v));

function readCsv(path: string): Record<string, string>[] {
  const lines = readFileSync(resolve(ROOT, path), 'utf8').trim().split(/\r?\n/);
  const cols = lines[0].split(',');
  return lines.slice(1).map((line) => {
    const cells = line.split(',');
    return Object.fromEntries(cols.map((c, i) => [c, cells[i] ?? ''])) as Record<string, string>;
  });
}

async function main() {
  const ref = j('data/seed/reference_data.json');

  // 1. Data-source registry (upsert by key).
  for (const d of ref.data_sources) {
    await prisma.dataSource.upsert({ where: { key: d.key }, create: d, update: d });
  }

  // 2. Disease reports (real, sourced) — reset the sourced set.
  await prisma.diseaseReport.deleteMany({ where: { provenance: 'real' } });
  for (const r of ref.disease_reports) {
    await prisma.diseaseReport.create({
      data: {
        source: r.source, disease: r.disease, village: r.village, blockId: r.blockId,
        onsetDate: r.onsetDate ? new Date(r.onsetDate) : null,
        reportDate: r.reportDate ? new Date(r.reportDate) : null,
        cases: r.cases, deaths: r.deaths, status: r.status,
        provenance: r.provenance, sourceUrl: r.sourceUrl,
      },
    });
  }

  // 3. Water samples (real + CGWB reference).
  await prisma.waterSample.deleteMany({ where: { provenance: { in: ['real', 'real-reference'] } } });
  for (const s of ref.water_samples) {
    await prisma.waterSample.create({ data: { ...s, collectedAt: new Date(s.collectedAt) } });
  }

  // 4. Rainfall (REAL, NASA POWER) — reset the nasa-power set.
  const rain = readCsv('data/seed/rainfall_observations.csv');
  await prisma.rainfallObservation.deleteMany({ where: { source: 'nasa-power' } });
  await prisma.rainfallObservation.createMany({
    data: rain.map((r) => ({
      source: r.source, blockId: r.block_id || null, lat: num(r.lat), lon: num(r.lon),
      isoWeek: r.iso_week, rainfallMm: Number(r.rainfall_mm),
      heavyRainDays: Number(r.heavy_rain_days), provenance: r.provenance,
    })),
  });

  // 5. Alert + response chain (rule-based / synthetic-demo illustration).
  for (const a of ref.alerts) {
    await prisma.alert.upsert({
      where: { id: a.id },
      create: { ...a, raisedAt: new Date(a.raisedAt), closedAt: a.closedAt ? new Date(a.closedAt) : null },
      update: { status: a.status, riskScore: a.riskScore },
    });
  }
  await prisma.responseEvent.deleteMany({ where: { alertId: { in: ref.alerts.map((a: { id: string }) => a.id) } } });
  if (ref.response_events.length) {
    await prisma.responseEvent.createMany({
      data: ref.response_events.map((e: { alertId: string; action: string; actor: string; note: string; at: string }) => ({
        alertId: e.alertId, action: e.action, actor: e.actor, note: e.note, at: new Date(e.at),
      })),
    });
  }

  // 6. Simulated sensor stream (synthetic-simulated) — batched insert.
  const sensor = readCsv('data/neervana_sensor_simulated.csv');
  await prisma.sensorReading.deleteMany({ where: { provenance: 'synthetic-simulated' } });
  const rows = sensor.map((r) => ({
    nodeId: r.node_id, blockId: r.block_id || null, ts: new Date(r.timestamp_ist),
    ph: num(r.ph), orpMv: num(r.orp_mv), waterTempC: num(r.water_temp_c),
    waterLevelCm: num(r.water_level_cm), orpStatus: r.orp_status || null,
    sensorHealth: r.sensor_health, provenance: r.provenance,
  }));
  for (let i = 0; i < rows.length; i += 500) {
    await prisma.sensorReading.createMany({ data: rows.slice(i, i + 500) });
  }

  const counts = {
    data_sources: await prisma.dataSource.count(),
    disease_reports: await prisma.diseaseReport.count(),
    water_samples: await prisma.waterSample.count(),
    rainfall_observations: await prisma.rainfallObservation.count(),
    alerts: await prisma.alert.count(),
    response_events: await prisma.responseEvent.count(),
    sensor_readings: await prisma.sensorReading.count(),
  };
  logger.info(counts, 'extended seed complete');
}

main()
  .catch((err) => {
    logger.error({ err }, 'extended seed failed');
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
