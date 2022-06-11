const notify           = require(__path_configs + 'notify');
const systemConfig     = require(__path_configs +'system');
const fileSizeMB       =  systemConfig.file_size_mb;
const util             = require('util');


module.exports = {
    validator: (req, errUpload, taskCurrent)=> {
        req.checkBody('name', "Chiều dài từ 3-30 kí tự.").isLength({min:3, max:30});
        req.checkBody('status', "Vui lòng chon status.").notEmpty();
        req.checkBody('spacecial', "Vui lòng chon spacecial.").notEmpty();
        req.checkBody('ordering', "Vui lòng chọn giá trị từ 1-999.").isInt({min: 1, max: 999});
        req.checkBody('category', "Vui lòng chọn group.").notEmpty();
        req.checkBody('content', "Vui lòng tạo content.").notEmpty();
        req.checkBody('short_content', "Vui lòng tạo mô tả ngắn bài viết.").notEmpty();
        req.checkBody('short_content', "Chiều dài từ 10-200 kí tự.").isLength({min:10, max:200});

        let errors = req.validationErrors() !== false ? req.validationErrors() : [];
        
        if(errUpload){
            if(errUpload.code == 'LIMIT_FILE_SIZE') errUpload = util.format(notify.ERROR_FILE_LIMIT, fileSizeMB);
              errors.push({param: "thumb", msg: errUpload});
          } else{ 
            if(req.file === undefined && taskCurrent =="add"){
            errors.push({param: "thumb", msg: notify.ERROR_FILE_REQUIRE});
            }
          }

        return errors;

    }
}
