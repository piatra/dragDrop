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
	child = exec('ls -s ./static/upload', function(err, stdout, stderr){
		stdout = stdout.split('\n');
		var content = [];
		var item;
		for(var i = 1; i < stdout.length - 1; ++i) {
				item = stdout[i].trim().split(' ');
				content.push({
					'name' : item[item.length-1],
					'size' : item[0]
				});
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
				fs.rename(files[i].path, __dirname + "/static/upload/" + files[i].name, function(err) {
					if (err) {
						fs.unlink(__dirname + "/static/upload/" + files[i].name);
						fs.rename(files[i].path, __dirname + "/static/upload/" + files[i].name);
					}
				});
			}
			
		});
	res.send('Uploaded complete!');
});

console.log('server started on port 8000');
app.listen(8000);