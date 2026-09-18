import { NextRequest, NextResponse } from "next/server";

const BACKEND = process.env.BACKEND_URL || "http://localhost:5000";

export async function POST(req: NextRequest) {
  const cookie = req.headers.get("cookie") || "";
  const res = await fetch(`${BACKEND}/api/customers/orders/claim`, {
    method: "POST",
    headers: { cookie },
  });
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
