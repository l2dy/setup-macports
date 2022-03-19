const httpm = require('@actions/http-client');

const osMap = {
  "19": "10.15-Catalina",
  "20": "11-BigSur",
}

function regexpCapture(regexp, s) {
  let match = regexp.exec(s);
  if (match === null) {
    return ""
  }
  return match[1];
}

let getLatestVersion = async function() {
  const versionRE = /v([0-9.]+)$/;
  const RELEASE_URL = 'https://raw.githubusercontent.com/macports/macports-base/master/config/RELEASE_URL';
  const http = new httpm.HttpClient();
  let res = await http.get(RELEASE_URL);
  if (res.message.statusCode !== 200) {
    throw new Error(`fetch RELEASE_URL failed, status ${res.message.statusCode}`);
  }
  let body = await res.readBody();
  let version = regexpCapture(versionRE, body.trim());
  if (version === "") {
    throw new Error(`RELEASE_URL match failed: ${body}`);
  }
  return version;
}

let getPkgURL = function(osVersion, pkgVersion) {
  const osMajorRE = /^Darwin Kernel Version (\d+)\./;
  const osMajor = regexpCapture(osMajorRE, osVersion);
  if (osMajor === "") {
    throw new Error(`unrecognized OS version: ${osVersion}`);
  }
  const osStr = osMap[osMajor];
  if (osStr === undefined) {
    throw new Error(`unsupported OS version: ${osVersion}`);
  }
  return `https://github.com/macports/macports-base/releases/download/v${pkgVersion}/MacPorts-${pkgVersion}-${osStr}.pkg`;
}

module.exports = { getPkgURL, getLatestVersion };
