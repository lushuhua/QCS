/**
 * Created by cliff on 2021/1/26.
 */
const sq3 = require('sqlite3')
const fs = require('fs');
const path = require('path');
const os = require('os');



// var db = new sq3.Database(path.join('sqlite3db','medical.db'));
exports.DBTABLE =
    {
        DICOM:'qsc_dicom',
        PROJECT:'qsc_project',
        DEVICE:'qsc_device',
        DEVICE_PROJ:'qsc_device_proj',
        DEVICE_PROJECT_RESULT:'qsc_device_proj_result',
        PERIOD_DATA:'qsc_period_data',
    }


//表的创建 加速器配置  项目配置 dicom输出配置
var i=3;
exports.initCoreData = function() {
    let templateFilePath = path.join(process.resourcesPath, 'extraResources','medical.db')
    console.log(templateFilePath)
    if (fs.existsSync(path.join(process.resourcesPath, 'extraResources'))) {
        console.log('The path exists.');
    }
    else
        {
        console.log('the path not exist, start to create database and initial')
        fs.mkdirSync(path.join(process.resourcesPath, 'extraResources'));
        console.log(path.join(__dirname, 'extraResources','medical.db'));
        console.log(path.join(process.resourcesPath, 'extraResources','medical.db'));
        var db = new sq3.Database(path.join(process.resourcesPath, 'extraResources','medical.db'));//如果不存在，则会自动创建一个文件
        console.log('initCoreData')
        db.serialize(function() {
            // db.run("DROP TABLE qsc_dicom");
            db.run("CREATE TABLE if not exists qsc_dicom (" +
                "id INTEGER PRIMARY KEY autoincrement," +
                "customer TEXT," +
                "aeTitle TEXT," +
                "ip TEXT," +
                "port TEXT)");
            // db.run("DROP TABLE qsc_project");
            db.run("CREATE TABLE if not exists qsc_project (" +
                "id INTEGER PRIMARY KEY autoincrement," +
                "projectNo TEXT," +
                "name TEXT," +
                "subName TEXT," +
                "radioType TEXT," +
                "testPoint INTEGER," +
                "numOfInput INTEGER," +
                "threshold INTEGER," +
                "period TEXT," +
                "detectType TEXT,"+
                "detectCondition TEXT"+
                ")");

            db.run("DROP TABLE qsc_device");
            db.run("CREATE TABLE if not exists qsc_device (" +
                "id INTEGER PRIMARY KEY autoincrement," +
                "model TEXT," +
                "sequence TEXT," +
                "x_energy_level TEXT," +
                "e_energy_level TEXT," +
                "xFFF TEXT,"+
                "x_volume_percent INTEGER," +
                "e_volume_percent INTEGER," +
                "e_light_size INTEGER," +
                "multileaf_collimator_size INTEGER," +
                "default_dir TEXT," +
                "createDate TEXT," +
                "updateDate TEXT" +
                ")");
            // db.run("DROP TABLE qsc_device_proj");
            db.run("CREATE TABLE if not exists qsc_device_proj (" +
                "id INTEGER PRIMARY KEY autoincrement," +
                "deviceID INTEGER," +
                "projectID INTEGER," +
                "testPoint INTEGER," +
                "numOfInput INTEGER," +
                "period TEXT," +
                "threshold INTEGER," +
                "createDate TEXT," +
                "UNIQUE(deviceID, projectID) ON CONFLICT REPLACE" +
                ")");
            // db.run("DROP TABLE qsc_device_proj_result");
            db.run("CREATE TABLE if not exists qsc_device_proj_result (" +
                "id INTEGER PRIMARY KEY autoincrement," +
                "qscDeviceProjID INTEGER," +
                "projectID INTEGER," +
                "deviceID INTEGER," +
                "testResult TEXT," +
                "personName TEXT," +
                "createDate TEXT" +
                ")");

            db.run("CREATE TABLE if not exists qsc_period_data (" +
                "id INTEGER PRIMARY KEY autoincrement," +
                "numOfDays INTEGER," +
                "periodRemark TEXT" +
                ")");

            // db.run("ALTER TABLE  qsc_device ADD COLUMN xFFF INTEGER DEFAULT 0 ");

            // db.run("CREATE UNIQUE INDEX dp_index ON qsc_device_proj(deviceID, projectID) ");
            //     db.run('select * from sqlite_master where type="table" and name="qsc_device_proj"')
            // db.each('select * from sqlite_master where type="table" and name="qsc_device_proj_result"', function(err, row) {
            //     console.log( row);
            // });
            //初始化日期表
            var insert_sql = 'INSERT INTO qsc_period_data (numOfDays,periodRemark) VALUES(1,"1天"),(7,"1周"),(30,"1月"),(90,"3月"),(180,"6月"),(365,"1年")';
            db.run(insert_sql);
            //初始化项目表
            var insert_sql = 'INSERT INTO qsc_project (projectNo,name,subName,radioType,testPoint,numOfInput,threshold,period,detectType,detectCondition) ' +
                'VALUES' +
                '("6.5.2","等中心的指示（激光灯）",       "",                      "无",     "0","5","≤2 mm",       "1天","数值分析","将感光胶片放置于..."),' +
                '("6.1.1","剂量偏差",                   "",                      "X和电子", "1","1","≤3%",         "1周","数值分析","将感光胶片放置于..."),' +
                '("6.2.1","X射线深度吸收剂量特性",        "",                      "X",      "1","1","≤3%或≤3 mm",  "6月","数值分析","将感光胶片放置于..."),' +
                '("6.2.2","电子线深度吸收剂量特性",       "",                      "电子",    "1","1","≤3%或≤2 mm",  "6月","数值分析","将感光胶片放置于..."),' +
                '("6.4.1","照射野的数字指示（单元限束）",  "5 cm×5 cm ~20 cm×20 cm","电子",    "1","1","≤3 mm或≤1.5%","1月","影像分析","将感光胶片放置于..."),' +
                '("6.7.3","治疗床的运动精度",             "前后",                  "无",      "1","1","≤2 mm",          "6月","影像分析","将感光胶片放置于..."),' +
                '("6.1.6","日稳定性（剂量）"             ,  ""                    ,"无",      "2","3","2%",          "6月","数值分析","将感光胶片放置于..."),' +
                '("6.1.2","重复性（剂量）"             ,  "",                     "X和电子",  "0","5","≤0.5%",       "6月","数值分析","将感光胶片放置于...")' ;
            db.run(insert_sql);
            console.log("SELECT * FROM qsc_project limit 0,100");
            db.each("SELECT * FROM qsc_project limit 0,100", function(err, row) {
                console.log(row);
            });
        });
        db.close();
    }
}
/**

 "id INTEGER PRIMARY KEY autoincrement," +
 "projectNo TEXT," +
 "name TEXT," +
 "subName TEXT," +
 "radioType TEXT," + //检测点
 "testPoint INTEGER," +
 "numOfInput INTEGER," +
 "threshold INTEGER," +
 "period TEXT" +
 "detectType TEXT" + //检测类型：数值分析  影像分析
 "detectCondition TEXT" + //拍片条件 或者输入条件 详细说明
 */

