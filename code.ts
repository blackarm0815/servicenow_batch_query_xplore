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
  ci: string | null;
  hardwareSku: string | null;
}
interface DataHardwareSku {
  derate: number | null;
}
const badData: Array<string> = [];
const dataCi: Record<string, DataCi> = {};
const dataHardware: Record<string, DataHardware> = {};
const dataHardwareSku: Record<string, DataHardwareSku> = {};
const uniqueSysIdCi: Record<string, boolean> = {};
const uniqueSysIdHardwareSku: Record<string, boolean> = {};
const passSku = (
  sysIdHardware: string,
) => {
  //
  const testSkuSysId = dataHardware[sysIdHardware].hardwareSku;
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
  const testCiSysId = dataHardware[sysIdHardware].ci;
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
const testDataLoop = () => {
  Object.keys(dataHardware).forEach((sysIdHardware) => {
    testHardware(sysIdHardware);
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
  const grCi: GlideRecord = new GlideRecord('u_hardware_sku_configurations');
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
const getHardware = () => {
  //
  let testSysId: string | null;
  let testHardwareSku: string | null;
  let testCi: string | null;
  //
  // @ts-ignore
  const grHardware: GlideRecord = new GlideRecord('alm_hardware');
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
const main = () => {
  getHardware();
  getCi();
  getHardwareSku();
  testDataLoop();
  // @ts-ignore
  gs.print('badData');
  // @ts-ignore
  gs.print(badData);
  // @ts-ignore
  gs.print('dataHardware');
  // @ts-ignore
  gs.print(dataHardware);
  // @ts-ignore
  gs.print('dataCi');
  // @ts-ignore
  gs.print(dataCi);
  // @ts-ignore
  gs.print('dataHardwareSku');
  // @ts-ignore
  gs.print(dataHardwareSku);
};
main();
