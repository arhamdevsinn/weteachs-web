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

type HireEmailArgs = {
  to: string;
  recipientName: string;
  senderName: string;
  topic: string;
  amount: string;
  timeLabel: string;
  detailsUrl?: string;
};

type PaymentEmailArgs = {
  to: string;
  recipientName: string;
  counterpartyName: string;
  amount: string;
  topic: string;
  statusLabel: string;
  detailsUrl?: string;
};

type MessageEmailArgs = {
  to: string;
  recipientName: string;
  senderName: string;
  messageText: string;
  conversationUrl?: string;
  isReply?: boolean;
  replySenderName?: string;
  replyPreview?: string;
};

type CategoryLikeEmailArgs = {
  to: string;
  recipientName: string;
  likerName: string;
  categoryTitle: string;
  dashboardLink: string;
};

const BREVO_EMAIL_ENDPOINT =  process.env.BREVO_EMAIL_FUNCTION_URL ||
  "https://us-central1-weteach-4-z4d3id.cloudfunctions.net/sendEmail";

export async function sendBrevoEmail(payload: SendBrevoEmailPayload) {
console.log("BREVO_EMAIL_ENDPOINT:", BREVO_EMAIL_ENDPOINT);

  const response = await fetch(BREVO_EMAIL_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
 console.log("Brevo email response status:", response.statusText," --->>",response);
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

const renderEmailLayout = ({
  eyebrow,
  title,
  intro,
  bodyLines,
  ctaLabel,
  ctaUrl,
  footer,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  bodyLines: string[];
  ctaLabel?: string;
  ctaUrl?: string;
  footer?: string;
}) => {
  const bodyHtml = bodyLines.map((line) => `<p style="margin:0 0 16px;">${line}</p>`).join("");
  const ctaHtml = ctaLabel && ctaUrl
    ? `<div style="margin:24px 0; text-align:center;"><a href="${ctaUrl}" style="display:inline-block; background:#1f6f3f; color:#ffffff; text-decoration:none; padding:12px 20px; border-radius:999px; font-weight:600;">${ctaLabel}</a></div>`
    : "";

  return `
    <div style="font-family: Arial, Helvetica, sans-serif; background:#f8fafc; padding:24px; color:#1f2937;">
      <div style="max-width:640px; margin:0 auto; background:#ffffff; border:1px solid #e5e7eb; border-radius:16px; overflow:hidden;">
        <div style="background:linear-gradient(135deg,#1f6f3f,#2f855a); padding:24px 28px; color:#ffffff;">
          <div style="font-size:14px; letter-spacing:0.08em; text-transform:uppercase; opacity:0.9;">${eyebrow}</div>
          <h1 style="margin:10px 0 0; font-size:24px; line-height:1.3;">${title}</h1>
        </div>
        <div style="padding:28px; font-size:15px; line-height:1.7;">
          <p style="margin:0 0 16px;">${intro}</p>
          ${bodyHtml}
          ${ctaHtml}
          <p style="margin:0; color:#6b7280;">${footer || "Regards,<br />WeTeachs Support Team"}</p>
        </div>
      </div>
    </div>
  `.trim();
};

export async function sendHireNotificationEmail({
  to,
  recipientName,
  senderName,
  topic,
  amount,
  timeLabel,
  detailsUrl,
}: HireEmailArgs) {
  const subject = `New hire request: ${senderName} booked ${topic}`;
  const intro = `Hello ${recipientName},`;
  const bodyLines = [
    `${senderName} has sent you a new hire request for <strong>${topic}</strong>.`,
    `Amount: <strong>${amount}</strong>`,
    `Duration: <strong>${timeLabel}</strong>`,
    "Please review the request in your WeTeachs dashboard and respond at your convenience.",
  ];
  const htmlContent = renderEmailLayout({
    eyebrow: "WeTeachs Hire Request",
    title: "You have a new hire request",
    intro,
    bodyLines,
    ctaLabel: detailsUrl ? "View request" : undefined,
    ctaUrl: detailsUrl,
  });
  const textContent = [
    `Hello ${recipientName},`,
    "",
    `${senderName} has sent you a new hire request for ${topic}.`,
    `Amount: ${amount}`,
    `Duration: ${timeLabel}`,
    "",
    "Please review the request in your WeTeachs dashboard and respond at your convenience.",
    detailsUrl ? `View request: ${detailsUrl}` : null,
    "",
    "Regards,",
    "WeTeachs Support Team",
  ].filter(Boolean).join("\n");

  return sendBrevoEmail({
    to,
    subject,
    htmlContent,
    textContent,
    tags: ["hire-request", "we-teachs"],
    params: { recipientName, senderName, topic, amount, timeLabel, detailsUrl },
  });
}

export async function sendPaymentNotificationEmail({
  to,
  recipientName,
  counterpartyName,
  amount,
  topic,
  statusLabel,
  detailsUrl,
}: PaymentEmailArgs) {
  const subject = `Payment update: ${statusLabel} for ${topic}`;
  const intro = `Hello ${recipientName},`;
  const bodyLines = [
    `Your payment update with <strong>${counterpartyName}</strong> has been completed.`,
    `Topic: <strong>${topic}</strong>`,
    `Amount: <strong>${amount}</strong>`,
    "You can open your WeTeachs account to review the transaction and next steps.",
  ];
  const htmlContent = renderEmailLayout({
    eyebrow: "WeTeachs Payment Update",
    title: "Payment status confirmed",
    intro,
    bodyLines,
    ctaLabel: detailsUrl ? "View payment details" : undefined,
    ctaUrl: detailsUrl,
  });
  const textContent = [
    `Hello ${recipientName},`,
    "",
    `Your payment update with ${counterpartyName} has been completed.`,
    `Topic: ${topic}`,
    `Amount: ${amount}`,
    "",
    "You can open your WeTeachs account to review the transaction and next steps.",
    detailsUrl ? `View payment details: ${detailsUrl}` : null,
    "",
    "Regards,",
    "WeTeachs Support Team",
  ].filter(Boolean).join("\n");

  return sendBrevoEmail({
    to,
    subject,
    htmlContent,
    textContent,
    tags: ["payment-update", "we-teachs"],
    params: { recipientName, counterpartyName, amount, topic, statusLabel, detailsUrl },
  });
}

export async function sendMessageNotificationEmail({
  to,
  recipientName,
  senderName,
  messageText,
  conversationUrl,
  isReply,
  replySenderName,
  replyPreview,
}: MessageEmailArgs) {
  const subject = isReply
    ? `New reply from ${senderName} on WeTeachs`
    : `New message from ${senderName} on WeTeachs`;
  const intro = `Hello ${recipientName},`;
  const bodyLines = [
    isReply
      ? `${senderName} replied to your message on WeTeachs.`
      : `${senderName} sent you a new message on WeTeachs.`,
    replySenderName && replyPreview
      ? `They replied to <strong>${replySenderName}</strong>: <em>${replyPreview}</em>`
      : null,
    `<strong>Message:</strong> ${messageText}`,
    "Open your conversation to continue the discussion.",
  ].filter(Boolean) as string[];
  const htmlContent = renderEmailLayout({
    eyebrow: "WeTeachs Message Alert",
    title: isReply ? "You received a reply" : "You have a new message",
    intro,
    bodyLines,
    ctaLabel: conversationUrl ? "Open conversation" : undefined,
    ctaUrl: conversationUrl,
  });
  const textContent = [
    `Hello ${recipientName},`,
    "",
    isReply
      ? `${senderName} replied to your message on WeTeachs.`
      : `${senderName} sent you a new message on WeTeachs.`,
    replySenderName && replyPreview
      ? `They replied to ${replySenderName}: ${replyPreview}`
      : null,
    `Message: ${messageText}`,
    "",
    "Open your conversation to continue the discussion.",
    conversationUrl ? `Open conversation: ${conversationUrl}` : null,
    "",
    "Regards,",
    "WeTeachs Support Team",
  ].filter(Boolean).join("\n");

  return sendBrevoEmail({
    to,
    subject,
    htmlContent,
    textContent,
    tags: [isReply ? "chat-reply" : "chat-message", "we-teachs"],
    params: { recipientName, senderName, messageText, conversationUrl, isReply, replySenderName, replyPreview },
  });
}

export async function sendCategoryLikeEmail({
  to,
  recipientName,
  likerName,
  categoryTitle,
  dashboardLink,
}: CategoryLikeEmailArgs) {
    try {
  const subject = "Your category received a new like on WeTeachs";
  const intro = `Hello ${recipientName},`;
  const bodyLines = [
    `${likerName} liked your category <strong>${categoryTitle}</strong>.`,
    "This engagement helps improve the visibility of your profile and category within WeTeachs.",
  ];
  const htmlContent = renderEmailLayout({
    eyebrow: "WeTeachs",
    title: "Your category received a new like",
    intro,
    bodyLines,
    ctaLabel: "View category activity",
    ctaUrl: dashboardLink,
  });
  const textContent = [
    `Hello ${recipientName},`,
    "",
    `${likerName} liked your category \"${categoryTitle}\".`,
    "",
    "This engagement helps improve the visibility of your profile and category within WeTeachs.",
    "",
    `View the category activity here: ${dashboardLink}`,
    "",
    "Regards,",
    "WeTeachs Support Team",
  ].join("\n");

  return sendBrevoEmail({
    to,
    subject,
    htmlContent,
    textContent,
    tags: ["category-like", "we-teachs"],
    params: { recipientName, likerName, categoryTitle, dashboardLink },
  });
}catch (error) {
  console.error("Failed to send category like email", error);
  throw error instanceof Error ? error : new Error("Unknown error sending category like email");    
}
}
 