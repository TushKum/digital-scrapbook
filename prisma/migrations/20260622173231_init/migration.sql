-- CreateTable
CREATE TABLE "blocks" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "namePa" TEXT NOT NULL,
    "phc" TEXT NOT NULL,
    "population" INTEGER NOT NULL,
    "posX" DOUBLE PRECISION NOT NULL,
    "posZ" DOUBLE PRECISION NOT NULL,
    "areaW" DOUBLE PRECISION NOT NULL,
    "areaD" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "blocks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "snapshots" (
    "id" TEXT NOT NULL,
    "blockId" TEXT NOT NULL,
    "window" TEXT NOT NULL,
    "activeCases" INTEGER NOT NULL,
    "newCases" INTEGER NOT NULL,
    "recovered" INTEGER NOT NULL,
    "sForms" INTEGER NOT NULL,
    "pForms" INTEGER NOT NULL,
    "wqi" INTEGER NOT NULL,
    "turbidity" DOUBLE PRECISION NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "snapshots_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stock" (
    "id" TEXT NOT NULL,
    "blockId" TEXT NOT NULL,
    "window" TEXT NOT NULL,
    "ors" INTEGER NOT NULL,
    "zinc" INTEGER NOT NULL,
    "antibiotics" INTEGER NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "stock_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dispatches" (
    "id" TEXT NOT NULL,
    "lang" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "priority" INTEGER NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "dispatches_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "snapshots_blockId_window_key" ON "snapshots"("blockId", "window");

-- CreateIndex
CREATE UNIQUE INDEX "stock_blockId_window_key" ON "stock"("blockId", "window");

-- CreateIndex
CREATE INDEX "dispatches_lang_active_idx" ON "dispatches"("lang", "active");

-- AddForeignKey
ALTER TABLE "snapshots" ADD CONSTRAINT "snapshots_blockId_fkey" FOREIGN KEY ("blockId") REFERENCES "blocks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock" ADD CONSTRAINT "stock_blockId_fkey" FOREIGN KEY ("blockId") REFERENCES "blocks"("id") ON DELETE CASCADE ON UPDATE CASCADE;
