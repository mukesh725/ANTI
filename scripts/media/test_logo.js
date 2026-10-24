async function test() {
  const url = 'https://airoessentials.com/templates/gold.jpg';
  const res = await fetch(url);
  console.log(res.status, res.headers.get('content-type'));
}
test();
