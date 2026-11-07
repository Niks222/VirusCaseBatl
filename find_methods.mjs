async function findFragMethods() {
  const res = await fetch('https://fragment.com/js/main.js');
  const js = await res.text();
  const matches = js.match(/method:\s*['"]([^'"]+)['"]/g) || [];
  console.log('Methods:', [...new Set(matches)]);
}
findFragMethods();
