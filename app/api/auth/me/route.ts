import { NextRequest, NextResponse } from "next/server";

const BACKEND = process.env.BACKEND_URL || "http://localhost:5000";

export async function GET(req: NextRequest) {
  try {
    const cookie = req.headers.get("cookie") || "";

    const backendRes = await fetch(`${BACKEND}/api/customers/auth/me`, {
      headers: { cookie },
    });

    if (!backendRes.ok) {
      return NextResponse.json({ authenticated: false }, { status: 200 });
    }

    const data = await backendRes.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ authenticated: false }, { status: 200 });
  }
}
