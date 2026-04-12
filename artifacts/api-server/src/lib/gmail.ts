import type { LeadData } from "../routes/leads.js";

export async function sendLeadNotification(lead: LeadData): Promise<void> {
  // This function will be implemented after Gmail OAuth is connected.
  // Placeholder: log the lead so nothing is silently dropped during setup.
  console.warn("[gmail] Integration not yet configured — lead data:", lead);
}
