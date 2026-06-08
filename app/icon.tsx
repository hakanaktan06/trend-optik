import { ImageResponse } from 'next/og';
 
export const runtime = 'edge';
export const size = { width: 512, height: 512 };
export const contentType = 'image/png';
 
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#050505',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', marginTop: 40 }}>
          <h1
            style={{
              fontSize: 120,
              color: '#ea580c',
              margin: 0,
              fontWeight: 900,
              lineHeight: 0.9,
              fontFamily: 'sans-serif',
              letterSpacing: '-0.05em',
            }}
          >
            Trend
          </h1>
          <h1
            style={{
              fontSize: 120,
              color: '#ea580c',
              margin: 0,
              fontWeight: 900,
              lineHeight: 0.9,
              fontFamily: 'sans-serif',
              letterSpacing: '-0.05em',
            }}
          >
            Optik
          </h1>
          <span
            style={{
              fontSize: 35,
              color: '#ffffff',
              marginTop: 15,
              fontWeight: 600,
              fontFamily: 'sans-serif',
              letterSpacing: '0.1em',
            }}
          >
            MERSİN
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}
