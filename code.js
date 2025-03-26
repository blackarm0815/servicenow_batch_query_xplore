"use strict";
var badData = [];
var dataCi = {};
var dataHardware = {};
var dataHardwareSku = {};
var uniqueSysIdCi = {};
var uniqueSysIdHardwareSku = {};
var passSku = function (sysIdHardware) {
  //
  var testSkuSysId = dataHardware[sysIdHardware].hardwareSku;
  //
  // does the hardware sku reference exist
  if (testSkuSysId !== null) {
    // was it found in the sku data
    if (Object.prototype.hasOwnProperty.call(dataHardwareSku, testSkuSysId)) {
      // did it have a derate value
      if (dataHardwareSku[testSkuSysId].derate !== null) {
        return true;
      }
    }
  }
  return false;
};
var passCi = function (sysIdHardware) {
  //
  var testCiSysId = dataHardware[sysIdHardware].ci;
  //
  // does the ci reference exist
  if (testCiSysId !== null) {
    // was it found in the ci data
    if (Object.prototype.hasOwnProperty.call(dataCi, testCiSysId)) {
      // did it have an install status of live
      if (dataCi[testCiSysId].installStatus === 1) {
        return true;
      }
    }
  }
  return false;
};
var testHardware = function (sysIdHardware) {
  // store alm_hardware sys_ids for assets that do not pass either test
  if (!passCi(sysIdHardware) && !passSku(sysIdHardware)) {
    badData.push(sysIdHardware);
  }
};
var testDataLoop = function () {
  Object.keys(dataHardware).forEach(function (sysIdHardware) {
    testHardware(sysIdHardware);
  });
};
var checkInteger = function (testVariable) {
  if (typeof testVariable === 'string') {
    if (!Number.isNaN(parseInt(testVariable, 10))) {
      return parseInt(testVariable, 10);
    }
  }
  return null;
};
var checkFloat = function (testVariable) {
  if (typeof testVariable === 'string') {
    if (!Number.isNaN(parseFloat(testVariable))) {
      return parseFloat(testVariable);
    }
  }
  return null;
};
var checkString = function (testVariable) {
  if (typeof testVariable === 'string') {
    if (testVariable !== '') {
      return testVariable;
    }
  }
  return null;
};
var getHardwareSku = function () {
  //
  var testSysId;
  var testDerate;
  //
  var grCi = new GlideRecord('u_hardware_sku_configurations');
  grCi.addQuery('sys_id', 'IN', Object.keys(uniqueSysIdHardwareSku));
  grCi.query();
  while (grCi.next()) {
    testSysId = checkString(grCi.getUniqueValue());
    testDerate = checkFloat(grCi.getValue('u_derate_kw'));
    if (testSysId !== null) {
      dataHardwareSku[testSysId] = {
        derate: testDerate,
      };
    }
  }
};
var getCi = function () {
  //
  var testSysId;
  var testInstallStatus;
  //
  var grCi = new GlideRecord('cmdb_ci_hardware');
  grCi.addQuery('sys_id', 'IN', Object.keys(uniqueSysIdCi));
  grCi.query();
  while (grCi.next()) {
    testSysId = checkString(grCi.getUniqueValue());
    testInstallStatus = checkInteger(grCi.getValue('install_status'));
    if (testSysId !== null) {
      dataCi[testSysId] = {
        installStatus: testInstallStatus,
      };
    }
  }
};
var getHardware = function () {
  //
  var testSysId;
  var testHardwareSku;
  var testCi;
  //
  var grHardware = new GlideRecord('alm_hardware');
  grHardware.addQuery('u_rackSTARTSWITHp3sj');
  grHardware.query();
  while (grHardware.next()) {
    testSysId = checkString(grHardware.getUniqueValue());
    testHardwareSku = checkString(grHardware.getValue('u_hardware_sku'));
    testCi = checkString(grHardware.getValue('ci'));
    if (testSysId !== null) {
      dataHardware[testSysId] = {
        hardwareSku: testHardwareSku,
        ci: testCi,
      };
      if (testCi !== null) {
        uniqueSysIdCi[testCi] = true;
      }
      if (testHardwareSku !== null) {
        uniqueSysIdHardwareSku[testHardwareSku] = true;
      }
    }
  }
};
var main = function () {
  getHardware();
  getCi();
  getHardwareSku();
  testDataLoop();
  gs.print('badData');
  gs.print(badData);
  gs.print('dataHardware');
  gs.print(dataHardware);
  gs.print('dataCi');
  gs.print(dataCi);
  gs.print('dataHardwareSku');
  gs.print(dataHardwareSku);
};
main();
