/**
 * Created by cliff on 2021/1/26.
 */
const sq3 = require('sqlite3')
const fs = require('fs');
const S3 = require('aws-sdk/clients/s3')

const path = require('path');
const os = require('os');
const ejsExcel = require('ejsexcel');
let projectDir = path.join(process.resourcesPath,'extraResources/qcs项目目录.xlsx')
    ,sqlDir = path.join(process.resourcesPath, 'extraResources','medical.db')
    ,uploadDir = path.join(process.resourcesPath, 'extraResources/images')
if (process.env.NODE_ENV === 'development'){
    projectDir = path.join(__dirname,'../../extraResources/qcs项目目录.xlsx')
    sqlDir = path.join(__dirname, '../../extraResources/medical.db')
    uploadDir = path.join(__dirname, '../../extraResources/images')
}
console.log('process.env',process.env.NODE_ENV,__dirname)

// var db = new sq3.Database(path.join('sqlite3db','medical.db'));
exports.DBTABLE =
    {
        DICOM:'qsc_dicom',
        PROJECT:'qsc_project',
        DEVICE:'qsc_device',
        DEVICE_PROJ:'qsc_device_proj',
        DEVICE_PROJECT_RESULT:'qsc_device_proj_result',
        PERIOD_DATA:'qsc_period_data',
        PROJECT_FILE:'qsc_project_file', /// 文件上传
        HOSPITALS:'qsc_hospitals', /// 文件上传
    }

