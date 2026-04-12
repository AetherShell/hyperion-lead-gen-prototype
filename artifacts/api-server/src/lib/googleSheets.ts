import type { LeadData } from "../routes/leads.js";

export async function appendLeadToSheet(lead: LeadData): Promise<void> {
  // This function will be implemented after Google Sheets OAuth is connected.
  // Placeholder: log the lead so nothing is silently dropped during setup.
  console.warn("[googleSheets] Integration not yet configured — lead data:", lead);
}
