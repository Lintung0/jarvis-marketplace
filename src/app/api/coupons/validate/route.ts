import { logger } from "@/lib/logger"
import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const { code, total } = await req.json();

    if (!code || typeof total !== "number") {
      return NextResponse.json(
        { valid: false, error: "Invalid request body" },
        { status: 400 }
      );
    }

    const admin = createAdminClient();

    const { data: coupon, error } = await admin
      .from("coupons")
      .select("*")
      .ilike("code", code)
      .single();

    if (error || !coupon) {
      return NextResponse.json(
        { valid: false, error: "Kode kupon tidak ditemukan" },
        { status: 200 }
      );
    }

    if (!coupon.is_active) {
      return NextResponse.json(
        { valid: false, error: "Kupon sudah tidak aktif" },
        { status: 200 }
      );
    }

    if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) {
      return NextResponse.json(
        { valid: false, error: "Kupon sudah kedaluwarsa" },
        { status: 200 }
      );
    }

    if (total < coupon.min_order) {
      return NextResponse.json(
        { valid: false, error: `Min. belanja Rp ${coupon.min_order.toLocaleString("id-ID")}` },
        { status: 200 }
      );
    }

    if (coupon.max_uses !== null && coupon.used_count >= coupon.max_uses) {
      return NextResponse.json(
        { valid: false, error: "Kupon sudah habis digunakan" },
        { status: 200 }
      );
    }

    let discountAmount = 0;
    if (coupon.type === "percentage") {
      discountAmount = Math.round(total * coupon.value / 100);
    } else {
      discountAmount = Math.min(coupon.value, total);
    }

    return NextResponse.json({
      valid: true,
      coupon: {
        id: coupon.id,
        code: coupon.code,
        type: coupon.type,
        value: coupon.value,
        discount_amount: discountAmount,
      },
    });
  } catch (err) {
    logger.error("Coupon validate error:", err);
    return NextResponse.json(
      { valid: false, error: "Terjadi kesalahan" },
      { status: 500 }
    );
  }
}
