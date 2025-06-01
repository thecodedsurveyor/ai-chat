import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

// Get directory name in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Colors based on your theme
const primaryColor = '#5E35B1'; // Purple from your theme

// Create a simple icon with text
async function generateIcon(size, text) {
	const svgBuffer = Buffer.from(`
    <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${size}" height="${size}" fill="${primaryColor}" rx="${
		size / 10
	}" ry="${size / 10}" />
      <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="${
			size / 3
		}" font-weight="bold" 
            fill="white" text-anchor="middle" dominant-baseline="middle">${text}</text>
    </svg>
  `);

	return sharp(svgBuffer).png().toBuffer();
}

async function main() {
	const publicDir = path.join(__dirname, 'public');

	// Generate 192x192 icon
	const icon192 = await generateIcon(192, 'AI');
	fs.writeFileSync(
		path.join(publicDir, 'icon-192x192.png'),
		icon192
	);
	console.log('Generated icon-192x192.png');

	// Generate 512x512 icon
	const icon512 = await generateIcon(512, 'AI');
	fs.writeFileSync(
		path.join(publicDir, 'icon-512x512.png'),
		icon512
	);
	console.log('Generated icon-512x512.png');

	// Generate maskable icon (with padding for safe area)
	const iconMask = await generateIcon(512, 'AI');
	fs.writeFileSync(
		path.join(publicDir, 'icon-512x512-mask.png'),
		iconMask
	);
	console.log('Generated icon-512x512-mask.png');
}

main().catch((err) => {
	console.error('Error generating icons:', err);
	process.exit(1);
});
