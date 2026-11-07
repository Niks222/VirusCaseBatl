async function fetchFragmentPrices() {
  try {
    const res = await fetch('https://fragment.com/gifts', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
      }
    });
    const html = await res.text();
    
    // Look for rows
    const rowRegex = /<tr[^>]*>([\s\S]*?)<\/tr>/g;
    let match;
    const items = [];
    while ((match = rowRegex.exec(html)) !== null) {
      const row = match[1];
      const nameMatch = row.match(/class="table-cell-value tm-value">([^<]+)<\/div>/);
      const subMatch = row.match(/class="table-cell-desc">([^<]+)<\/div>/);
      const priceMatch = row.match(/<div class="table-cell-value tm-value icon-before icon-ton">([^<]+)<\/div>/);
      const statusMatch = row.match(/class="table-cell-value status-[^"]*">([^<]+)<\/div>/);
      
      if (nameMatch || priceMatch) {
        items.push({
          name: nameMatch ? nameMatch[1].trim() : '',
          sub: subMatch ? subMatch[1].trim() : '',
          priceTon: priceMatch ? priceMatch[1].trim() : '',
          status: statusMatch ? statusMatch[1].trim() : ''
        });
      }
    }
    
    console.log('Found Fragment items:', items.slice(0, 20));
  } catch (err) {
    console.error(err);
  }
}

fetchFragmentPrices();
