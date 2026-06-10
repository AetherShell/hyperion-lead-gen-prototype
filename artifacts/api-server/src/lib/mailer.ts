import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env["SMTP_USER"],
    pass: process.env["SMTP_PASS"],
  },
});

export function getNotifyEmails(): string[] {
  const raw = process.env["NOTIFY_EMAILS"] ?? "";
  return raw.split(",").map(e => e.trim()).filter(Boolean);
}

export async function sendLeadNotification(lead: {
  name: string;
  email: string;
  phone: string;
  zipCode: string;
  preferredTime: string;
  waterTest: boolean;
}) {
  const recipients = getNotifyEmails();
  if (!recipients.length) return;

  const timeLabels: Record<string, string> = {
    morning: "Morning (8am – 12pm)",
    afternoon: "Afternoon (12pm – 5pm)",
    evening: "Evening (5pm – 8pm)",
    anytime: "Anytime",
  };

  await transporter.sendMail({
    from: `"Hyperion Elite Leads" <${process.env["SMTP_USER"]}>`,
    to: recipients.join(", "),
    subject: `New lead: ${lead.name} — ${lead.zipCode}`,
    text: [
      `New lead from the Pure & Gentle landing page.`,
      ``,
      `Name:       ${lead.name}`,
      `Phone:      ${lead.phone}`,
      `Email:      ${lead.email}`,
      `ZIP:        ${lead.zipCode}`,
      `Best time:  ${timeLabels[lead.preferredTime] ?? lead.preferredTime}`,
      `Water test: ${lead.waterTest ? "Yes" : "No"}`,
    ].join("\n"),
  });
}
