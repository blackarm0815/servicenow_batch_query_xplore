interface GlideRecord {
  addEncodedQuery: Function,
  addNotNullQuery: Function;
  addQuery: Function,
  getDisplayValue: Function,
  getUniqueValue: Function,
  getValue: Function,
  next: Function,
  query: Function,
  setLimit: Function,
  update: Function,
}
interface DataCi {
  installStatus: number | null;
}
interface DataHardware {
  ciSysId: string | null;
  hardwareSkuSysId: string | null;
  modelSysId: string,
}
interface DataHardwareSku {
  derate: number | null;
}
interface DataModel {
  modelCategory: string | null;
}
//
let badData: Array<string> = [];
let dataCi: Record<string, DataCi> = {};
let dataHardware: Record<string, DataHardware> = {};
let dataHardwareSku: Record<string, DataHardwareSku> = {};
let dataModel: Record<string, DataModel> = {};
let uniqueSysIdCi: Record<string, boolean> = {};
let uniqueSysIdHardwareSku: Record<string, boolean> = {};
let uniqueSysIdModel: Record<string, boolean> = {};
//
const passSku = (
  sysIdHardware: string,
) => {
  //
  const testSkuSysId = dataHardware[sysIdHardware].hardwareSkuSysId;
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
const passCi = (
  sysIdHardware: string,
) => {
  //
  const testCiSysId = dataHardware[sysIdHardware].ciSysId;
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
const testHardware = (
  sysIdHardware: string,
) => {
  // store alm_hardware sys_ids for assets that do not pass either test
  if (!passCi(sysIdHardware) && !passSku(sysIdHardware)) {
    badData.push(sysIdHardware);
  }
};
const filterModelCategory = (
  sysIdHardware: string,
) => {
  //
  const acceptable: Record<string, boolean> = {
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
  let modelCategory: string | null;
  const testModelSysId = dataHardware[sysIdHardware].modelSysId;
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
const testDataLoop = () => {
  Object.keys(dataHardware).forEach((sysIdHardware) => {
    filterModelCategory(sysIdHardware);
  });
};
const checkInteger = (
  testVariable: unknown,
) => {
  if (typeof testVariable === 'string') {
    if (!Number.isNaN(parseInt(testVariable, 10))) {
      return parseInt(testVariable, 10);
    }
  }
  return null;
};
const checkFloat = (
  testVariable: unknown,
) => {
  if (typeof testVariable === 'string') {
    if (!Number.isNaN(parseFloat(testVariable))) {
      return parseFloat(testVariable);
    }
  }
  return null;
};
const checkString = (
  testVariable: unknown,
) => {
  if (typeof testVariable === 'string') {
    if (testVariable !== '') {
      return testVariable;
    }
  }
  return null;
};
const getHardwareSku = () => {
  //
  let testSysId: string | null;
  let testDerate: number | null;
  //
  // @ts-ignore
  const grSku: GlideRecord = new GlideRecord('u_hardware_sku_configurations');
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
const getCi = () => {
  //
  let testSysId: string | null;
  let testInstallStatus: number | null;
  //
  // @ts-ignore
  const grCi: GlideRecord = new GlideRecord('cmdb_ci_hardware');
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
const getModel = () => {
  //
  let testSysId: string | null;
  let testModelCategory: string | null;
  //
  // @ts-ignore
  const grModel: GlideRecord = new GlideRecord('cmdb_hardware_product_model');
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
const getHardware = (
  roomString: string,
) => {
  //
  let testCiSysId: string | null;
  let testHardwareSkuSysId: string | null;
  let testModelSysId: string | null;
  let testSysId: string | null;
  //
  // @ts-ignore
  const grHardware: GlideRecord = new GlideRecord('alm_hardware');
  grHardware.addQuery(`u_rackSTARTSWITH${roomString}`);
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
const main = () => {
  //
  let report = '\n\n';
  // the values in this datastructure could be used to store
  // room metadata sys_ids if results would be stored there
  const roomNameMetaSysid: Record<string, string> = {
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
  Object.keys(roomNameMetaSysid).forEach((roomName) => {
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
    report += `Total notLiveNoDerate = ${badData.length}`;
    report += '\n';
    report += '<a href = "';
    report += '/alm_hardware_list.do?sysparm_query=sys_idIN';
    report += badData.join('%2C');
    report += '" target = "_blank">View in alm_hardware</a>';
    report += '</div>';
    report += '\n';
  });
  // @ts-ignore
  gs.print(report);
  // // @ts-ignore
  // gs.print(dataModel);
  // // @ts-ignore
  // gs.print('dataModel');
  // // @ts-ignore
  // gs.print(dataModel);
  // // @ts-ignore
  // gs.print('dataHardware');
  // // @ts-ignore
  // gs.print(dataHardware);
  // // @ts-ignore
  // gs.print('dataCi');
  // // @ts-ignore
  // gs.print(dataCi);
  // // @ts-ignore
  // gs.print('dataHardwareSku');
  // // @ts-ignore
  // gs.print(dataHardwareSku);
};
main();
