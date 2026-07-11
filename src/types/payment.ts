/** Payment destination details for a project (not Avid's account). */
export interface ProjectPaymentInstructions {
  accountHolder: string;
  bankName: string;
  accountNumberOrIban: string;
  paymentDeadline: string;
  instructionNote: string;
}

export interface PaymentInstructionsContext {
  requestedAmount: number;
  /** ISO date used to compute payment deadline when not stored on project */
  approvedAt: string;
}
