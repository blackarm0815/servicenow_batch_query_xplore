"use strict";
//
var badData = [];
var dataCi = {};
var dataHardware = {};
var dataHardwareSku = {};
var dataModel = {};
var uniqueSysIdCi = {};
var uniqueSysIdHardwareSku = {};
var uniqueSysIdModel = {};
//
var passSku = function (sysIdHardware) {
  //
  var testSkuSysId = dataHardware[sysIdHardware].hardwareSkuSysId;
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
  var testCiSysId = dataHardware[sysIdHardware].ciSysId;
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
var filterModelCategory = function (sysIdHardware) {
  //
  var acceptable = {
    KVM: true,
    'Network Gear': true,
    'Server Chassis': true,
    'Server Standalone': true,
    'Storage Appliance': true,
    'Storage Appliance Chassis': true,
    'Storage Shelf': true,
    'PDU Horizontal': true,
    'Physical Appliance': true,
    'Server Sled': true,
    'Storage Appliance Sled': true,
  };
  var modelCategory;
  var testModelSysId = dataHardware[sysIdHardware].modelSysId;
  //
  if (Object.prototype.hasOwnProperty.call(dataModel, testModelSysId)) {
    modelCategory = dataModel[testModelSysId].modelCategory;
    if (modelCategory !== null) {
      if (Object.prototype.hasOwnProperty.call(acceptable, modelCategory)) {
        testHardware(sysIdHardware);
      }
    }
  }
};
var testDataLoop = function () {
  Object.keys(dataHardware).forEach(function (sysIdHardware) {
    filterModelCategory(sysIdHardware);
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
  var grSku = new GlideRecord('u_hardware_sku_configurations');
  grSku.addQuery('sys_id', 'IN', Object.keys(uniqueSysIdHardwareSku));
  grSku.query();
  while (grSku.next()) {
    testSysId = checkString(grSku.getUniqueValue());
    testDerate = checkFloat(grSku.getValue('u_derate_kw'));
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
var getModel = function () {
  //
  var testSysId;
  var testModelCategory;
  //
  var grModel = new GlideRecord('cmdb_hardware_product_model');
  grModel.addQuery('sys_id', 'IN', Object.keys(uniqueSysIdModel));
  grModel.query();
  while (grModel.next()) {
    testSysId = checkString(grModel.getUniqueValue());
    testModelCategory = checkString(grModel.getDisplayValue('u_device_category'));
    if (testSysId !== null) {
      dataModel[testSysId] = {
        modelCategory: testModelCategory,
      };
    }
  }
};
var getHardware = function (roomString) {
  //
  var testCiSysId;
  var testHardwareSkuSysId;
  var testModelSysId;
  var testSysId;
  //
  var grHardware = new GlideRecord('alm_hardware');
  grHardware.addQuery("u_rackSTARTSWITH".concat(roomString));
  grHardware.addQuery('modelISNOTEMPTY');
  grHardware.query();
  while (grHardware.next()) {
    testCiSysId = checkString(grHardware.getValue('ci'));
    testHardwareSkuSysId = checkString(grHardware.getValue('u_hardware_sku'));
    testModelSysId = checkString(grHardware.getValue('model'));
    testSysId = checkString(grHardware.getUniqueValue());
    if (testSysId !== null && testModelSysId !== null) {
      dataHardware[testSysId] = {
        hardwareSkuSysId: testHardwareSkuSysId,
        ciSysId: testCiSysId,
        modelSysId: testModelSysId,
      };
      if (testCiSysId !== null) {
        uniqueSysIdCi[testCiSysId] = true;
      }
      if (testHardwareSkuSysId !== null) {
        uniqueSysIdHardwareSku[testHardwareSkuSysId] = true;
      }
      uniqueSysIdModel[testModelSysId] = true;
    }
  }
};
var main = function () {
  //
  var report = '\n\n';
  // the values in this datastructure could be used to store
  // room metadata sys_ids if results would be stored there
  var roomNameMetaSysid = {
    p3sa: '',
    p3sb: '',
    p3sc: '',
    p3sd: '',
    p3se: '',
    p3sf: '',
    p3sg: '',
    p3sh: '',
    p3si: '',
    p3sj: '',
  };
  //
  Object.keys(roomNameMetaSysid).forEach(function (roomName) {
    badData = [];
    dataCi = {};
    dataHardware = {};
    dataHardwareSku = {};
    dataModel = {};
    uniqueSysIdCi = {};
    uniqueSysIdHardwareSku = {};
    uniqueSysIdModel = {};
    getHardware(roomName);
    getCi();
    getHardwareSku();
    getModel();
    testDataLoop();
    report += '<div style = "border:1px solid #c4c4c4; padding: 10px; margin: 10px;">';
    report += '<div style = "font-size: 150%">';
    report += roomName;
    report += '</div>';
    report += "Total notLiveNoDerate = ".concat(badData.length);
    report += '\n';
    report += '<a href = "';
    report += '/alm_hardware_list.do?sysparm_query=sys_idIN';
    report += badData.join('%2C');
    report += '" target = "_blank">View in alm_hardware</a>';
    report += '</div>';
    report += '\n';
  });
  gs.print(report);
  // gs.print(dataModel);
  // gs.print('dataModel');
  // gs.print(dataModel);
  // gs.print('dataHardware');
  // gs.print(dataHardware);
  // gs.print('dataCi');
  // gs.print(dataCi);
  // gs.print('dataHardwareSku');
  // gs.print(dataHardwareSku);
};
main();
