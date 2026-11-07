async function checkTable() {
  const res = await fetch('https://fragment.com/gifts');
  const html = await res.text();
  // Find price rows
  const rows = html.match(/class="table-cell[^"]*"[^>]*>([^<]+)<\//g) || [];
  console.log('Sample cells:', rows.slice(0, 30));
}
checkTable();
