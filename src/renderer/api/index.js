import http from '../utils/http'
import {DBTABLE} from "../../main/dbaccess/connectDb";
import {getCurDate} from "../../main/util/util";
const sq3 = require('sqlite3').verbose()
const async = require("async");
const path = require('path');
const resObj ={"msg":"","result":true,"token":"","error_code":"0",code:200};

export function getProjects(obj) {
    console.log('getProjects')
    return new Promise((resolve, reject)=>{
        obj = obj?obj:{}
        console.log(obj);
        console.log('/medical/getDevices');
        var rows = [],index = 0;
        var db = new sq3.Database(path.join(process.resourcesPath, 'extraResources','medical.db'));
        if(!obj.offset)  obj.offset = 10;
        if(!obj.pageNum) obj.pageNum = 0;
        var cond_sql ='';
        if(obj.detectType) cond_sql =' AND proj.detectType="'+obj.detectType+'"';
        if(obj.name) cond_sql =' AND proj.name LIKE "%'+obj.name+'%"';
        if(obj.step) cond_sql =' AND proj.step="'+obj.step+'"';
        if(obj.analysis) cond_sql =' AND proj.analysis="'+obj.analysis+'"';
        async.waterfall([
            function(callback) {

                var select_sql = "SELECT proj.*,device.x_energy_level,device.e_energy_level " +
                    ",IFNULL(dp.testPoint,proj.testPoint) AS testPoint" +
                    ", IFNULL(dp.numOfInput,proj.numOfInput) AS numOfInput " +
                    ", IFNULL(dp.period,proj.period) AS period " +
                    ", IFNULL(dp.threshold,proj.threshold) AS threshold,dp.id,dp.projectID,dp.deviceID  " +
                    " FROM "+DBTABLE.DEVICE_PROJ+" AS dp " +
                    " LEFT JOIN " +DBTABLE.PROJECT+' AS proj ON dp.projectID=proj.id'+
                    " LEFT JOIN " +DBTABLE.DEVICE+' AS device ON dp.deviceID=device.id'+
                    "  WHERE dp.deviceID="+obj.deviceID+cond_sql+" ORDER BY dp.id DESC limit "+obj.offset*obj.pageNum+','+obj.offset;
                console.log(select_sql)
                db.all(select_sql, function(err, rows) {
                    console.log(err)
                    console.log('rows',rows)

                    async.forEachOf(rows, function (row, index, eachcallback) {
                        var energy = [];
                        if((row.radioType=='X'||row.radioType=='X和电子')&&row.x_energy_level&&row.x_energy_level.length>0){
                            var x_energy_arr = JSON.parse(row.x_energy_level);
                            console.log(x_energy_arr);
                            for(var j in x_energy_arr) {
                                energy.push(x_energy_arr[j].x+'MV')
                            }
                        }
                        if((row.radioType=='电子'||row.radioType=='X和电子')&&row.e_energy_level&&row.e_energy_level.length>0){
                            var e_energy_arr = JSON.parse(row.e_energy_level);
                            console.log(e_energy_arr);
                            for(var j in e_energy_arr) {
                                energy.push(e_energy_arr[j].x+'MeV')
                            }
                        }
                        if(energy.length==0) energy[0] = '-';
                        row.energy = energy;

                        var getsql = 'SELECT * FROM  '+DBTABLE.DEVICE_PROJECT_RESULT+' WHERE id=(SELECT max(id) FROM '+DBTABLE.DEVICE_PROJECT_RESULT+' WHERE qscDeviceProjID='+row.id+')'
                        console.log(getsql);
                        db.all(getsql, function(err, result) {
                            // console.log(row.id,result)
                            if(result&&result.length>0){
                                if(result[0].testResult) {
                                    row.testResult = JSON.parse(result[0].testResult);
                                    row.createDate = result[0].createDate;
                                }
                            }
                            eachcallback(null);
                        });

                    }, function (err) {
                        if (err) callback(err);
                        else{
                            resObj.projects = rows;
                            callback(null);
                        }
                    });


                    // for(var i in rows){
                    //     var energy = [];
                    //     if((rows[i].radioType=='X'||rows[i].radioType=='X和电子')&&rows[i].x_energy_level&&rows[i].x_energy_level.length>0){
                    //         var x_energy_arr = JSON.parse(rows[i].x_energy_level);
                    //         console.log(x_energy_arr);
                    //         for(var j in x_energy_arr) {
                    //             energy.push(x_energy_arr[j]+'MV')
                    //         }
                    //     }
                    //     if((rows[i].radioType=='电子'||rows[i].radioType=='X和电子')&&rows[i].e_energy_level&&rows[i].e_energy_level.length>0){
                    //         var e_energy_arr = JSON.parse(rows[i].e_energy_level);
                    //         console.log(e_energy_arr);
                    //         for(var j in e_energy_arr) {
                    //             energy.push(e_energy_arr[j]+'MeV')
                    //         }
                    //     }
                    //     if(energy.length==0) energy[0] = '-';
                    //     rows[i].energy = energy;
                    //     // if(rows[i].testPoint==0) rows[i].testPoint=1;//还是需要设置为1，这样可以添加
                    // }

                });
            },
            function(callback) {
                var select_all_sql = "SELECT COUNT(*) AS count FROM  "+DBTABLE.DEVICE_PROJ+" AS dp " +
                    " LEFT JOIN " +DBTABLE.PROJECT+' AS proj ON dp.projectID=proj.id'+
                    "  WHERE dp.deviceID="+obj.deviceID+cond_sql;
                db.all(select_all_sql, function(err, row) {
                    // console.log(row)
                    resObj.count = row[0].count;
                    callback(null);
                });
            }
        ], function (err, result) {
            if(err) {
                console.error(err);
                resObj.result = false;
            }
            db.close();
            resolve(resObj);
        });
    })
}

