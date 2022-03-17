const osMap = {
  "19": "10.15-Catalina",
  "20": "11-BigSur",
}

let getPkgURL = function (osVersion, pkgVersion) {
  const osMajorRE = /^Darwin Kernel Version (\d+)\./;
  const osMatch = osMajorRE.exec(osVersion);
  if (osMatch === null) {
    throw new Error(`unrecognized OS version: ${osVersion}`);
  }
  const osMajor = osMatch[1];
  const osStr = osMap[osMajor];
  if (osStr === undefined) {
    throw new Error(`unsupported OS version: ${osVersion}`);
  }
  return `https://github.com/macports/macports-base/releases/download/v${pkgVersion}/MacPorts-${pkgVersion}-${osStr}.pkg`;
}

module.exports.getPkgURL = getPkgURL;
