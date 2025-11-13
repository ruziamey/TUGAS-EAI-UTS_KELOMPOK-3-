const modules = [
  'express',
  'http-proxy-middleware',
  'cors',
  'swagger-ui-express',
  'yamljs',
  'dotenv',
  'http-proxy'
];

for (const m of modules) {
  try {
    console.log('-> requiring', m);
    require(m);
    console.log('   ok', m);
  } catch (e) {
    console.log('   fail', m, '-', e.message);
  }
}
console.log('done');
