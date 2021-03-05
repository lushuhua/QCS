const {DBTABLE} = require("../dbaccess/connectDb")
const multer = require('multer')
const path = require('path')
const uploadDir = path.join(__dirname,'../upload/file');
const sq3 = require('sqlite3').verbose()

console.log('uploadDir1111',uploadDir)
const storage = multer.diskStorage({ // 设置上传中间件
    destination: function (req, file, cb) { // 上传路径
        console.log(file);
        cb(null, uploadDir)
    },
    filename: function (req, file, cb) { // 上传之后的文件名
        console.log(file);
        cb(null, file.originalname);
    }
})
const uploadFiles = multer({
    storage: storage
}).array('file');

function uploadFile(req,res,next){
    uploadFiles(req,res,function (err) {
        console.log('uploadFile',req.files,req.body)
        const files = req.files,resObj ={"msg":"文件上传成功","result":true,"token":"","error_code":"0",code:200};
        if (files && files.length>0){
            const db = new sq3.Database(path.join(process.resourcesPath, 'extraResources','medical.db'));
            db.serialize(function () {
                const qscDeviceProjID = req.body.qscDeviceProjID
                var stmt = db.prepare("INSERT INTO qsc_project_file (qscDeviceProjID,checked,fileUrl,imageUrl) VALUES (?,?,?,?)");
                files.forEach(val=>{
                    stmt.run(qscDeviceProjID,0,val.path,'');//多字段插入关键语法
                })
                stmt.finalize();
                res.send(resObj)
            })
        } else {
            res.send(resObj)
        }
    })
}

exports.uploadFile = uploadFile
