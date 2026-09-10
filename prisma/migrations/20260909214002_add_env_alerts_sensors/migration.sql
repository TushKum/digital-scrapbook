-- CreateTable
CREATE TABLE "sensor_readings" (
    "id" TEXT NOT NULL,
    "nodeId" TEXT NOT NULL,
    "blockId" TEXT,
    "ts" TIMESTAMP(3) NOT NULL,
    "ph" DOUBLE PRECISION,
    "orpMv" INTEGER,
    "waterTempC" DOUBLE PRECISION,
    "waterLevelCm" DOUBLE PRECISION,
    "orpStatus" TEXT,
    "sensorHealth" TEXT NOT NULL DEFAULT 'ok',
    "provenance" TEXT NOT NULL DEFAULT 'synthetic-simulated',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sensor_readings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "data_sources" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "accessMethod" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'planned',
    "lastSyncAt" TIMESTAMP(3),
    "notes" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "data_sources_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "disease_reports" (
    "id" TEXT NOT NULL,
    "source" TEXT NOT NULL DEFAULT 'idsp',
    "disease" TEXT NOT NULL,
    "village" TEXT,
    "blockId" TEXT,
    "onsetDate" TIMESTAMP(3),
    "reportDate" TIMESTAMP(3),
    "cases" INTEGER NOT NULL DEFAULT 0,
    "deaths" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'suspected',
    "provenance" TEXT NOT NULL DEFAULT 'pending',
    "sourceUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "disease_reports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "water_samples" (
    "id" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "blockId" TEXT,
    "stationName" TEXT,
    "collectedAt" TIMESTAMP(3) NOT NULL,
    "turbidityNtu" DOUBLE PRECISION,
    "residualChlorine" DOUBLE PRECISION,
    "coliformPresent" BOOLEAN,
    "nitrateMgL" DOUBLE PRECISION,
    "fluorideMgL" DOUBLE PRECISION,
    "uraniumPpb" DOUBLE PRECISION,
    "result" TEXT,
    "provenance" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "water_samples_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rainfall_observations" (
    "id" TEXT NOT NULL,
    "source" TEXT NOT NULL DEFAULT 'nasa-power',
    "blockId" TEXT,
    "lat" DOUBLE PRECISION,
    "lon" DOUBLE PRECISION,
    "isoWeek" TEXT,
    "date" TIMESTAMP(3),
    "rainfallMm" DOUBLE PRECISION NOT NULL,
    "heavyRainDays" INTEGER NOT NULL DEFAULT 0,
    "provenance" TEXT NOT NULL DEFAULT 'real',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "rainfall_observations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "alerts" (
    "id" TEXT NOT NULL,
    "blockId" TEXT NOT NULL,
    "level" TEXT NOT NULL,
    "driver" TEXT NOT NULL,
    "riskScore" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'open',
    "raisedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "closedAt" TIMESTAMP(3),
    "provenance" TEXT NOT NULL DEFAULT 'rule-based',

    CONSTRAINT "alerts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "response_events" (
    "id" TEXT NOT NULL,
    "alertId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "actor" TEXT NOT NULL,
    "note" TEXT,
    "at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "response_events_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "sensor_readings_nodeId_ts_idx" ON "sensor_readings"("nodeId", "ts");

-- CreateIndex
CREATE INDEX "sensor_readings_blockId_ts_idx" ON "sensor_readings"("blockId", "ts");

-- CreateIndex
CREATE UNIQUE INDEX "data_sources_key_key" ON "data_sources"("key");

-- CreateIndex
CREATE INDEX "disease_reports_blockId_onsetDate_idx" ON "disease_reports"("blockId", "onsetDate");

-- CreateIndex
CREATE INDEX "water_samples_blockId_collectedAt_idx" ON "water_samples"("blockId", "collectedAt");

-- CreateIndex
CREATE INDEX "rainfall_observations_blockId_isoWeek_idx" ON "rainfall_observations"("blockId", "isoWeek");

-- CreateIndex
CREATE INDEX "alerts_blockId_status_idx" ON "alerts"("blockId", "status");

-- CreateIndex
CREATE INDEX "response_events_alertId_at_idx" ON "response_events"("alertId", "at");

-- AddForeignKey
ALTER TABLE "sensor_readings" ADD CONSTRAINT "sensor_readings_blockId_fkey" FOREIGN KEY ("blockId") REFERENCES "blocks"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "disease_reports" ADD CONSTRAINT "disease_reports_blockId_fkey" FOREIGN KEY ("blockId") REFERENCES "blocks"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "water_samples" ADD CONSTRAINT "water_samples_blockId_fkey" FOREIGN KEY ("blockId") REFERENCES "blocks"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rainfall_observations" ADD CONSTRAINT "rainfall_observations_blockId_fkey" FOREIGN KEY ("blockId") REFERENCES "blocks"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "alerts" ADD CONSTRAINT "alerts_blockId_fkey" FOREIGN KEY ("blockId") REFERENCES "blocks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "response_events" ADD CONSTRAINT "response_events_alertId_fkey" FOREIGN KEY ("alertId") REFERENCES "alerts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
