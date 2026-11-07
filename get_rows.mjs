async function getRows() {
  const res = await fetch('https://fragment.com/gifts');
  const html = await res.text();
  const matches = html.match(/<tr[^>]*>[\s\S]*?<\/tr>/g) || [];
  console.log('Total rows:', matches.length);
  if (matches.length > 1) {
    console.log(matches[1]);
  }
}
getRows();
