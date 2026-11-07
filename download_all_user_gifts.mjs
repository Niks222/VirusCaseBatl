import fs from 'fs';
import path from 'path';

const outDir = './frontend/public/assets/gifts';
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

// Map of folder in sendboc/Gifts-Assets to our local filename
const downloads = [
  // Non-NFT items
  { folder: 'Valentine Box', file: 'heart_box.png' },
  { folder: 'Berry Box', file: 'present_box.png' },
  { folder: 'Mini Oscar', file: 'trophy.png' },
  { folder: 'Lush Bouquet', file: 'bouquet.png' },

  // NFT Resale items
  { folder: 'Snoop Dogg', file: 'snoop_dog.png' },
  { folder: 'Snoop Cigar', file: 'snoop_cigar.png' },
  { folder: 'Candy Cane', file: 'candy_cane.png' },
  { folder: 'Clover Pin', file: 'clover_pin.png' },
  { folder: 'Light Sword', file: 'light_sword.png' },
  { folder: 'Jester Hat', file: 'jester_hat.png' },
  { folder: 'Instant Ramen', file: 'instant_ramen.png' },
  { folder: 'Ice Cream', file: 'ice_cream.png' },
  { folder: 'Cookie Heart', file: 'cookie_heart.png' },
  { folder: 'B-Day Candle', file: 'bday_candle.png' },
  { folder: 'Mousse Cake', file: 'cherry_cake.png' },
  { folder: 'Spring Basket', file: 'easter_bunny.png' },
  { folder: 'Lunar Snake', file: 'snake_2025.png' },
  { folder: 'Snake Box', file: 'snake_box.png' },
  { folder: 'Genie Lamp', file: 'lantern.png' },
  { folder: 'Swag Bag', file: 'weed_bag.png' },
  { folder: 'Loot Bag', file: 'backpack.png' },
  { folder: 'Money Pot', file: 'money_bouquet.png' },
  { folder: 'Holiday Drink', file: 'cupcake_8.png' }
];

async function run() {
  for (const item of downloads) {
    try {
      const url = `https://api.github.com/repos/sendboc/Gifts-Assets/contents/${encodeURIComponent(item.folder)}`;
      const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
      const files = await res.json();
      if (Array.isArray(files)) {
        const pick = files.find(f => f.name.endsWith('.png')) || files[0];
        if (pick && pick.download_url) {
          const imgRes = await fetch(pick.download_url);
          const buf = await imgRes.arrayBuffer();
          const dest = path.join(outDir, item.file);
          fs.writeFileSync(dest, Buffer.from(buf));
          console.log(`[SAVED] ${item.file} (${buf.byteLength} bytes)`);
        }
      } else {
        console.log(`[NOT FOUND] ${item.folder}`);
      }
    } catch (e) {
      console.error(item.folder, e.message);
    }
  }
}
run();
