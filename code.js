"use strict";
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
var roomNameRoomSysId = {
    P3SC: '5400288a37bc7e40362896d543990e9b',
    P3SJ: '1ca188a9db71c7442b56541adc961915',
};
//
// const badData: Array<string> = [];
var dataCi = {};
var dataHardware = {};
var dataHardwareSku = {};
var dataModel = {};
// let report = '\n\n';
var skusMissingDerate = {};
var uniqueSysIdCi = {};
var uniqueSysIdHardwareSku = {};
var uniqueSysIdModel = {};
var uniqueSysIdRack = {};
var roomSysIdRackSysIds = {};
var rackSysIdAssetSysIds = {};
//
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
var roomData = {};
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
var assetTest = function (assetSysId, roomSysId) {
    //
    var testCiSysId;
    var testModelSysId;
    //
    console.log("".concat(roomSysId, " ").concat(assetSysId));
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
var assetLoop = function (rackSysId, roomSysId) {
    if (Object.prototype.hasOwnProperty.call(rackSysIdAssetSysIds, rackSysId)) {
        Object.keys(rackSysIdAssetSysIds[rackSysId]).forEach(function (assetSysId) {
            assetTest(assetSysId, roomSysId);
        });
    }
};
var rackLoop = function (roomSysId) {
    if (Object.prototype.hasOwnProperty.call(roomSysIdRackSysIds, roomSysId)) {
        Object.keys(roomSysIdRackSysIds[roomSysId]).forEach(function (rackSysId) {
            assetLoop(rackSysId, roomSysId);
        });
    }
};
var roomLoop = function () {
    //
    var roomSysId;
    //
    Object.keys(roomNameRoomSysId).forEach(function (roomName) {
        roomSysId = roomNameRoomSysId[roomName];
        rackLoop(roomSysId);
    });
};
var startRoomData = function () {
    //
    var roomSysId;
    //
    Object.keys(roomNameRoomSysId).forEach(function (roomName) {
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
var processData = function () {
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
var getHardwareSku = function () {
    //
    var testSkuName;
    var testSysId;
    var testDerate;
    var backupName;
    //
    // @ts-ignore
    var grSku = new GlideRecord('u_hardware_sku_configurations');
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
            backupName = testSkuName !== null && testSkuName !== void 0 ? testSkuName : "sku_missing_name".concat(testSysId);
            if (testDerate === null) {
                if (!Object.prototype.hasOwnProperty.call(skusMissingDerate, backupName)) {
                    skusMissingDerate[backupName] = 0;
                }
                skusMissingDerate[backupName] += 1;
            }
        }
    }
};
var getCi = function () {
    //
    var testSysId;
    var testInstallStatus;
    //
    // @ts-ignore
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
    // @ts-ignore
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
var getHardware = function () {
    //
    var testCiSysId;
    var testHardwareSkuSysId;
    var testModelSysId;
    var testAssetSysId;
    var testRackSysId;
    //
    // @ts-ignore
    var grHardware = new GlideRecord('alm_hardware');
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
var getRacks = function () {
    //
    // @ts-ignore
    var grRack = new GlideRecord('cmdb_ci_rack');
    var rackSysIdArray = [];
    var testRackName;
    var testRackSysId;
    var testRoomSysId;
    //
    Object.keys(roomNameRoomSysId).forEach(function (roomName) {
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
var main = function () {
    getRacks();
    getHardware();
    getModel();
    getCi();
    getHardwareSku();
    processData();
};
main(); // supercalifragilisticexpialidocious
