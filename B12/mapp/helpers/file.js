const multer        = require('multer');
const randomstring  = require("randomstring");
const path          = require('path');
const fs            = require('fs');
const notify        = require(__path_configs + 'notify');


let uploadHelper = (fieldName, folderUpload, randomStr= 5,  fileSizeMB = 1, fileExtension = 'jpg|jpeg|png|gif') => {

    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
          cb(null, folderUpload)
        },
        filename: (req, file, cb) => {
          const nameRandom = Date.now() + '-' + randomstring.generate(randomStr) + path.extname(file.originalname);
          cb(null,nameRandom);
        }
      });
      
      const upload = multer(
        { 
          storage: storage,
          limits: { fileSize: fileSizeMB * 1024 * 1024},
          fileFilter: (req, file, cb) => {
            const fileType   = new RegExp(fileExtension);
            const extname    = fileType.test(path.extname(file.originalname).toLocaleLowerCase());
            const mimeType   = fileType.test(file.mimetype);
            if(extname && mimeType){ //upload file to folderUpload
              return cb(null, true);
            }else{ // log error
              cb(notify.ERROR_FILE_EXTENSION_IMG);
            }
            
          }
        });

     return upload.single(fieldName);  
    }

let removeFile = (folder, fileName) =>{
 
 if(fileName!=="" && fileName !== undefined){
    if (fs.existsSync(folder + fileName)) { //check file exist
      fs.unlinkSync(folder + fileName); //remove img
  }
 }
}

module.exports = {
    uploadHelper,
    removeFile
}