const modules = [
  'express',
  'http-proxy-middleware',
  'cors',
  'swagger-ui-express',
  'yamljs',
  'dotenv',
  'sqlite3',
  'bcryptjs',
  'jsonwebtoken',
  'axios',
  'http-proxy',
  'inflight',
  'glob'
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
