/**
 * Shared types for citizenship certificate extraction data.
 * Mirrors the server types to maintain type safety across the stack.
 */

export interface NameField {
  nepali: string;
  english: string;
}

export interface AddressField {
  district: string;
  localLevel: string;
  wardNo: string;
}

export interface ExtractionResult {
  citizenshipNo: string;
  firstName: NameField;
  middleName: NameField;
  lastName: NameField;
  dobBS: string;
  dobAD: string;
  birthPlace: string;
  gender: "MALE" | "FEMALE" | "OTHER" | "";
  fatherName: NameField;
  motherName: NameField;
  grandfatherName: NameField;
  permanentAddress: AddressField;
  issuingDistrict: string;
  issueDateBS: string;
  issuingAuthority: string;
  confidence: number;
}

export interface ExtractResponse {
  success: boolean;
  data?: ExtractionResult;
  error?: string;
}

/** Mandatory fields that must be filled for the enrollment */
export const MANDATORY_FIELDS: (keyof ExtractionResult)[] = [
  "citizenshipNo",
  "firstName",
  "lastName",
  "dobBS",
  "dobAD",
  "birthPlace",
  "gender",
  "fatherName",
  "motherName",
  "grandfatherName",
  "issuingDistrict",
  "issueDateBS",
];
