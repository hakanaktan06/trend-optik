const fs = require('fs');
const path = require('path');
const ffmpeg = require('ffmpeg-static');
const { execFile } = require('child_process');

const framesDir = path.join(__dirname, 'public', 'frames');

// Create frames directory if it doesn't exist
if (!fs.existsSync(framesDir)) {
  fs.mkdirSync(framesDir, { recursive: true });
}

console.log('Extracting frames for buttery smooth mobile experience...');

const child = execFile(ffmpeg, [
  '-y',
  '-i', 'public/hero-video.mp4',
  '-vf', 'fps=30,scale=1080:-1', // 30 FPS is smooth, 1080 width
  '-c:v', 'libwebp',
  '-quality', '80', // Good compression
  'public/frames/frame_%04d.webp'
]);

child.stdout.on('data', data => process.stdout.write(data));
child.stderr.on('data', data => process.stderr.write(data));

child.on('close', code => {
  console.log(`Extraction finished with code ${code}`);
  
  // Count frames
  const files = fs.readdirSync(framesDir).filter(f => f.endsWith('.webp'));
  console.log(`Total frames extracted: ${files.length}`);
  
  // Save frame count to a JSON so Next.js knows how many frames exist
  fs.writeFileSync(
    path.join(__dirname, 'public', 'frames.json'),
    JSON.stringify({ frameCount: files.length })
  );
});