//表的创建 加速器配置  项目配置 dicom输出配置
var i=3;
exports.initCoreData = function() {
    // let templateFilePath =  process.env.NODE_ENV === 'development'?path.join(__dirname, '../../extraResources','medical.db'):path.join(process.resourcesPath, 'extraResources','medical.db')
    // let templateFilePath = path.join(process.resourcesPath, 'extraResources','medical.db')
    // console.log('templateFilePath',templateFilePath)
    // if (fs.existsSync(path.join(process.resourcesPath, 'extraResources'))) {
    //     console.log('The path exists.');
    // }
    // else
        {
        console.log('the path not exist, start to create database and initial')
        // fs.mkdirSync(path.join(process.resourcesPath, 'extraResources'));
        // console.log(path.join(__dirname, 'extraResources','medical.db'));
        // console.log(path.join(process.resourcesPath, 'extraResources','medical.db'));
        var db = new sq3.Database(sqlDir);//如果不存在，则会自动创建一个文件
        console.log('initCoreData')
        db.serialize(function() {
            // db.run("DROP TABLE qsc_dicom");
            db.run("CREATE TABLE if not exists qsc_dicom (" +
                "id INTEGER PRIMARY KEY autoincrement," +
                "customer TEXT," +
                "aeTitle TEXT," +
                "ip TEXT," +
                "port TEXT)");
            // db.run("ALTER TABLE qsc_dicom ADD COLUMN deviceID INTEGER DEFAULT 0 ");
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
                "detectCondition TEXT,"+
                "step TEXT,"+
                "remark TEXT,"+
                "dataRequire TEXT,"+
                "extraRequire TEXT,"+
                "moduleRequire TEXT,"+
                "type TEXT,"+
                "analysis TEXT,"+
                "views TEXT"+
                ")");

            // db.run("ALTER TABLE qsc_project ADD COLUMN detail TEXT ",function (err) {
            //     console.log(err)
            // });
            // db.run("DROP TABLE qsc_device");
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
            /// 文件上传数据
            // db.run("DROP TABLE qsc_project_file");
            // db.run("CREATE TABLE if not exists qsc_project_file (" +
            //     "id INTEGER PRIMARY KEY autoincrement," +
            //     "qscDeviceProjID INTEGER," +
            //     "checked INTEGER," +
            //     "fileUrl TEXT," +
            //     "imageUrl TEXT" +
            //     ")");
            // db.run("ALTER TABLE  qsc_device ADD COLUMN xFFF INTEGER DEFAULT 0 ");

            /// 医院信息
            db.run("CREATE TABLE if not exists qsc_hospitals (" +
                "id INTEGER PRIMARY KEY autoincrement," +
                "deviceID INTEGER," +
                "name TEXT," +
                "avatar TEXT," +
                "createDate TEXT" +
                ")");
            // db.run("CREATE UNIQUE INDEX dp_index ON qsc_device_proj(deviceID, projectID) ");
            //     db.run('select * from sqlite_master where type="table" and name="qsc_device_proj"')
            // db.each('select * from sqlite_master where type="table" and name="qsc_device_proj_result"', function(err, row) {
            //     console.log( row);
            // });
            //初始化日期表
            var insert_sql = 'INSERT INTO qsc_period_data (numOfDays,periodRemark) VALUES(1,"1天"),(7,"1周"),(30,"1月"),(90,"3月"),(180,"6月"),(365,"1年")';
            // db.run(insert_sql);
            //初始化项目表
            insert_sql = 'INSERT INTO qsc_project (projectNo,name,subName,radioType,testPoint,numOfInput,threshold,period,detectType,detectCondition) ' +
                'VALUES' +
                '("6.5.2","等中心的指示（激光灯）",       "",                      "无",     "0","5","≤2 mm",       "1天","数值分析","将感光胶片放置于..."),' +
                '("6.1.1","剂量偏差",                   "",                      "X和电子", "1","1","≤3%",         "1周","数值分析","将感光胶片放置于..."),' +
                '("6.2.1","X射线深度吸收剂量特性",        "",                      "X",      "1","1","≤3%或≤3 mm",  "6月","数值分析","将感光胶片放置于..."),' +
                '("6.2.2","电子线深度吸收剂量特性",       "",                      "电子",    "1","1","≤3%或≤2 mm",  "6月","数值分析","将感光胶片放置于..."),' +
                '("6.4.1","照射野的数字指示（单元限束）",  "5 cm×5 cm ~20 cm×20 cm","电子",    "1","1","≤3 mm或≤1.5%","1月","影像分析","将感光胶片放置于..."),' +
                '("6.7.3","治疗床的运动精度",             "前后",                  "无",      "1","1","≤2 mm",          "6月","影像分析","将感光胶片放置于..."),' +
                '("6.1.6","日稳定性（剂量）"             ,  ""                    ,"无",      "2","3","2%",          "6月","数值分析","将感光胶片放置于..."),' +
                '("6.1.2","重复性（剂量）"             ,  "",                     "X和电子",  "0","5","≤0.5%",       "6月","数值分析","将感光胶片放置于...")' ;
            // db.run(insert_sql);
            console.log("SELECT * FROM qsc_project limit 0,100");
            insert_sql = "SELECT * FROM qsc_project"
            console.log('insert_sql',insert_sql)
            db.all(insert_sql, function(err, row) {
                console.log('err',err)
                console.log('db119911',row.length);
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

/// 导入原始项目数据
exports.loadProject = function() {
    console.log('loadProject')
    try {
        let exBuf = fs.readFileSync(projectDir),options_arr=[]
        ejsExcel.getExcelArr(exBuf).then(function(exlJson) {
            console.log("************  read success:getExcelArr");
            let workBook = exlJson;
            let workSheets = workBook[0];
            // return
            const db = new sq3.Database(sqlDir);//如果不存在，则会自动创建一个文件
            db.serialize(function() {
                let insert_sql = 'INSERT OR REPLACE INTO qsc_project (id,name,radioType,subName,projectNo,testPoint,numOfInput,dataRequire,extraRequire,analysis,views,type,detectCondition,period,threshold,step,remark,moduleRequire,detectType,detail) ' +
                    'VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)'
                let stmt = db.prepare(insert_sql);
                workSheets.forEach((val,index)=>{
                    if (index>0 && val.length>0){
                        stmt.run(val)
                    }
                });
                stmt.finalize();
            })
        })
    } catch (e) {
        console.log('readFileSync error')
        console.log(e)
    }
}

/// 导入原始项目数据
exports.uploadFile = function(data,callback) {
    console.log('loadProject')
    try {
        let file = data.file,toPath = path.join(uploadDir,file.name)
        console.log('loadProject',file)
        let fileBuffer = fs.readFileSync(file.path);
        fs.writeFileSync(toPath,fileBuffer)
        callback(null,toPath)
    } catch (e) {
        console.log('uploadFile error')
        callback(e)
    }
}
// this.queryExample();
// this.loadProject()
// this.initCoreData()
// drop();
// this.initializeData();
