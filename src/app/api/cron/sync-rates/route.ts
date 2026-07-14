import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';

export async function GET(req: Request) {
  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const API_KEY = process.env.EXCHANGE_RATE_API_KEY;
    if (!API_KEY) throw new Error("API Key kosong di Vercel");

    const url = `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/USD`;
    const res = await fetch(url);
    const data = await res.json();
    
    // DEBUG: return data buat liat API bilang apa
    if (data.result !== 'success') {
      return NextResponse.json({ 
        error: 'API Error', 
        api_result: data.result, 
        error_type: data['error-type'],
        full_data: data 
      }, { status: 400 });
    }

    const rateIdr = data.conversion_rates.IDR;
    const admin = createAdminClient();

    await admin.from('exchange_rates').upsert({
      currency_code: 'USD',
      rate_to_idr: rateIdr,
      updated_at: new Date().toISOString()
    });

    return NextResponse.json({ success: true, rate: rateIdr });
  } catch (error: any) {
    return NextResponse.json({ error: 'Sync failed', details: error.message }, { status: 500 });
  }
}