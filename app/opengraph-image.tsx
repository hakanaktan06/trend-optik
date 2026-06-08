import { ImageResponse } from 'next/og';
 
export const runtime = 'edge';
export const alt = 'Trend Optik Mersin';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
 
export default function Image() {
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
          position: 'relative',
        }}
      >
        {/* Subtle background glow */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '600px',
            height: '600px',
            background: 'radial-gradient(circle, rgba(234,88,12,0.15) 0%, rgba(0,0,0,0) 70%)',
            borderRadius: '50%',
          }}
        />
        
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', zIndex: 10 }}>
          <h1
            style={{
              fontSize: 140,
              color: '#ea580c', // Koyu turuncu
              margin: 0,
              fontWeight: 900,
              fontFamily: 'sans-serif',
              letterSpacing: '-0.02em',
            }}
          >
            Trend Optik
          </h1>
          <span
            style={{
              fontSize: 45,
              color: '#ffffff', // Beyaz
              marginTop: -10,
              fontWeight: 600,
              fontFamily: 'sans-serif',
              letterSpacing: '0.2em',
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
