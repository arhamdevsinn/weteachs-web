export type SendBrevoEmailPayload = {
  to: string;
  subject: string;
  textContent: string;
};

export async function sendBrevoEmail(payload: SendBrevoEmailPayload) {
  const response = await fetch("/api/brevo-email", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.error || "Failed to send email");
  }

  return data;
}
