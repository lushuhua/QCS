import { DBTABLE, initCoreData, uploadFile, loadProject } from "../../main/dbaccess/connectDb";
import { getCurDate } from "../../main/util/util";

const sq3 = require('sqlite3').verbose()
const async = require("async");
const path = require('path');
const resObj = { "msg": "", "result": true, "token": "", "error_code": "0", code: 200 };
initCoreData()
loadProject()

let sqlDir = path.join(process.resourcesPath, 'extraResources', 'medical.db'),
    qcsNodeUrl = path.resolve(process.resourcesPath, 'extraResources', 'qcsNode.node')
if (process.env.NODE_ENV === 'development') {
    sqlDir = path.join(__dirname, '../../extraResources/medical.db')
    qcsNodeUrl = path.resolve(__dirname, '../../extraResources/qcsNode.node')
}
console.log('qcsNodeUrl', qcsNodeUrl)
const qcsNode = require(`qcs`);
// loadProject()
export function getProjects(obj) {
    console.log('getProjects', obj)
    return new Promise((resolve, reject) => {
        obj = obj ? obj : {}
        console.log(obj);
        console.log('/medical/getDevices');
        var rows = [],
            index = 0;
        var db = new sq3.Database(sqlDir);
        let orderBy = 'ORDER BY validDate'
        if (!obj.offset) obj.offset = 10;
        if (!obj.pageNum) obj.pageNum = 0;
        let cond_sql = '',
            testTable = `(SELECT a.* FROM (SELECT id AS testID,testResult,createDate,qscDeviceProjID FROM ${DBTABLE.DEVICE_PROJECT_RESULT} ORDER BY testID DESC) a GROUP BY a.qscDeviceProjID ORDER BY a.testID DESC)`;
        if (obj.detectType) cond_sql += ' AND data.detectType="' + obj.detectType + '"';
        if (obj.name) cond_sql += ` AND (data.name LIKE "%${obj.name}%" OR data.subName LIKE "%${obj.name}%")`;
        if (obj.step) cond_sql += ' AND data.step="' + obj.step + '"';
        if (obj.analysis) cond_sql += ' AND data.analysis="' + obj.analysis + '"';
        if (obj.projectNo) cond_sql += ' AND data.projectNo="' + obj.projectNo + '"';
        if (obj.period) cond_sql += ' AND data.period="' + obj.period + '"';
        if (obj.testDate) {
            cond_sql += ` AND data.createDate BETWEEN '${obj.testDate}' AND '${obj.testDate} 23:59:59'`
        }
        if (obj.validDate) {
            cond_sql += ` AND data.validDate BETWEEN '${obj.validDate}' AND '${obj.validDate} 23:59:59' `
        }
        if (obj.orderBy) {
            let str = obj.orderBy.split('&')
            if (str.length > 1 && str[1]) {
                switch (str[0]) {
                    case 'projectNo':
                        orderBy = ' ORDER BY projectNo ' + str[1]
                        break
                    case 'registerTime':
                        orderBy = ' ORDER BY a.registerTime ' + str[1]
                        break
                    case 'projectID':
                        orderBy = ' ORDER BY projectID ' + str[1]
                        break
                }
            }
        }
        let sel_sql = `(SELECT proj.name,proj.radioType,proj.subName,proj.projectNo,proj.radioType,proj.dataRequire,proj.extraRequire,proj.analysis,proj.views,proj.type,proj.detectCondition
                ,proj.step,proj.remark,proj.moduleRequire,proj.detectType,proj.detail,proj.detailUrl,proj.unit,proj.supply,proj.tips,proj.nameAPI,proj.pathRT,proj.testUnit
                ,device.x_energy_level,device.e_energy_level 
                ,IFNULL(dp.testPoint,proj.testPoint) AS testPoint
                ,IFNULL(dp.numOfInput,proj.numOfInput) AS numOfInput
                ,IFNULL(dp.period,proj.period) AS period
                ,IFNULL(dp.threshold,proj.threshold) AS threshold

                
                ,test.*,dp.id,dp.projectID,dp.deviceID
                ,IIF(test.createDate,DATE(test.createDate,CASE proj.period 
                 WHEN '一天' THEN '+1 day'
                 WHEN '一周' THEN '+7 day'
                 WHEN '一个月' THEN '+30 day'
                 WHEN '三个月' THEN '+90 day'
                 WHEN '六个月' THEN '+180 day'
                 WHEN '一年' THEN '+365 day' END),null) AS validDate
                ,DATE(IIF(test.createDate,test.createDate,'now'),CASE proj.period 
                 WHEN '一天' THEN '+1 day'
                 WHEN '一周' THEN '+7 day'
                 WHEN '一个月' THEN '+30 day'
                 WHEN '三个月' THEN '+90 day'
                 WHEN '六个月' THEN '+180 day'
                 WHEN '一年' THEN '+365 day' END) AS expiredDate
                FROM ${DBTABLE.DEVICE_PROJ} AS dp 
                LEFT JOIN ${DBTABLE.PROJECT} AS proj ON dp.projectID=proj.id
                LEFT JOIN ${DBTABLE.DEVICE} AS device ON dp.deviceID=device.id
                LEFT JOIN ${testTable} AS test ON test.qscDeviceProjID=dp.id
                WHERE dp.deviceID=${obj.deviceID}) AS data`
        async.waterfall([
            function(callback) {
                let select_sql = `SELECT * FROM ${sel_sql} WHERE 1 ${cond_sql} ${orderBy} LIMIT ${obj.offset*obj.pageNum},${obj.offset}`
                    // var select_sql = "SELECT proj.*,device.x_energy_level,device.e_energy_level " +
                    //     ",IFNULL(dp.testPoint,proj.testPoint) AS testPoint" +
                    //     ", IFNULL(dp.numOfInput,proj.numOfInput) AS numOfInput " +
                    //     ", IFNULL(dp.period,proj.period) AS period " +
                    //     ", IFNULL(dp.threshold,proj.threshold) AS threshold,dp.id,dp.projectID,dp.deviceID  " +
                    //     " FROM "+DBTABLE.DEVICE_PROJ+" AS dp " +
                    //     " LEFT JOIN " +DBTABLE.PROJECT+' AS proj ON dp.projectID=proj.id'+
                    //     " LEFT JOIN " +DBTABLE.DEVICE+' AS device ON dp.deviceID=device.id'+
                    //     "  WHERE dp.deviceID="+obj.deviceID+cond_sql+" ORDER BY dp.id DESC limit "+obj.offset*obj.pageNum+','+obj.offset;
                console.log(select_sql)
                db.all(select_sql, function(err, rows) {
                    console.log(err)
                        // console.log('rows',rows)
                    if (err) {
                        callback(err)
                    } else {
                        async.forEachOf(rows, function(row, index, eachcallback) {
                            var energy = [];
                            if ((row.radioType == 'X' || row.radioType == 'X和电子') && row.x_energy_level && row.x_energy_level.length > 0) {
                                var x_energy_arr = JSON.parse(row.x_energy_level);
                                // console.log(x_energy_arr);
                                for (var j in x_energy_arr) {
                                    energy.push(x_energy_arr[j].x + 'MV')
                                }
                            }
                            if ((row.radioType == '电子' || row.radioType == 'X和电子') && row.e_energy_level && row.e_energy_level.length > 0) {
                                var e_energy_arr = JSON.parse(row.e_energy_level);
                                // console.log(e_energy_arr);
                                for (var j in e_energy_arr) {
                                    energy.push(e_energy_arr[j].x + 'MeV')
                                }
                            }
                            if (energy.length == 0) energy[0] = '-';
                            row.energy = energy;
                            row.testResult = row.testResult ? JSON.parse(row.testResult) : null
                                // var getsql = 'SELECT * FROM  '+DBTABLE.DEVICE_PROJECT_RESULT+' WHERE id=(SELECT max(id) FROM '+DBTABLE.DEVICE_PROJECT_RESULT+' WHERE qscDeviceProjID='+row.id+')' +sqlStr
                                // console.log(getsql);
                                // db.all(getsql, function(err, result) {
                                //     console.log(row.id,result)
                                //     if(result&&result.length>0){
                                // if(result[0].testResult) {
                                //     row.testResult = JSON.parse(result[0].testResult);
                                //     row.createDate = result[0].createDate;
                                // }
                                //     projects.push(row)
                                // }else {
                                //     if (!obj.testDate && !obj.validDate){
                                //         projects.push(row)
                                //     }
                                // }
                                // });

                            eachcallback(null);
                        }, function(err) {
                            if (err) callback(err);
                            else {
                                resObj.projects = rows;
                                callback(null);
                            }
                        });
                    }

                });
            },
            function(callback) {
                // let select_all_sql = `SELECT COUNT(*) AS count FROM ${DBTABLE.DEVICE_PROJ} AS dp
                // LEFT JOIN ${DBTABLE.PROJECT} AS proj ON dp.projectID=proj.id
                // LEFT JOIN ${testTable} AS test ON test.qscDeviceProjID=dp.id
                // WHERE dp.deviceID=${obj.deviceID} ${cond_sql}`
                let select_all_sql = `SELECT COUNT(*) AS count FROM ${sel_sql} WHERE 1 ${cond_sql}`
                db.all(select_all_sql, function(err, row) {
                    // console.log(row)
                    resObj.count = row[0].count;
                    callback(null);
                });
            }
        ], function(err, result) {
            if (err) {
                console.error(err);
                resObj.result = false;
            }
            resolve(resObj);
            db.close();
        });
    })
}

