import { NextRequest, NextResponse } from "next/server";
import { POST as createOrderHandler } from "@/app/api/orders/route";

export async function POST(request: NextRequest) {
  return createOrderHandler(request);
}
