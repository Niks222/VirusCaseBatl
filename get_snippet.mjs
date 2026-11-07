async function getSnippet() {
  const res = await fetch('https://fragment.com/gifts');
  const html = await res.text();
  const giftIndex = html.indexOf('tm-table-wrap');
  if (giftIndex !== -1) {
    console.log(html.slice(giftIndex, giftIndex + 1200));
  } else {
    console.log(html.slice(0, 1000));
  }
}
getSnippet();
