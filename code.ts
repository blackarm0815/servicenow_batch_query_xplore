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
  modelSysId: string | null;
}
interface DataHardwareSku {
  derate: number | null;
}
interface DataModel {
  modelCategory: string | null;
}
//
// const roomNameRoomSysId: Record<string, string> = {
//   P3CG: '03061f25db974b445d30dd90cf96195b',
//   P3DB: 'baac336a2b45820054a41bc5a8da1577',
//   P3DC: '7aac336a2b45820054a41bc5a8da1577',
//   P3EA: '3aac336a2b45820054a41bc5a8da1586',
//   P3IA: '277c7f2a2b45820054a41bc5a8da1548',
//   P3IB: '677c7f2a2b45820054a41bc5a8da1548',
//   P3IC: '56ac336a2b45820054a41bc5a8da155f',
//   P3ID: '3c79524fdbcc5f8410b6f1561d9619af',
//   P3IE: 'b2f91e4fdbcc5f8410b6f1561d961955',
//   P3IF: 'fca0c7971b1fa114bc47c99f034bcb77',
//   P3MA: 'b03c772a2b45820054a41bc5a8da159b',
//   P3MB: 'f03c772a2b45820054a41bc5a8da159b',
//   P3MC: 'f2ac336a2b45820054a41bc5a8da1587',
//   P3MD: '36ac336a2b45820054a41bc5a8da1587',
//   P3SA: '35fb332a2b45820054a41bc5a8da15da',
//   P3SB: 'b1fb332a2b45820054a41bc5a8da15da',
//   P3SC: '5400288a37bc7e40362896d543990e9b',
//   'P3SC (Old Version)': 'f1fb332a2b45820054a41bc5a8da15da',
//   P3SD: '7dfb332a2b45820054a41bc5a8da15da',
//   P3SE: '61c1c9b2dbd8abc4086ff5f31d96195e',
//   'P3SE (Old Version)': '5a3c772a2b45820054a41bc5a8da15f5',
//   P3SF: '78e105f2dbd8abc4086ff5f31d9619de',
//   'P3SF (Old Version)': '1e8cbf2a2b45820054a41bc5a8da1514',
//   P3SG: '6aac336a2b45820054a41bc5a8da1575',
//   P3SH: 'a59cbf2a2b45820054a41bc5a8da15e7',
//   P3SI: 'd1fcb76a2b45820054a41bc5a8da1512',
//   P3SJ: '1ca188a9db71c7442b56541adc961915',
//   P3TA: 'bdfb332a2b45820054a41bc5a8da15da',
//   P3TB: '70ccb36a2b45820054a41bc5a8da1568',
//   P3WA: '65f68edddbc5a7885d5ef9b61d961950',
// };
const roomNameRoomSysId: Record<string, string> = {
  P3SC: '5400288a37bc7e40362896d543990e9b',
  P3SJ: '1ca188a9db71c7442b56541adc961915',
};
//
// const badData: Array<string> = [];
const dataCi: Record<string, DataCi> = {};
const dataHardware: Record<string, DataHardware> = {};
const dataHardwareSku: Record<string, DataHardwareSku> = {};
const dataModel: Record<string, DataModel> = {};
// let report = '\n\n';
const skusMissingDerate: Record<string, number> = {};
const uniqueSysIdCi: Record<string, boolean> = {};
const uniqueSysIdHardwareSku: Record<string, boolean> = {};
const uniqueSysIdModel: Record<string, boolean> = {};
const uniqueSysIdRack: Record<string, boolean> = {};
const roomSysIdRackSysIds: Record<string, Record<string, boolean>> = {};
const rackSysIdAssetSysIds: Record<string, Record<string, boolean>> = {};
//
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
// const passSku = (
//   sysIdHardware: string,
// ) => {
//   //
//   const testSkuSysId = dataHardware[sysIdHardware].hardwareSkuSysId;
//   //
//   // does the hardware sku reference exist
//   if (testSkuSysId !== null) {
//     // was it found in the sku data
//     if (Object.prototype.hasOwnProperty.call(dataHardwareSku, testSkuSysId)) {
//       // did it have a derate value
//       if (dataHardwareSku[testSkuSysId].derate !== null) {
//         return true;
//       }
//     }
//   }
//   return false;
// };
// const passCi = (
//   sysIdHardware: string,
// ) => {
//   //
//   const testCiSysId = dataHardware[sysIdHardware].ciSysId;
//   //
//   // does the ci reference exist
//   if (testCiSysId !== null) {
//     // was it found in the ci data
//     if (Object.prototype.hasOwnProperty.call(dataCi, testCiSysId)) {
//       // did it have an install status of live
//       if (dataCi[testCiSysId].installStatus === 1) {
//         return true;
//       }
//     }
//   }
//   return false;
// };
// const testHardware = (
//   sysIdHardware: string,
// ) => {
//   // store alm_hardware sys_ids for assets that do not pass either test
//   if (!passCi(sysIdHardware) && !passSku(sysIdHardware)) {
//     badData.push(sysIdHardware);
//   }
// };
// const filterModelCategory = (
//   sysIdHardware: string,
// ) => {
//   //
//   const acceptable: Record<string, boolean> = {
//     KVM: true,
//     'Network Gear': true,
//     'Server Chassis': true,
//     'Server Standalone': true,
//     'Storage Appliance': true,
//     'Storage Appliance Chassis': true,
//     'Storage Shelf': true,
//     'PDU Horizontal': true,
//     'Physical Appliance': true,
//     'Server Sled': true,
//     'Storage Appliance Sled': true,
//   };
//   let modelCategory: string | null;
//   const testModelSysId = dataHardware[sysIdHardware].modelSysId;
//   //
//   if (Object.prototype.hasOwnProperty.call(dataModel, testModelSysId)) {
//     modelCategory = dataModel[testModelSysId].modelCategory;
//     if (modelCategory !== null) {
//       if (Object.prototype.hasOwnProperty.call(acceptable, modelCategory)) {
//         testHardware(sysIdHardware);
//       }
//     }
//   }
// };
// const testDataLoop = () => {
//   Object.keys(dataHardware).forEach((sysIdHardware) => {
//     filterModelCategory(sysIdHardware);
//   });
// };
// const addRoomToReport = (
//   roomName: string,
// ) => {
//   report += '<div style = "border:1px solid #c4c4c4; padding: 10px; margin: 10px;">';
//   report += '<div style = "font-size: 150%">';
//   report += roomName;
//   report += '</div>';
//   report += `Total notLiveNoDerate = ${badData.length}`;
//   report += '\n';
//   report += '<a href = "';
//   report += '/alm_hardware_list.do?sysparm_query=sys_idIN';
//   report += badData.join('%2C');
//   report += '" target = "_blank">View in alm_hardware</a>';
//   report += '</div>';
//   report += '\n';
// };
// const generateRoom = (
//   roomName: string,
// ) => {
//   badData = [];
//   dataCi = {};
//   dataHardware = {};
//   dataHardwareSku = {};
//   dataModel = {};
//   uniqueSysIdCi = {};
//   uniqueSysIdHardwareSku = {};
//   uniqueSysIdModel = {};
//   getHardware(roomName);
//   getCi();
//   getHardwareSku();
//   getModel();
//   testDataLoop();
//   addRoomToReport(roomName);
// };
// const generateStats = () => {
//   //
//   const badSkuCount = Object.keys(skusMissingDerate).length;
//   //
//   report += '<div style = "border:1px solid rgb(255, 0, 0); padding: 10px; margin: 10px;">';
//   report += '<div style = "font-size: 150%">';
//   report += 'Stats';
//   report += '</div>';
//   report += `Number of skus with missing derate = ${badSkuCount}`;
//   if (badSkuCount > 0) {
//     report += '\n';
//     report += '\n';
//     report += '<a href = "';
//     report += '/now/nav/ui/classic/params/target';
//     report += '/u_hardware_sku_configurations_list.do';
//     report += '%3Fsysparm_query%3Dsys_idIN';
//     report += Object.keys(skusMissingDerate).join('%252C');
//     report += '" target = "_blank">View skus</a>';
//     report += '\n';
//     report += '\n';
//     report += JSON.stringify(skusMissingDerate, null, 2);
//     report += '\n';
//     report += '</div>';
//     report += '\n';
//   }
//   report += '</div>';
//   report += '\n';
// };
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
interface RoomData {
  assetTotal: number,
  ciReferenceBroken: number,
  ciReferenceMissing: number,
  modelReferenceBroken: number,
  modelReferenceMissing: number,
}
const roomData: Record<string, RoomData> = {};
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
const assetTest = (
  assetSysId: string,
  roomSysId: string,
) => {
  //
  let testCiSysId: string | null;
  let testModelSysId: string | null;
  //
  console.log(`${roomSysId} ${assetSysId}`);
  roomData[roomSysId].assetTotal += 1;
  if (Object.prototype.hasOwnProperty.call(dataHardware, assetSysId)) {
    //
    testCiSysId = dataHardware[assetSysId].ciSysId;
    if (testCiSysId === null) {
      roomData[roomSysId].ciReferenceMissing += 1;
    }
    if (testCiSysId !== null && !Object.prototype.hasOwnProperty.call(dataCi, testCiSysId)) {
      roomData[roomSysId].ciReferenceBroken += 1;
    }
    //
    testModelSysId = dataHardware[assetSysId].modelSysId;
    if (testModelSysId === null) {
      roomData[roomSysId].modelReferenceMissing += 1;
    }
    if (testModelSysId !== null && !Object.prototype.hasOwnProperty.call(dataModel, testModelSysId)) {
      roomData[roomSysId].modelReferenceBroken += 1;
    }
  }
};
const assetLoop = (
  rackSysId: string,
  roomSysId: string,
) => {
  if (Object.prototype.hasOwnProperty.call(rackSysIdAssetSysIds, rackSysId)) {
    Object.keys(rackSysIdAssetSysIds[rackSysId]).forEach((assetSysId) => {
      assetTest(assetSysId, roomSysId);
    });
  }
};
const rackLoop = (
  roomSysId: string,
) => {
  if (Object.prototype.hasOwnProperty.call(roomSysIdRackSysIds, roomSysId)) {
    Object.keys(roomSysIdRackSysIds[roomSysId]).forEach((rackSysId) => {
      assetLoop(rackSysId, roomSysId);
    });
  }
};
const roomLoop = () => {
  //
  let roomSysId: string;
  //
  Object.keys(roomNameRoomSysId).forEach((roomName) => {
    roomSysId = roomNameRoomSysId[roomName];
    rackLoop(roomSysId);
  });
};
const startRoomData = () => {
  //
  let roomSysId: string;
  //
  Object.keys(roomNameRoomSysId).forEach((roomName) => {
    roomSysId = roomNameRoomSysId[roomName];
    roomData[roomSysId] = {
      assetTotal: 0,
      ciReferenceBroken: 0,
      ciReferenceMissing: 0,
      modelReferenceBroken: 0,
      modelReferenceMissing: 0,
    };
  });
};
const processData = () => {
  startRoomData();
  roomLoop();
  // @ts-ignore
  console.log('roomData');
  // @ts-ignore
  console.log(roomData);
  // // @ts-ignore
  // console.log('roomNameRoomSysId = ');
  // // @ts-ignore
  // console.log(roomNameRoomSysId);
  // // @ts-ignore
  // console.log('roomSysIdRackSysIds = ');
  // // @ts-ignore
  // console.log(roomSysIdRackSysIds);
  // // @ts-ignore
  // console.log('rackSysIdAssetSysIds = ');
  // // @ts-ignore
  // console.log(rackSysIdAssetSysIds);
  // // @ts-ignore
  // console.log('dataHardware = ');
  // // @ts-ignore
  // console.log(dataHardware);
  // // @ts-ignore
  // console.log('dataModel = ');
  // // @ts-ignore
  // console.log(dataModel);
  // // @ts-ignore
  // console.log('dataCi = ');
  // // @ts-ignore
  // console.log(dataCi);
  // // @ts-ignore
  // console.log('dataHardwareSku = ');
  // // @ts-ignore
  // console.log(dataHardwareSku);
};
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
const getHardwareSku = () => {
  //
  let testSkuName: string | null;
  let testSysId: string | null;
  let testDerate: number | null;
  let backupName: string;
  //
  // @ts-ignore
  const grSku: GlideRecord = new GlideRecord('u_hardware_sku_configurations');
  grSku.addQuery('sys_id', 'IN', Object.keys(uniqueSysIdHardwareSku));
  grSku.query();
  while (grSku.next()) {
    testSkuName = checkString(grSku.getValue('u_sku_name'));
    testSysId = checkString(grSku.getUniqueValue());
    testDerate = checkFloat(grSku.getValue('u_derate_kw'));
    if (testSysId !== null) {
      dataHardwareSku[testSysId] = {
        derate: testDerate,
      };
      backupName = testSkuName ?? `sku_missing_name${testSysId}`;
      if (testDerate === null) {
        if (!Object.prototype.hasOwnProperty.call(skusMissingDerate, backupName)) {
          skusMissingDerate[backupName] = 0;
        }
        skusMissingDerate[backupName] += 1;
      }
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
const getHardware = () => {
  //
  let testCiSysId: string | null;
  let testHardwareSkuSysId: string | null;
  let testModelSysId: string | null;
  let testAssetSysId: string | null;
  let testRackSysId: string | null;
  //
  // @ts-ignore
  const grHardware: GlideRecord = new GlideRecord('alm_hardware');
  grHardware.addQuery('u_rack.sys_id', 'IN', Object.keys(uniqueSysIdRack));
  grHardware.query();
  while (grHardware.next()) {
    testAssetSysId = checkString(grHardware.getUniqueValue());
    testCiSysId = checkString(grHardware.getValue('ci'));
    testHardwareSkuSysId = checkString(grHardware.getValue('u_hardware_sku'));
    testModelSysId = checkString(grHardware.getValue('model'));
    testRackSysId = checkString(grHardware.getValue('u_rack'));
    if (testAssetSysId !== null && testRackSysId !== null) {
      dataHardware[testAssetSysId] = {
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
      if (testModelSysId !== null) {
        uniqueSysIdModel[testModelSysId] = true;
      }
      if (!Object.prototype.hasOwnProperty.call(rackSysIdAssetSysIds, testRackSysId)) {
        rackSysIdAssetSysIds[testRackSysId] = {};
      }
      rackSysIdAssetSysIds[testRackSysId][testAssetSysId] = true;
    }
  }
};
const getRacks = () => {
  //
  // @ts-ignore
  const grRack: GlideRecord = new GlideRecord('cmdb_ci_rack');
  const rackSysIdArray: Array<string> = [];
  let testRackName: string | null;
  let testRackSysId: string | null;
  let testRoomSysId: string | null;
  //
  Object.keys(roomNameRoomSysId).forEach((roomName) => {
    rackSysIdArray.push(roomNameRoomSysId[roomName]);
  });
  grRack.addQuery('u_room.sys_id', 'IN', rackSysIdArray);
  grRack.query();
  while (grRack.next()) {
    testRackName = checkString(grRack.getValue('name'));
    testRackSysId = checkString(grRack.getUniqueValue());
    testRoomSysId = checkString(grRack.getValue('u_room'));
    if (testRackName !== null && testRackSysId !== null && testRoomSysId !== null) {
      uniqueSysIdRack[testRackSysId] = true;
      if (!Object.prototype.hasOwnProperty.call(roomSysIdRackSysIds, testRoomSysId)) {
        roomSysIdRackSysIds[testRoomSysId] = {};
      }
      roomSysIdRackSysIds[testRoomSysId][testRackSysId] = true;
    }
  }
};
const main = () => {
  getRacks();
  getHardware();
  getModel();
  getCi();
  getHardwareSku();
  processData();
};
main(); // supercalifragilisticexpialidocious
