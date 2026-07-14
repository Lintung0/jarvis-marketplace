import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const admin = createAdminClient();
    const { data, error } = await admin
      .from('exchange_rates')
      .select('rate_to_idr, updated_at')
      .eq('currency_code', 'USD')
      .single();

    if (error || !data) {
      return NextResponse.json({ rate: 16250, source: 'fallback' });
    }

    return NextResponse.json({
      rate: Number(data.rate_to_idr),
      updated_at: data.updated_at,
      source: 'db',
    });
  } catch {
    return NextResponse.json({ rate: 16250, source: 'fallback' });
  }
}