exports.initializeData = function(db) {
    db.serialize(function() {
        // db.run("ALTER TABLE  qsc_project ADD COLUMN detectType TEXT ");
        // db.run("ALTER TABLE  qsc_project ADD COLUMN radioType TEXT ");
        var insert_sql = 'INSERT INTO qsc_project (projectNo,name,subName,radioType,testPoint,numOfInput,threshold,period,detectType,detectCondition) ' +
            'VALUES' +
            '("6.5.2","等中心的指示（激光灯）",       "",                      "无",     "0","5","≤2 mm",       "1天","数值分析","将感光胶片放置于..."),' +
            '("6.1.1","剂量偏差",                   "",                      "X和电子", "1","1","≤3%",         "1周","数值分析","将感光胶片放置于..."),' +
            '("6.2.1","X射线深度吸收剂量特性",        "",                      "X",      "1","1","≤3%或≤3 mm",  "6月","数值分析","将感光胶片放置于..."),' +
            '("6.2.2","电子线深度吸收剂量特性",       "",                      "电子",    "1","1","≤3%或≤2 mm",  "6月","数值分析","将感光胶片放置于..."),' +
            '("6.4.1","照射野的数字指示（单元限束）",  "5 cm×5 cm ~20 cm×20 cm","电子",    "1","1","≤3 mm或≤1.5%","1月","影像分析","将感光胶片放置于..."),' +
            '("6.7.3","治疗床的运动精度",             "前后",                  "无",      "1","1","≤2 mm",          "6月","影像分析","将感光胶片放置于..."),' +
            '("6.1.6","日稳定性（剂量）"             ,  ""                    ,"无",      "2","3","2%",          "6月","数值分析","将感光胶片放置于...")' +
            '("6.1.2","重复性（剂量）"             ,  "",                     "X和电子",  "0","5","≤0.5%",       "6月","数值分析","将感光胶片放置于...")' ;

        db.run(insert_sql);
        console.log("SELECT * FROM qsc_project limit 0,100");
        db.each("SELECT * FROM qsc_project limit 0,100", function(err, row) {
            console.log(row);
        });

    });

    db.close();
}

exports.queryExample = function(db) {
    db.serialize(function() {
        db=initDb();
        console.log("SELECT * FROM qsc_device_proj_result limit 0,100");
        db.each("SELECT * FROM qsc_device_proj_result limit 0,100", function(err, row) {
            console.log(row);
        });
    });

    db.close();
}

function  initDb() {
    var db = new sq3.Database('/Users/cliff/develop/sqlite3db/medical.db');
    return db;
}
function  closeDb(db) {
   if(db) db.close();
}
function  drop(db) {
    db= initDb()
    db.run("DROP TABLE qsc_device_proj");
    db.run("DROP TABLE qsc_project");
    if(db) db.close();
}


// this.queryExample();

this.initCoreData()
// drop();
// this.initializeData();