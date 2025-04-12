-- AlterTable
ALTER TABLE "Admin" ADD COLUMN     "profile_photo" TEXT;

-- CreateTable
CREATE TABLE "Media" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "note_id" INTEGER NOT NULL,

    CONSTRAINT "Media_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Media" ADD CONSTRAINT "Media_note_id_fkey" FOREIGN KEY ("note_id") REFERENCES "Notes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
