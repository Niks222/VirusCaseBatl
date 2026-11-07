async function getApi() {
  const res = await fetch('https://fragment.com/gifts');
  const html = await res.text();
  const scriptMatches = html.match(/ajInit\([^)]+\)/g) || [];
  console.log('ajInit:', scriptMatches);
  const jsonMatches = html.match(/TMBid\.init\([^)]+\)/g) || [];
  console.log('TMBid:', jsonMatches);
}
getApi();