/// 删除项目
export function delDeviceProject(obj) {
    console.log('delDeviceProject', obj)
    return new Promise((resolve, reject) => {
        var db = new sq3.Database(sqlDir);
        if (obj.id) {
            db.run(`DELETE FROM ${DBTABLE.DEVICE_PROJ} WHERE id=${obj.id}`, function(err) {
                if (err) throw err
                else {
                    db.close();
                    resolve(1)
                }
            })
        } else {
            reject('参数错误')
        }
    })
}


//手机登录
export function addDicom(obj) {
    console.log('addDicom')
    return new Promise(resolve => {
        var db = new sq3.Database(sqlDir);
        var sql = 'INSERT INTO qsc_dicom (customer,aeTitle,ip,port,deviceID)VALUES(?,?,?,?,?)';
        if (obj.id > 0) {
            sql = 'UPDATE qsc_dicom SET customer=?,aeTitle=?,ip=?,port=? WHERE id=? ';
            let stmt = db.prepare(sql);
            stmt.run(obj.customer, obj.aeTitle, obj.ip, obj.port, obj.id);
            stmt.finalize(() => {
                resolve(resObj);
            });
        } else {
            let stmt = db.prepare(sql);
            stmt.run(obj.customer, obj.aeTitle, obj.ip, obj.port, obj.deviceID);
            stmt.finalize(() => {
                resolve(resObj);
            });
        }

        db.close();
    })
}
export function delDicom(obj) {
    console.log('delDicom', obj)
    return new Promise(resolve => {
        var db = new sq3.Database(sqlDir);
        db.run('DELETE FROM qsc_dicom WHERE id=' + obj.id, () => {
            resolve(resObj);
        })

        db.close();
    })
}
export function getDicoms(obj) {
    console.log('getDicoms')
    return new Promise(resolve => {
        var rows = [],
            index = 0;
        var resObj = { "msg": "", "result": true, "token": "", "templates": "", "error_code": "0", code: 200 };
        var db = new sq3.Database(sqlDir);
        if (!obj.offset) obj.offset = 10;
        if (!obj.pageNum) obj.pageNum = 0;
        async.waterfall([
            function(callback) {
                var select_sql = "SELECT * FROM qsc_dicom WHERE deviceID=" + obj.deviceID + " ORDER BY id DESC limit " + obj.offset * obj.pageNum + ',' + obj.offset;
                console.log(select_sql)
                db.all(select_sql, function(err, rows) {
                    console.log(rows)
                    resObj.dicoms = rows;
                    callback(null);
                });
            },
            function(callback) {
                var select_all_sql = "SELECT COUNT(*) AS count FROM qsc_dicom  WHERE deviceID=" + obj.deviceID;
                db.all(select_all_sql, function(err, row) {
                    console.log(row)
                    resObj.count = row[0].count
                    callback(null);
                });
            }
        ], function(err, result) {
            if (err) {
                console.error(err);
                resObj.result = false;
            }
            db.close();
            resolve(resObj);
        });

    })
}
export function addDevice(obj) {
    console.log('addDevice')
    return new Promise(resolve => {
        var db = new sq3.Database(sqlDir);
        var stmt;
        if (obj.id > 0) {
            //添加该加速器的项目，可以增加
            //先获取默认项目，然后组成一个二维码数组，插入到新表中
            async.waterfall([
                function(callback) {
                    let updStr = ''
                    if (obj.hasOwnProperty('model')) {
                        updStr += `,model='${obj.model}'`
                    }
                    if (obj.hasOwnProperty('sequence')) {
                        updStr += `,sequence='${obj.sequence}'`
                    }
                    if (obj.hasOwnProperty('e_light_size')) {
                        updStr += `,e_light_size='${obj.e_light_size}'`
                    }
                    if (obj.hasOwnProperty('multileaf_collimator_size')) {
                        updStr += `,multileaf_collimator_size='${obj.multileaf_collimator_size}'`
                    }
                    if (obj.hasOwnProperty('x_energy_level')) {
                        updStr += `,x_energy_level='${obj.x_energy_level}'`
                    }
                    if (obj.hasOwnProperty('e_energy_level')) {
                        updStr += `,e_energy_level='${obj.e_energy_level}'`
                    }
                    // var update_sql = 'UPDATE qsc_device SET model=?,sequence=?,x_energy_level=?,e_energy_level=?,x_volume_percent=?,e_volume_percent=?,e_light_size=?,multileaf_collimator_size=?,default_dir=?,xFFF=? WHERE id=? ' ;
                    // console.log(update_sql);
                    if (updStr) {
                        updStr = updStr.substr(1)
                    }
                    const update_sql = `UPDATE qsc_device SET ${updStr} WHERE id=${obj.id}`
                    console.log(update_sql);
                    db.run(update_sql, function(err) {
                            console.log(err)
                            if (err) callback('更新出错')
                            else callback(null)
                        })
                        // stmt = db.prepare(update_sql);
                        // stmt.run(obj.model, obj.sequence, obj.x_energy_level,obj.e_energy_level, obj.x_volume_percent,obj.e_volume_percent,obj.e_light_size, obj.multileaf_collimator_size, obj.default_dir,obj.xFFF,obj.id);
                        // stmt.finalize(function (err) {
                        //     if (err) callback('更新出错')
                        //     else callback(null)
                        // });
                },
                function(callback) {
                    var select_sql = "SELECT * FROM qsc_project ORDER BY id DESC ";
                    console.log(select_sql)
                    db.all(select_sql, function(err, rows) {
                        // console.log(rows)
                        callback(null, rows);
                    });
                },
                function(projects, callback) {
                    var insert_sql = 'INSERT INTO ' + DBTABLE.DEVICE_PROJ + '  (deviceID,projectID) ' + 'VALUES(?,?)';
                    stmt = db.prepare(insert_sql);
                    for (var i in projects) {
                        console.log(obj.id, projects[i].id)
                        stmt.run(obj.id, projects[i].id);
                    }
                    stmt.finalize((function(err) {
                        console.log(err);
                        console.log('batch insert done');
                        callback(null);
                    }));
                },
                function(callback) {
                    var select_sql = 'SELECT * FROM ' + DBTABLE.DEVICE_PROJ + ' WHERE deviceID=' + obj.id;
                    console.log(select_sql)
                    db.all(select_sql, function(err, rows) {
                        console.log(rows)
                        callback(null);
                    });
                }
            ], function(err, result) {
                if (err) {
                    console.error(err);
                    resObj.result = false;
                }
                db.close();
                resolve(resObj);
            });

        } else {
            var insert_sql = 'INSERT INTO qsc_device  (model,sequence,x_energy_level,e_energy_level,x_volume_percent,e_volume_percent,e_light_size,multileaf_collimator_size,default_dir,xFFF) ' +
                'VALUES(?,?,?,?,?,?,?,?,?,?)';
            var stmt = db.prepare(insert_sql);
            stmt.run(obj.model, obj.sequence, obj.x_energy_level, obj.e_energy_level, obj.x_volume_percent, obj.e_volume_percent, obj.e_light_size, obj.multileaf_collimator_size, obj.default_dir, obj.xFFF);
            //同时添加这个加速器要测试的项目，默认将所有项目都加入到该加速器中
            stmt.finalize((function(err, result) {
                console.log(result);
                //获取刚插入的id
                async.waterfall([
                    function(callback) {
                        db.all('select last_insert_rowid() as insertId ', function(err, rows) {
                            console.log(rows);
                            obj.id = rows[0].insertId;
                            callback(null);
                        })
                    },
                    function(callback) {
                        var select_sql = "SELECT * FROM qsc_project ORDER BY id DESC ";
                        console.log(select_sql)
                        db.all(select_sql, function(err, rows) {
                            // console.log(rows)
                            callback(null, rows);
                        });
                    },
                    function(projects, callback) {
                        var insert_sql = 'INSERT INTO ' + DBTABLE.DEVICE_PROJ + '  (deviceID,projectID) ' + 'VALUES(?,?)';
                        stmt = db.prepare(insert_sql);
                        for (var i in projects) {
                            console.log(obj.id, projects[i].id)
                            stmt.run(obj.id, projects[i].id);
                        }
                        stmt.finalize((function(err) {
                            console.log(err);
                            console.log('batch insert done');
                            callback(null);
                        }));
                    },
                    function(callback) {
                        var select_sql = 'SELECT * FROM ' + DBTABLE.DEVICE_PROJ + ' WHERE deviceID=' + obj.id;
                        console.log(select_sql)
                        db.all(select_sql, function(err, rows) {
                            console.log(rows)
                            callback(null);
                        });
                    }
                ], function(err, result) {
                    if (err) {
                        console.error(err);
                        resObj.result = false;
                    }
                    db.close();
                    resolve(resObj);
                });

            }));
        }
    })
}
export function delDevice(obj) {
    console.log('delDevice')
    return new Promise(resolve => {
        var db = new sq3.Database(sqlDir);
        db.run('DELETE FROM qsc_device WHERE id=' + obj.id, function() {
            resolve(resObj);
        })

        db.close();
    })
}
export function getDevices(obj) {
    console.log('getDevices')
    return new Promise(resolve => {
        var rows = [],
            index = 0;
        var resObj = { "msg": "", "result": true, "token": "", "error_code": "0", code: 200 };
        var db = new sq3.Database(sqlDir);
        if (!obj.offset) obj.offset = 10;
        if (!obj.pageNum) obj.pageNum = 0;
        async.waterfall([
            function(callback) {
                var select_sql = "SELECT * FROM qsc_device  ORDER BY id DESC limit " + obj.offset * obj.pageNum + ',' + obj.offset;
                console.log(select_sql)
                db.all(select_sql, function(err, rows) {
                    // console.log(rows)
                    // console.log(err,rows)
                    resObj.devices = rows;
                    callback(null);
                });
            },
            function(callback) {
                var select_all_sql = "SELECT COUNT(*) AS count FROM qsc_device ";
                db.all(select_all_sql, function(err, row) {
                    // console.log(row)
                    resObj.count = row[0].count;
                    callback(null);
                });
            }
        ], function(err, result) {
            if (err) {
                console.error(err);
                resObj.result = false;
            }
            db.close();
            resolve(resObj);
        });
    })
}
export function getProjectTests(obj) {
    console.log('getProjectTests', obj)
    return new Promise(resolve => {
        var rows = [],
            index = 0;
        var resObj = { "msg": "", "result": true, "token": "", "error_code": "0", code: 200 };
        var db = new sq3.Database(sqlDir);
        if (!obj.offset) obj.offset = 10;
        if (!obj.pageNum) obj.pageNum = 0;
        var cond_sql = '';
        if (obj.period) {
            cond_sql += ' AND proj.period="' + obj.period + '"';
        }
        if (obj.fromDate) {
            cond_sql += ' AND dp_result.createDate >="' + obj.fromDate + '"';
        }
        if (obj.toDate) {
            cond_sql += ' AND dp_result.createDate <="' + obj.toDate + '"';
        }
        if (obj.projectID) {
            cond_sql += ` AND dp_result.qscDeviceProjID=${obj.projectID}`;
        }
        if (obj.projectName) {
            cond_sql += ` AND dp_result.projectName LIKE '%${obj.projectName}%'`;
        }
        let orderBy = ' ORDER BY dp_result.id DESC '
        if (obj.orderBy) {
            let str = obj.orderBy.split('&')
            if (str.length > 1 && str[1]) {
                switch (str[0]) {
                    case 'projectNo':
                        orderBy = ' ORDER BY proj.projectNo ' + str[1]
                        break
                    case 'registerTime':
                        orderBy = ' ORDER BY a.registerTime ' + str[1]
                        break
                    case 'machineCount':
                        orderBy = ' ORDER BY machineCount ' + str[1]
                        break
                }
            }
        }
        async.waterfall([
            function(callback) {
                var select_sql = "SELECT proj.*,device.x_energy_level,device.e_energy_level " +
                    ",IFNULL(dp.testPoint,proj.testPoint) AS testPoint" +
                    ", IFNULL(dp.numOfInput,proj.numOfInput) AS numOfInput " +
                    ", IFNULL(dp.period,proj.period) AS period " +
                    ", IFNULL(dp.threshold,proj.threshold) AS threshold,dp.id AS dpID,dp.projectID,dp.deviceID,dp_result.testResult,dp_result.createDate,dp_result.id  " +
                    " FROM " + DBTABLE.DEVICE_PROJECT_RESULT + ' AS dp_result ' +
                    ' LEFT JOIN ' + DBTABLE.DEVICE_PROJ + " AS dp ON dp_result.qscDeviceProjID=dp.id " +
                    " LEFT JOIN " + DBTABLE.PROJECT + ' AS proj ON dp.projectID=proj.id' +
                    " LEFT JOIN " + DBTABLE.DEVICE + ' AS device ON dp.deviceID=device.id' +
                    " WHERE dp_result.deviceID=" + obj.deviceID + cond_sql + orderBy + " limit " + obj.offset * obj.pageNum + ',' + obj.offset;
                console.log(select_sql)
                db.all(select_sql, function(err, rows) {
                    console.log(err)
                    console.log(rows)
                    if (rows && rows.length > 0) {
                        for (var i in rows) {
                            if (rows[i].testResult) rows[i].testResult = JSON.parse(rows[i].testResult);
                        }
                    }
                    resObj.projects = rows;
                    callback(null);
                });
            },
            function(callback) {
                var select_all_sql = "SELECT COUNT(*) AS count FROM  " + DBTABLE.DEVICE_PROJECT_RESULT + " AS dp_result " +
                    " LEFT JOIN " + DBTABLE.PROJECT + ' AS proj ON dp_result.projectID=proj.id ' +
                    " WHERE dp_result.deviceID=" + obj.deviceID + cond_sql;
                db.all(select_all_sql, function(err, row) {
                    console.log(row)
                    resObj.count = row[0].count;
                    callback(null);
                });
            }
        ], function(err, result) {
            if (err) {
                console.error(err);
                resObj.result = false;
            }
            db.close();
            resolve(resObj);
        });

    })
}
export function updateProject(obj) {
    console.log('updateProject', obj)
    return new Promise(resolve => {
        var db = new sq3.Database(sqlDir);
        if (obj.id > 0) {
            var sql = 'UPDATE ' + DBTABLE.DEVICE_PROJ + ' SET period=?, threshold=? WHERE id=? ';
            //var sql = 'UPDATE ' + DBTABLE.DEVICE_PROJ + ' SET period=?, threshold=? WHERE id=? ';
            let stmt = db.prepare(sql);
            stmt.run(obj.period, obj.threshold, obj.id, function() {
                resolve(resObj);
            });
            stmt.finalize();
            db.close();
        }
    })
}
export function addTestResult(obj) {
    console.log('addTestResult', obj)
    return new Promise(resolve => {
        var db = new sq3.Database(sqlDir);
        var sql = 'INSERT INTO ' + DBTABLE.DEVICE_PROJECT_RESULT + ' (qscDeviceProjID,projectID,deviceID,testResult,personName,createDate)VALUES(?,?,?,?,?,?)';
        let stmt = db.prepare(sql);
        stmt.run(obj.qscDeviceProjID, obj.projectID, obj.deviceID, obj.testResult, obj.personName, getCurDate());
        stmt.finalize(() => {
            resolve(resObj);
        });
        db.close();
    })
}
export function getTestResult(obj) {
    console.log('getTestResult')
    return new Promise(resolve => {
        var db = new sq3.Database(sqlDir);
        var sql = `SELECT * FROM ${DBTABLE.DEVICE_PROJECT_RESULT} ORDER BY id DESC LIMIT 0,10`
        db.all(sql, function(err, result) {
            resObj.test = result
            resolve(resObj)
        })
        db.close();
    })
}
export function editHospital(obj) {
    console.log('addHospital')
    return new Promise(resolve => {
        var db = new sq3.Database(sqlDir);
        let sql
        if (obj.id) {
            sql = 'UPDATE ' + DBTABLE.HOSPITALS + ' SET name=?,avatar=? WHERE id=?';
            let stmt = db.prepare(sql);
            stmt.run(obj.name, obj.avatar, obj.id);
            stmt.finalize(() => {
                resolve(resObj);
            });
        } else {
            sql = 'INSERT INTO ' + DBTABLE.HOSPITALS + ' (name,avatar,createDate)VALUES(?,?,?)';
            let stmt = db.prepare(sql);
            stmt.run(obj.name, obj.avatar, getCurDate());
            stmt.finalize(() => {
                resolve(resObj);
            });
        }
        db.close();
    })
}

