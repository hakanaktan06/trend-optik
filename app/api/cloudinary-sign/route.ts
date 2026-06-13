import { NextResponse } from 'next/server';
import crypto from 'crypto';

function buildSignedResponse(folder?: string) {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    return NextResponse.json(
      { error: 'Cloudinary ortam değişkenleri eksik (CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET)' },
      { status: 500 }
    );
  }

  const resolvedFolder = folder || 'trendoptik/products';
  const timestamp = Math.round(Date.now() / 1000).toString();

  // Parameters must be sorted alphabetically before signing
  const paramsToSign = `folder=${resolvedFolder}&timestamp=${timestamp}${apiSecret}`;
  const signature = crypto.createHash('sha1').update(paramsToSign).digest('hex');

  return NextResponse.json({ timestamp, signature, folder: resolvedFolder, cloudName, apiKey });
}

// GET — used by logo upload (no body needed, default folder)
export async function GET() {
  return buildSignedResponse();
}

// POST — used by product/brand image uploads (optional folder in body)
export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    return buildSignedResponse(body?.folder);
  } catch (error) {
    console.error('Cloudinary sign error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
