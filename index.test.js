const mputil = require('./mputil');
const process = require('process');
const cp = require('child_process');
const path = require('path');

const MACPORTS_VERSION = '2.7.2';

test('generates pkg URL', () => {
  const url = mputil.getPkgURL('Darwin Kernel Version 19.6.0', MACPORTS_VERSION);
  expect(url).toEqual('https://github.com/macports/macports-base/releases/download/v2.7.2/MacPorts-2.7.2-10.15-Catalina.pkg');
})

test('fetch latest version', async () => {
  const version = await mputil.getLatestVersion();
  expect(/^\d/.exec(version)).not.toBeNull();
})

// shows how the runner will run a javascript action with env / stdout protocol
test('test runs', () => {
  process.env['INPUT_MACPORTS-VERSION'] = MACPORTS_VERSION;
  const ip = path.join(__dirname, 'index.js');
  const result = cp.execSync(`node ${ip}`, {env: process.env}).toString();
  console.log(result);
})
