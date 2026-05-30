export type SendBrevoEmailPayload = {
  to: string;
  subject: string;
  htmlContent?: string;
  textContent?: string;
  replyTo?: string;
  cc?: string | string[];
  bcc?: string | string[];
  tags?: string[];
  params?: Record<string, unknown>;
};

const BREVO_EMAIL_ENDPOINT =
  process.env.NEXT_PUBLIC_BREVO_EMAIL_FUNCTION_URL ||
  process.env.BREVO_EMAIL_FUNCTION_URL ||
  "https://us-central1-weteach-4-z4d3id.cloudfunctions.net/sendBrevoEmail";

export async function sendBrevoEmail(payload: SendBrevoEmailPayload) {
  const response = await fetch(BREVO_EMAIL_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const contentType = response.headers.get("content-type") || "";
  const rawResponse = contentType.includes("application/json")
    ? await response.json().catch(async () => await response.text())
    : await response.text();

  const data = typeof rawResponse === "string" ? { error: rawResponse } : rawResponse;

  if (!payload.htmlContent && !payload.textContent) {
    throw new Error("Provide either htmlContent or textContent");
  }

  if (!response.ok) {
    throw new Error(data?.error || data?.message || "Failed to send email");
  }

  return data;
}
