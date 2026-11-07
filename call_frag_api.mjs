async function callFragApi() {
  const res = await fetch('https://fragment.com/api?hash=0387bd0d549d7dbb0f', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      'X-Requested-With': 'XMLHttpRequest',
      'User-Agent': 'Mozilla/5.0'
    },
    body: 'type=gifts&method=searchGifts&query=&filter=all&sort=price_asc'
  });
  const data = await res.json();
  console.log(data);
}
callFragApi();
