import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';

export async function GET(req: Request) {
  // Verifikasi Cron Secret buat keamanan
  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const API_KEY = process.env.EXCHANGE_RATE_API_KEY;
    const res = await fetch(`https://v6.exchangerate-api.com/v6/${API_KEY}/latest/USD`);
    const data = await res.json();
    
    if (data.result !== 'success') throw new Error('Gagal ambil data dari API');

    const rateIdr = data.conversion_rates.IDR;
    const admin = createAdminClient();

    // Update/Insert kurs ke database
    const { error } = await admin.from('exchange_rates').upsert({
      currency_code: 'USD',
      rate_to_idr: rateIdr,
      updated_at: new Date().toISOString()
    });

    if (error) throw error;

    return NextResponse.json({ success: true, rate: rateIdr });
  } catch (error: any) {
    console.error('Cron sync failed:', error);
    return NextResponse.json({ error: 'Sync failed' }, { status: 500 });
  }
}