export function getHospitals(obj) {
    console.log('delDicom')
    return new Promise(resolve => {
        var resObj = { "msg": "", "result": true, "token": "", "error_code": "0", code: 200 };
        var db = new sq3.Database(sqlDir);
        var select_sql = "SELECT * FROM " + DBTABLE.HOSPITALS
        console.log(select_sql)
        db.all(select_sql, function(err, rows) {
            if (rows && rows.length > 0) {
                resObj.hospital = rows[0];
            }
            resolve(resObj)
        });
    })
}
/// 文件上传功能
export function fileUpload(obj) {
    console.log('fileUpload')
    return new Promise((resolve, reject) => {
        try {
            uploadFile(obj, function(err, path) {
                if (err) console.log(err)
                else resolve(path)
            })
        } catch (e) {
            console.log(e)
            reject(e)
        }
    })
}
/// 获取检测值通过dicom文件
export function getTestValue(obj) {
    console.log('getTestValue', obj)
    return new Promise((resolve, reject) => {
        console.log(11111111)
            // const value = path.join(__dirname,"./RI.1.3.46.423632.131000.1606838764.9.dcm")
            // console.log('symmetry of this graph is:',qcsNode.get_symmetry(value));
        try {
            let value = qcsNode[obj.apiUrl](obj.filePath);
            console.log('%c [ obj.apiUrl ]', 'font-size:13px; background:pink; color:#bf2c9f;', obj.apiUrl)
            console.log(`value=${value}`);
            resolve(value)

        } catch (e) {
            console.log(e)
        }
    })
}
const { execFile, exec } = require('child_process');
/// 传输dicom文件
export function transferDicom(obj) {
    console.log('transferDicom', obj);
    var pathRT = obj.pathRT;
    return new Promise((resolve, reject) => {
        //qcsNode.get_scu("-d","10.0.10.172","7007","..\\..\\..\\src\\extraResources\\images\\aaaa.dcm","-aec","ACME_STORE","-aet","QCS")
        const info = ["-aec", "ACME_STORE", "-aet", "QCS", "-d", "10.0.10.172", "7007"];
        //const child = exec('storescu.exe', args, {cwd: 'storescu'}, (error, stdout, stdin) => {
        var args = info.concat(pathRT);
        console.log('%c [ args ]', 'font-size:13px; background:pink; color:#bf2c9f;', args)
            //const child = exec('storescu.exe -d 10.0.10.172 7007 aaaa.dcm -aec ACME_STORE -aet QCS', {'cwd': 'src/renderer/api/storescu'}, 
        const child = execFile('storescu.exe', args, { 'cwd': 'src/extraResources/storescu' },

                (error, stdout, stdin) => {
                    if (error) {
                        console.log(error);
                        throw error;
                    }
                    console.log(stdout);
                })
            // const value = path.join(__dirname,"./RI.1.3.46.423632.131000.1606838764.9.dcm")
            // console.log('symmetry of this graph is:',qcsNode.get_symmetry(value));
        try {
            // for (let file of obj.files){
            //     // qcsNode.get_scu('storescu.exe',obj.ip,obj.port,file)
            //     console.log('1111111111111111111111111111111111111111111111111111111111');
            //     qcsNode.get_scu("storescu.exe", "-d","10.0.10.172","7007","../../../src/extraResources/images/aaaa.dcm","-aec","ACME_STORE","-aet","QCS")
            //     console.log(file);
            // }
            resolve(1)
        } catch (e) {
            console.log(e)
        }
    })
}
/// 传输dicom文件
// export function transferDicom(obj) {
//     console.log('transferDicom',obj)
//     return new Promise((resolve,reject) => {
//         // const value = path.join(__dirname,"./RI.1.3.46.423632.131000.1606838764.9.dcm")
//         // console.log('symmetry of this graph is:',qcsNode.get_symmetry(value));
//          qcsNode.get_scu('storescu.exe',obj.ip,obj.port,file)
//         try {
//             // for (let file of obj.files){
//             //     qcsNode.get_scu('storescu.exe',obj.ip,obj.port,file)
//             //     console.log(file)
//             // }
//             resolve(1)
//         }catch (e) {
//             console.log(e)
//         }
//     })
// }
// export function album(obj) {
//     console.log('delDicom')
//     return new Promise(resolve => {
//
//     })
// }
//手机登录
// export function addDicom(dicom) {
//     console.log('addDicom')
//     return http.post('/medical/addDicom',dicom)
// }

