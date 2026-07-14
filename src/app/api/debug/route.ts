import { NextResponse } from 'next/server';

export async function GET() {
  // Ini buat ngecek apakah ENV lu beneran kebaca sama Vercel/Local
  const geoapify = process.env.GEOAPIFY_API_KEY;
  const exchange = process.env.EXCHANGE_RATE_API_KEY;
  
  return NextResponse.json({
    geoapify_configured: !!geoapify,
    geoapify_key_hint: geoapify ? `ends with ${geoapify.slice(-4)}` : "MISSING",
    exchange_configured: !!exchange,
    exchange_key_hint: exchange ? `ends with ${exchange.slice(-4)}` : "MISSING",
  });
}