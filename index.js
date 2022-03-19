const os = require('os');
const path = require('path');
const fs = require('fs');
const tmp = require('tmp-promise');

const core = require('@actions/core');
const io = require('@actions/io');
const exec = require('@actions/exec');
const tc = require('@actions/tool-cache');

const mputil = require('./mputil');

// most @actions toolkit packages have async methods
async function run() {
  try {
    await fs.promises.access('/opt/local/bin/port', fs.constants.R_OK | fs.constants.X_OK);
    core.info(`MacPorts installed, skipping...`);
    return
  } catch (error) {
    core.debug(`MacPorts not installed`);
  }

  try {
    let platform = os.platform();
    if (platform !== 'darwin') {
      throw new Error(`platform is not darwin`);
    }

    let version = core.getInput('macports-version');
    if (version === '') {
      version = await mputil.getLatestVersion();
    }
    core.info(`Downloading MacPorts ${version}...`);
    const pkgURL = mputil.getPkgURL(os.version(), version);
    const pkgPath = await tc.downloadTool(pkgURL);

    const tmpDir = await tmp.dir();
    const tmpPath = path.join(tmpDir.path, 'macports.pkg');
    await io.cp(pkgPath, tmpPath);

    core.info(`Installing MacPorts ${version}...`);
    await exec.exec('sudo', ['installer', '-package', tmpPath, '-target', '/']);

    core.info(`MacPorts installed, adding to PATH...`);
    core.addPath('/opt/local/bin');

    core.debug('Cleanup');
    await io.rmRF(tmpDir.path);
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