// export function delDicom(dicom) {
//     console.log('delDicom')
//     return http.post('/medical/delDicom',dicom)
// }
// export function getDicoms(data) {
//     console.log(data)
//     return http.post('/medical/getDicoms',data)
// }

// export function addDevice(device) {
//     console.log('addDevice')
//     return http.post('/medical/addDevice',device)
// }

// export function delDevice(device) {
//     console.log('delDevice')
//     return http.post('/medical/delDevice',device)
// }
// export function getDevices(data) {
//     console.log(data)
//     return http.post('/medical/getDevices',data)
// }
// export function getProjects(data) {
//     console.log(data)
//     return http.post('/medical/getProjects',data)
// }

// export function updateProject(data) {
//     console.log(data)
//     return http.post('/medical/updateProject',data)
// }
//
// export function addTestResult(data) {
//     console.log(data)
//     return http.post('/medical/addTestResult',data)
// }
//
// export function getProjectTests(data) {
//     console.log(data)
//     return http.post('/medical/getProjectTests',data)
// }
//
// export function login(phone, password) {
//     return http.get('/login/cellphone?phone=' + phone + '&password=' + password)
// }
//
// export function banner() {
//     return http.get('/banner')
// }
//
// export function personalized() {
//     return http.get('/personalized')
// }
//
// export function getPlaylistDetail(id) {
//     return http.get('/playlist/detail?id=' + id)
// }
//
// export function getPlaylistHot() {
//     console.log('getPlaylistHot')
//     return http.get('/playlist/hot')
// }
//
// export function getTopPlaylistHighquality(cat = '全部', limit = 30) {
//     return http.get('/top/playlist/highquality?cat=' + cat + "&limit=" + limit)
// }
//
// export function like(id) {
//     return http.get('/like?id=' + id)
// }
//
// export function toplist(idx) {
//     return http.get('/top/list?idx=' + idx)
// }
//
// export function singerlist(cat,offset) {
//     if(cat==0){
//         return http.get('/top/artists?offset=0')
//     }
//     return http.get('/artist/list?cat=' + cat+'&offset='+offset)
// }
//
// export function getSongDetail(ids) {
//     return http.get('/song/detail?ids=' + ids)
// }
//
// export function getMusicUrl(id, br = 999000) {
//     return http.get('/music/url?id=' + id + '&br=' + br)
// }
//
// export function djlist(catid) {
//     if(catid==0){
//         return http.get('/dj/recommend')
//     }else{
//         return http.get('/dj/recommend/type?type='+catid)
//     }
//
// }
// export function djcat() {
//     return http.get('/dj/catelist')
// }