//手机登录
export function addDicom(obj) {
    console.log('addDicom')
    return new Promise(resolve => {
        var db = new sq3.Database(path.join(process.resourcesPath, 'extraResources','medical.db'));
        var sql = 'INSERT INTO qsc_dicom (customer,aeTitle,ip,port,deviceID)VALUES(?,?,?,?,?)';
        if(obj.id>0){
            sql = 'UPDATE qsc_dicom SET customer=?,aeTitle=?,ip=?,port=? WHERE id=? ';
            let stmt = db.prepare(sql);
            stmt.run(obj.customer, obj.aeTitle, obj.ip, obj.port,obj.id);
            stmt.finalize();
        }
        else{
            let stmt = db.prepare(sql);
            stmt.run(obj.customer, obj.aeTitle, obj.ip, obj.port,obj.deviceID);
            stmt.finalize();
        }

        db.close();
        resolve(resObj);
    })
}
export function delDicom(obj) {
    console.log('delDicom')
    return new Promise(resolve => {
        var db = new sq3.Database(path.join(process.resourcesPath, 'extraResources','medical.db'));
        db.run('DELETE FROM qsc_dicom WHERE id='+obj.id)

        db.close();
        resolve(resObj);
    })
}
export function getDicoms(obj) {
    console.log('getDicoms')
    return new Promise(resolve => {
        var rows = [],index = 0;
        var resObj ={"msg":"","result":true,"token":"","templates":"","error_code":"0",code:200};
        var db = new sq3.Database(path.join(process.resourcesPath, 'extraResources','medical.db'));
        if(!obj.offset)  obj.offset = 10;
        if(!obj.pageNum) obj.pageNum = 0;
        async.waterfall([
            function(callback) {
                var select_sql = "SELECT * FROM qsc_dicom WHERE deviceID="+ obj.deviceID +" ORDER BY id DESC limit "+obj.offset*obj.pageNum+','+obj.offset;
                console.log(select_sql)
                db.all(select_sql, function(err, rows) {
                    console.log(rows)
                    resObj.dicoms = rows;
                    callback(null);
                });
            },
            function(callback) {
                var select_all_sql = "SELECT COUNT(*) AS count FROM qsc_dicom  WHERE deviceID="+ obj.deviceID;
                db.all(select_all_sql, function(err, row) {
                    console.log(row)
                    resObj.count = row[0].count
                    callback(null);
                });
            }
        ], function (err, result) {
            if(err) {
                console.error(err);
                resObj.result = false;
            }
            db.close();
            resolve(resObj);
        });

    })
}
export function addDevice(obj) {
    console.log('delDicom')
    return new Promise(resolve => {
        var db = new sq3.Database(path.join(process.resourcesPath, 'extraResources','medical.db'));
        var stmt;
        if(obj.id>0){
            var update_sql = 'UPDATE qsc_device  SET model=?,sequence=?,x_energy_level=?,e_energy_level=?,x_volume_percent=?,e_volume_percent=?,e_light_size=?,multileaf_collimator_size=?,default_dir=?,xFFF=? WHERE id=? ' ;
            console.log(update_sql);
            stmt = db.prepare(update_sql);
            stmt.run(obj.model, obj.sequence, obj.x_energy_level,obj.e_energy_level, obj.x_volume_percent,obj.e_volume_percent,obj.e_light_size, obj.multileaf_collimator_size, obj.default_dir,obj.xFFF,obj.id);
            stmt.finalize();
            //添加该加速器的项目，可以增加
            //先获取默认项目，然后组成一个二维码数组，插入到新表中
            async.waterfall([
                function(callback) {
                    var select_sql = "SELECT * FROM qsc_project ORDER BY id DESC ";
                    console.log(select_sql)
                    db.all(select_sql, function(err, rows) {
                        // console.log(rows)
                        callback(null,rows);
                    });
                },
                function(projects,callback) {
                    var insert_sql = 'INSERT INTO '+DBTABLE.DEVICE_PROJ+'  (deviceID,projectID) ' +'VALUES(?,?)';
                    stmt = db.prepare(insert_sql);
                    for(var i in projects)
                    {
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
                    var select_sql = 'SELECT * FROM '+DBTABLE.DEVICE_PROJ+' WHERE deviceID='+obj.id;
                    console.log(select_sql)
                    db.all(select_sql, function(err, rows) {
                        console.log(rows)
                        callback(null);
                    });
                }
            ], function (err, result) {
                if(err) {
                    console.error(err);
                    resObj.result = false;
                }
                db.close();
                resolve(resObj);
            });

        }
        else {
            var insert_sql = 'INSERT INTO qsc_device  (model,sequence,x_energy_level,e_energy_level,x_volume_percent,e_volume_percent,e_light_size,multileaf_collimator_size,default_dir,xFFF) ' +
                'VALUES(?,?,?,?,?,?,?,?,?,?)';
            var stmt = db.prepare(insert_sql);
            stmt.run(obj.model, obj.sequence, obj.x_energy_level, obj.e_energy_level, obj.x_volume_percent, obj.e_volume_percent, obj.e_light_size, obj.multileaf_collimator_size, obj.default_dir, obj.xFFF);
            //同时添加这个加速器要测试的项目，默认将所有项目都加入到该加速器中
            stmt.finalize((function (err, result) {
                console.log(result);
                //获取刚插入的id
                async.waterfall([
                    function (callback) {
                        db.all('select last_insert_rowid() as insertId ', function (err, rows) {
                            console.log(rows);
                            obj.id = rows[0].insertId;
                            callback(null);
                        })
                    },
                    function (callback) {
                        var select_sql = "SELECT * FROM qsc_project ORDER BY id DESC ";
                        console.log(select_sql)
                        db.all(select_sql, function (err, rows) {
                            // console.log(rows)
                            callback(null, rows);
                        });
                    },
                    function (projects, callback) {
                        var insert_sql = 'INSERT INTO ' + DBTABLE.DEVICE_PROJ + '  (deviceID,projectID) ' + 'VALUES(?,?)';
                        stmt = db.prepare(insert_sql);
                        for (var i in projects) {
                            console.log(obj.id, projects[i].id)
                            stmt.run(obj.id, projects[i].id);
                        }
                        stmt.finalize((function (err) {
                            console.log(err);
                            console.log('batch insert done');
                            callback(null);
                        }));
                    },
                    function (callback) {
                        var select_sql = 'SELECT * FROM ' + DBTABLE.DEVICE_PROJ + ' WHERE deviceID=' + obj.id;
                        console.log(select_sql)
                        db.all(select_sql, function (err, rows) {
                            console.log(rows)
                            callback(null);
                        });
                    }
                ], function (err, result) {
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
export function delDevice(dicom) {
    console.log('delDicom')
    return new Promise(resolve => {
        var db = new sq3.Database(path.join(process.resourcesPath, 'extraResources','medical.db'));
        db.run('DELETE FROM qsc_device WHERE id='+obj.id)

        db.close();
        resolve(resObj);
    })
}
export function getDevices(obj) {
    console.log('delDicom')
    return new Promise(resolve => {
        var rows = [],index = 0;
        var resObj ={"msg":"","result":true,"token":"","error_code":"0",code:200};
        var db = new sq3.Database(path.join(process.resourcesPath, 'extraResources','medical.db'));
        if(!obj.offset)  obj.offset = 10;
        if(!obj.pageNum) obj.pageNum = 0;
        async.waterfall([
            function(callback) {
                var select_sql = "SELECT * FROM qsc_device  ORDER BY id DESC limit "+obj.offset*obj.pageNum+','+obj.offset;
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
        ], function (err, result) {
            if(err) {
                console.error(err);
                resObj.result = false;
            }
            db.close();
            resolve(resObj);
        });
    })
}
export function getProjectTests(obj) {
    console.log('delDicom')
    return new Promise(resolve => {
        var rows = [],index = 0;
        var resObj ={"msg":"","result":true,"token":"","error_code":"0",code:200};
        var db = new sq3.Database(path.join(process.resourcesPath, 'extraResources','medical.db'));
        if(!obj.offset)  obj.offset = 10;
        if(!obj.pageNum) obj.pageNum = 0;
        var cond_sql ='';
        if(obj.period!='请选择检测周期'){
            cond_sql += ' AND proj.period="'+obj.period+'"';
        }
        if(obj.fromDate){
            cond_sql += ' AND dp_result.createDate >="'+obj.fromDate+'"';
        }
        if(obj.toDate){
            cond_sql += ' AND dp_result.createDate <="'+obj.toDate+'"';
        }
        async.waterfall([
            function(callback) {
                // "testPoint INTEGER," +
                // "numOfInput INTEGER," +
                // "period TEXT," +
                // "threshold INTEGER," +

                var select_sql = "SELECT proj.*,device.x_energy_level,device.e_energy_level " +
                    ",IFNULL(dp.testPoint,proj.testPoint) AS testPoint" +
                    ", IFNULL(dp.numOfInput,proj.numOfInput) AS numOfInput " +
                    ", IFNULL(dp.period,proj.period) AS period " +
                    ", IFNULL(dp.threshold,proj.threshold) AS threshold,dp.id,dp.projectID,dp.deviceID,dp_result.testResult,dp_result.createDate  " +
                    " FROM "+DBTABLE.DEVICE_PROJECT_RESULT+' AS dp_result ' +
                    ' LEFT JOIN '+DBTABLE.DEVICE_PROJ+" AS dp ON dp_result.qscDeviceProjID=dp.id " +
                    " LEFT JOIN " +DBTABLE.PROJECT+' AS proj ON dp.projectID=proj.id'+
                    " LEFT JOIN " +DBTABLE.DEVICE+' AS device ON dp.deviceID=device.id'+
                    " WHERE dp_result.deviceID="+obj.deviceID+cond_sql+" ORDER BY dp_result.id DESC limit "+obj.offset*obj.pageNum+','+obj.offset;
                console.log(select_sql)
                db.all(select_sql, function(err, rows) {
                    console.log(err)
                    console.log(rows)
                    if(rows&&rows.length>0){
                        for(var i in rows){
                            if(rows[i].testResult) rows[i].testResult = JSON.parse(rows[i].testResult);
                        }
                    }
                    resObj.projects = rows;
                    callback(null);
                });
            },
            function(callback) {
                var select_all_sql = "SELECT COUNT(*) AS count FROM  "+DBTABLE.DEVICE_PROJECT_RESULT+" AS dp_result " +
                    " LEFT JOIN " +DBTABLE.PROJECT+' AS proj ON dp_result.projectID=proj.id '+
                    " WHERE dp_result.deviceID="+obj.deviceID+cond_sql;
                db.all(select_all_sql, function(err, row) {
                    console.log(row)
                    resObj.count = row[0].count;
                    callback(null);
                });
            }
        ], function (err, result) {
            if(err) {
                console.error(err);
                resObj.result = false;
            }
            db.close();
            resolve(resObj);
        });

    })
}
export function updateProject(obj) {
    console.log('delDicom')
    return new Promise(resolve => {
        var db = new sq3.Database(path.join(process.resourcesPath, 'extraResources','medical.db'));
        if(obj.id>0){
            var sql = 'UPDATE '+DBTABLE.DEVICE_PROJ+' SET period=?,threshold=? WHERE id=? ';
            console.log(sql);
            let stmt = db.prepare(sql);
            stmt.run( obj.period, obj.threshold, obj.id);
            stmt.finalize();
        }
        db.close();
        resolve(resObj);

    })
}
export function addTestResult(obj) {
    console.log('delDicom')
    return new Promise(resolve => {
        var db = new sq3.Database(path.join(process.resourcesPath, 'extraResources','medical.db'));
        var sql = 'INSERT INTO '+DBTABLE.DEVICE_PROJECT_RESULT+' (qscDeviceProjID,projectID,deviceID,testResult,personName,createDate)VALUES(?,?,?,?,?,?)';
        let stmt = db.prepare(sql);
        stmt.run(obj.qscDeviceProjID, obj.projectID, obj.deviceID,obj.testResult,obj.personName,getCurDate());
        stmt.finalize();
        db.close();
        resolve(resObj);
    })
}
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
