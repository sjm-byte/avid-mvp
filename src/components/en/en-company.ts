import { companyNationalId, companyRegistrationNumber } from "@/lib/company-contact";

/** Company details in English (Persian originals live in lib/company-contact.ts). */
export const EN_COMPANY = {
  legalName: "Avid Financial Planning & Development Co.",
  registrationNumber: companyRegistrationNumber,
  nationalId: companyNationalId,
  address:
    "Unit 4, 2nd floor, No. 2/1, corner of Khark St., Habibollah St., Sattarkhan, Tehran, Iran",
  phone: "+98 21 9103 5914",
} as const;
