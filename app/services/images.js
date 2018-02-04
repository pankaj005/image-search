
var request = require('request'), // Request module is used to call to goole server to get the data
 Promise = require("bluebird") // bluebird module is used for promise
 fs = require('fs');
const cheerio = require('cheerio'); // Cheerio module is used to parse htmlString
var path = require('path');

var Images = require('./../models/images').images; 

const PRE_URL= 'https://www.google.co.in/search?q=';
const POST_URL = '&source=lnms&tbm=isch&sa=X&ved=0ahUKEwiC9pKR9ovZAhUlSo8KHbXRAIAQ_AUICigB&biw=1301&bih=629'

/**
 * This is private function and used to download image by url
 * @param  {String} filename [description]
 * @param  {String} uri      [description]
 * @param  {String} q        [description]
 * @return {Object}          [description]
 */
function _download(filename, uri, q){
    return new Promise(function (resolve, reject ){
        request.head(uri, function(err, res, body){
                
            request(uri).pipe(fs.createWriteStream(filename)).on('close', function(){
                resolve({'file':q});
            });
        });
    }) 
}


/**
 * Save images into databases
 * @param  {Array} images , array of images to be saved
 * @param  {String} q      , Search query name
 * @return {[type]}        [description]
 */
function _save(images, q){
    return new Promise(function (resolve, reject ){
        var data = {
            'name': q,
            'images': images,
            'searched':1
        }
        var imgObj = new Images(data);
        imgObj.save(function (err){
            resolve();
        })
    }) 
}

/**
 * This method in used to parse html string and get the image list
 * @param  {String} htmlString , html sating
 * @return {Array}  list og images.
 */
function _parseHtml (htmlString){
    const $ = cheerio.load(htmlString)
    var imagesArray = $("#ires").find("img").map(function(){
        return this.attribs.src;
    }).get();
    imagesArray = imagesArray.length > 15?imagesArray.splice(15, imagesArray.length):imagesArray;
    return imagesArray;
}

function _httpCall(q){
    return new Promise(function (resolve, reject) {
        var options = {
            method: 'GET',
            url: PRE_URL + q + POST_URL
        };
        function callback(error, response, body) {
            if (!error && response.statusCode == 200) {
                        resolve(body);
            } else {
                reject(error);
                
            }
        }
        request(options, callback);
    });
}

/**
 * Find image on DB and if found then update searched counter
 * @param  {String} q , String to be searched
 * @return {Object}   Result
 */
function _findLocalImage(q){
    
    return new Promise(function (resolve, reject) {
        Images.findOneAndUpdate(
            {
                'name':q
            },
            { $inc: { "searched" : 1 } },
             function (err, result){
            if(result){
                resolve(result);
            } else {
                reject({'message':'No data found'});
            }
        });
    });
}

/**
 * This method is used to search the images. First find search in local then search in google 
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
function search(req, res){
    var q = req.query.q.trim();
    if(!q){
        res.statusCode(400);
        res.send({'message':'Invalid query'});
    } else {
        // Finding image in local DB
        _findLocalImage(q).then(function(result){
            res.send(result);
        }).catch(function(){
            // Calling to google server
            _httpCall(q).then(function (data){
                var urls = _parseHtml(data);
                var promises = [];
                urls.forEach(function(el,index){
                    var filename = path.join(__dirname, './../../downloads',q+''+index);
                    promises.push(_download(filename,el, q+''+index));
                })
                Promise.all(promises).then(function(results) {
                    var imagesToBeSaved = results.map(function(e){
                        return e.file;
                    });
                    _save(imagesToBeSaved, q).then(function(){
                        res.send({'images': imagesToBeSaved})
                    }).catch(function(){
                        res.statusCode(400);
                        res.send({'message':'an error occures'})
                    })
                });
            })
        })   
    }
}

/**
 * This function returns the all previous searched images
 * @param  {Object} req , Request object
 * @param  {Object} res  , Response object
 * @return {Object}     return Response
 */
function getKeywords(req, res){
    Images.find({},{_id:0,name:1, searched:1}, function (err, results){
        res.send(results);
    });
}

module.exports = {
    getKeywords:getKeywords,
    search:search
}