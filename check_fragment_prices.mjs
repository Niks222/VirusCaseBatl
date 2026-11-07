async function getFragmentPrices() {
  const collections = ['resistancedog', 'durovscap', 'swisswatch', 'heartlocket', 'heroichelmet', 'plushpepe'];
  for (const c of collections) {
    try {
      const res = await fetch(`https://fragment.com/gifts/${c}`);
      const html = await res.text();
      // find prices with TON symbol
      const prices = html.match(/<div class="table-cell-value[^>]*>([0-9.,]+)\s*TON<\/div>/gi) || [];
      console.log(c, prices.slice(0, 3));
    } catch (e) {
      console.error(c, e.message);
    }
  }
}
getFragmentPrices();
