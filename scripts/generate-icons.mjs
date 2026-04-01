import sharp from "sharp";
import { writeFileSync, mkdirSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = join(__dirname, "..", "public");

if (!existsSync(publicDir)) mkdirSync(publicDir);

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#00D4AA"/>
      <stop offset="100%" stop-color="#00BFA6"/>
    </linearGradient>
    <linearGradient id="feather1" x1="0" y1="1" x2="0.5" y2="0">
      <stop offset="0%" stop-color="#66E060"/>
      <stop offset="100%" stop-color="#AAFF44"/>
    </linearGradient>
    <linearGradient id="feather2" x1="0.5" y1="1" x2="1" y2="0">
      <stop offset="0%" stop-color="#66E060"/>
      <stop offset="100%" stop-color="#88FF33"/>
    </linearGradient>
    <radialGradient id="shine" cx="0.3" cy="0.3" r="0.5">
      <stop offset="0%" stop-color="white" stop-opacity="0.18"/>
      <stop offset="100%" stop-color="white" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <!-- Body: rounded square -->
  <rect x="16" y="48" width="480" height="448" rx="110" ry="110" fill="url(#bg)"/>

  <!-- Subtle shine overlay -->
  <ellipse cx="175" cy="195" rx="110" ry="130" fill="url(#shine)" transform="rotate(-20 175 195)"/>

  <!-- Feather/leaf on top -->
  <ellipse cx="235" cy="62" rx="28" ry="50" fill="url(#feather1)" transform="rotate(-20 235 62)"/>
  <ellipse cx="275" cy="58" rx="26" ry="48" fill="url(#feather2)" transform="rotate(15 275 58)"/>

  <!-- Left eye white -->
  <circle cx="185" cy="245" r="62" fill="white"/>
  <!-- Left eye pupil -->
  <circle cx="195" cy="252" r="38" fill="#1A2E35"/>
  <!-- Left eye highlight -->
  <circle cx="180" cy="237" r="10" fill="white"/>

  <!-- Right eye white -->
  <circle cx="327" cy="245" r="62" fill="white"/>
  <!-- Right eye pupil -->
  <circle cx="337" cy="252" r="38" fill="#1A2E35"/>
  <!-- Right eye highlight -->
  <circle cx="322" cy="237" r="10" fill="white"/>

  <!-- Left cheek blush -->
  <ellipse cx="130" cy="330" rx="35" ry="20" fill="#009975" opacity="0.45"/>
  <!-- Right cheek blush -->
  <ellipse cx="382" cy="330" rx="35" ry="20" fill="#009975" opacity="0.45"/>

  <!-- Beak -->
  <ellipse cx="256" cy="330" rx="28" ry="20" fill="#FFB74D"/>
  <ellipse cx="256" cy="325" rx="26" ry="16" fill="#FFCC66"/>

  <!-- Smile -->
  <path d="M 200 370 Q 256 410 312 370" fill="none" stroke="#007A66" stroke-width="5" stroke-linecap="round"/>
</svg>`;

writeFileSync(join(publicDir, "tuti-icon.svg"), svg);
console.log("Created tuti-icon.svg");

const svgBuffer = Buffer.from(svg);

const sizes = [
  { name: "favicon-32.png", size: 32 },
  { name: "favicon-16.png", size: 16 },
  { name: "apple-touch-icon.png", size: 180 },
  { name: "icon-192.png", size: 192 },
  { name: "icon-512.png", size: 512 },
  { name: "og-icon.png", size: 400 },
];

for (const { name, size } of sizes) {
  await sharp(svgBuffer)
    .resize(size, size)
    .png()
    .toFile(join(publicDir, name));
  console.log(`Created ${name} (${size}x${size})`);
}

// Generate ICO (use 32x32 PNG as base, wrap in ICO format)
const png32 = await sharp(svgBuffer).resize(32, 32).png().toBuffer();
const png16 = await sharp(svgBuffer).resize(16, 16).png().toBuffer();

function createIco(pngBuffers) {
  const images = pngBuffers.map((buf) => {
    return { png: buf, size: Math.round(Math.sqrt(buf.length / 4)) };
  });

  let offset = 6 + images.length * 16;
  const dirEntries = [];
  const imageDataParts = [];

  for (const img of images) {
    const w = img.png === png16 ? 16 : 32;
    const h = w;
    const entry = Buffer.alloc(16);
    entry.writeUInt8(w === 256 ? 0 : w, 0);
    entry.writeUInt8(h === 256 ? 0 : h, 1);
    entry.writeUInt8(0, 2);
    entry.writeUInt8(0, 3);
    entry.writeUInt16LE(1, 4);
    entry.writeUInt16LE(32, 6);
    entry.writeUInt32LE(img.png.length, 8);
    entry.writeUInt32LE(offset, 12);
    dirEntries.push(entry);
    imageDataParts.push(img.png);
    offset += img.png.length;
  }

  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(images.length, 4);

  return Buffer.concat([header, ...dirEntries, ...imageDataParts]);
}

const ico = createIco([png16, png32]);
writeFileSync(join(publicDir, "favicon.ico"), ico);
console.log("Created favicon.ico");

console.log("\nAll icons generated successfully!");
