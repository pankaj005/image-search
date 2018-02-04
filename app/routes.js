module.exports = function(app) {

	var imageService = require('./services/images.js');
    
    app.get('/api/image/search', function(req, res){
        imageService.search(req, res);
    });
    
    app.get('/api/image/search/keywords', function(req, res){
        imageService.getKeywords(req, res);
    });

    app.get('/downloads/*', function(req, res) {
		res.sendfile('.'+req.path);
	});

	app.get('*', function(req, res) {
		res.sendfile('./public/index.html');
	});

};