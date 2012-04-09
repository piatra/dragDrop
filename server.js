var formidable = require('formidable'),
		fs = require('fs'),
		express = require('express'),
		app = express.createServer(),
		exec = require('child_process').exec;

app.configure(function(){
	app.use(express.static(__dirname + '/static'));
	app.set('view engine', 'jade');
	app.set('views', __dirname + '/views');
});

app.get('/', function(req, res){
	child = exec('ls ./static/upload', function(err, stdout, stderr){
		stdout = stdout.split('\n');
		console.log(stdout);
		var content = [];
		for(var i in stdout) {
			content.push('<a href="/upload/'+stdout[i]+'">'+ stdout[i] +'</a><br>');
		}
		res.render('index',{
			content: content
		});
	})
})

app.post('/upload', function(req, res){
	var form = new formidable.IncomingForm();
		form.parse(req, function(err, fields, files) {
			for(var i in files) {
				console.log(files[i]);
				fs.rename(files[i].path, "/opt/apps/dropbox/static/upload/" + files[i].name, function(err) {
					if (err) {
						fs.unlink("/opt/apps/dropbox/static/upload/" + files[i].name);
						fs.rename(files[i].path, "/opt/apps/dropbox/static/upload/" + files[i].name);
					}
				});
			}
			
		});
	res.send('Uploaded complete!');
});

app.listen(3000);