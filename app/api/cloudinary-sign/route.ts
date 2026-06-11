import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    const { folder } = await request.json();
    
    const timestamp = Math.round(new Date().getTime() / 1000).toString();
    const apiSecret = process.env.CLOUDINARY_API_SECRET;
    
    if (!apiSecret) {
      return NextResponse.json({ error: 'CLOUDINARY_API_SECRET is not defined' }, { status: 500 });
    }

    // Parameters must be sorted alphabetically before signing
    const paramsToSign = `folder=${folder || 'trendoptik/products'}&timestamp=${timestamp}${apiSecret}`;
    
    const signature = crypto
      .createHash('sha1')
      .update(paramsToSign)
      .digest('hex');

    return NextResponse.json({
      timestamp,
      signature,
      folder: folder || 'trendoptik/products'
    });
  } catch (error) {
    console.error('Cloudinary sign error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
