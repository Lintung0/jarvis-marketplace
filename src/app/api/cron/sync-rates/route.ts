import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';

export async function GET(req: Request) {
  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const API_KEY = process.env.EXCHANGE_RATE_API_KEY;
    if (!API_KEY) throw new Error("API Key tidak diset");

    const res = await fetch(`https://v6.exchangerate-api.com/v6/${API_KEY}/latest/USD`);
    const data = await res.json();
    
    if (data.result !== 'success') {
      console.warn('Cron Sync: API Failed');
      return NextResponse.json({ success: false, message: 'API Failed' });
    }

    const rateIdr = data.conversion_rates.IDR;
    const admin = createAdminClient();

    await admin.from('exchange_rates').upsert({
      currency_code: 'USD',
      rate_to_idr: rateIdr,
      updated_at: new Date().toISOString()
    });

    return NextResponse.json({ success: true, rate: rateIdr });
  } catch (error) {
    console.error('Cron Sync Error:', error);
    return NextResponse.json({ success: false, error: 'Internal failure' });
  }
}
