/**
 * FileController
 *
 * @description :: Server-side logic for managing files
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	
	index: function(req, res, next) {
        File.find(function foundFiles(err, files) {
            if (err) return next(err);
            res.view({
                files: files
            });
        });
    },
    show: function(req, res, next) {

        File.findOne(req.param('id'))
        .populate('subtitulo_del_video')
        .exec(function(err,file) {
            res.view({
                subtitles: file.subtitulo_del_video,
                file: file
            });
        });
    },
    destroy: function(req, res, next) {

        File.findOne(req.param('id'), function foundFile(err, file) {
            if (err) return next(err);
            if (!file) return next('File doesn\'t exist.');

            var pathToRemove = file.fullPath;
            
            File.destroy(req.param('id'), function fileDestroyed(err) {
                if (err) return next(err);

                var fs = require('fs');
                var readRemoveFile = require('read-remove-file');

                readRemoveFile(pathToRemove, function(err, buf) {
                    if (err) return next(err);
                    buf;
                    fs.existsSync(pathToRemove); //=> false 
                    return res.redirect('/file/');
                });
            });
        });
    },
    'upload-file' :function (req,res) {
        res.view();
    },
    getFile: function (req, res) {
    	var query = {name: req.param('name')};

        if (req.param('version'))
        query = {name: req.param('fileName'), version: req.param('version')};

        File.findOne({where : query, sort: 'version DESC'}).exec(function(err, videoFile) {
            if (err) {	   
                console.log("Error: " + err);
                res.json(err);
                return;
            }
            else if (videoFile) {   
                console.log("videoFile: " + videoFile);
                console.log("videoFile name: " + videoFile.name);

                res.download(videoFile.fullPath, videoFile.name);
            }
            else
                res.json("videoFile not found!");
        });
    },
    upload: function  (req, res) {
        if(req.method === 'GET')
            return res.json({'status':'GET not allowed'});
            // Call to /upload via GET is error
            var upFile = req.file('upFile');

            var path = './tempd/pets/images/';

            var mkdirp = require('mkdirp');
            mkdirp(path, function(err) { 
                if (err) {
                    console.log("Video folder not created: ", err);
                    return res.serverError(err);
                }
                console.log("Video folder created or existed!")
                
                upFile.upload({maxBytes: 1000000000, dirname: path },function onUploadComplete (err, files) {                                                                                                      
                    if (err) {
                        console.log("Video file not uploaded. Error: "+err);
                        return res.serverError(err);
                    }
                    else {
                     var filePath = files[0].fd;
                     var fileSize = files[0].size;
                     var fileType = files[0].type;
                     var fileName = files[0].filename;

                     File.create({name: fileName,
                        version: 0,
                        description: fileType,
                        file: fileName,
                        fileSize: fileSize,
                        fullPath: filePath}, function Done(err) {
                            res.redirect('file/index/');
                        });
                    }
                });
            });
    }
};

