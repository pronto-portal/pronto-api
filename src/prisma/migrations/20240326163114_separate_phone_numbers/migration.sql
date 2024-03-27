-- CreateTable
CREATE TABLE "PhoneNumber" (
    "number" VARCHAR(30) NOT NULL,
    "optedOut" BOOLEAN NOT NULL DEFAULT true,
    "dateTimeOptedOut" TIMESTAMP(3),
    "dateTimeOptedIn" TIMESTAMP(3),

    CONSTRAINT "PhoneNumber_pkey" PRIMARY KEY ("number")
);

-- AddForeignKey
ALTER TABLE "NonUserTranslator" ADD CONSTRAINT "NonUserTranslator_phone_fkey" FOREIGN KEY ("phone") REFERENCES "PhoneNumber"("number") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Claimant" ADD CONSTRAINT "Claimant_phone_fkey" FOREIGN KEY ("phone") REFERENCES "PhoneNumber"("number") ON DELETE RESTRICT ON UPDATE CASCADE;
