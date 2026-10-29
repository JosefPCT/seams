-- CreateTable
CREATE TABLE "Attachment" (
    "id" SERIAL NOT NULL,
    "public_id" UUID NOT NULL,
    "url" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT 'Attachment',
    "mimeType" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "uploaded_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "edited_at" TIMESTAMPTZ(6),
    "messageId" INTEGER NOT NULL,

    CONSTRAINT "Attachment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Attachment_public_id_key" ON "Attachment"("public_id");

-- AddForeignKey
ALTER TABLE "Attachment" ADD CONSTRAINT "Attachment_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "Message"("id") ON DELETE CASCADE ON UPDATE CASCADE;
