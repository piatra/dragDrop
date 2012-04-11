var formidable = require('formidable'),
	fs = require('fs'),
	express = require('express'),
	app = express.createServer().listen(process.env.PORT || 8000),
	exec = require('child_process').exec,
	filelist = {
		'timestamp' : 0,
		'files' : []
	};

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
	filelist.files = [];
	var form = new formidable.IncomingForm();
		form.parse(req, function(err, fields, files) {
			for(var i in files) {
				filelist.files.push("/upload/" + files[i].name);
				filelist.timestamp = (new Date()).toLocaleTimeString();
				fs.rename(files[i].path, __dirname + "/static/upload/" + files[i].name, function(err) {
					if (err) {
						fs.unlink(__dirname + "/static/upload/" + files[i].name);
						fs.rename(files[i].path, __dirname + "/static/upload/" + files[i].name);
					}
				});
			}
			
		});
});

app.get('/update', function(req, res){
	if (req.headers.accept && req.headers.accept == 'text/event-stream') {
		res.writeHead(200, {
			'Content-Type': 'text/event-stream',
			'Cache-Control': 'no-cache',
			'Connection': 'keep-alive'
		});
		sendSSE(req, res);
	}
});

function sendSSE(req, res) {
	var id = (new Date()).toLocaleTimeString();
	constructSSE(res, id);
}

function constructSSE(res, id) {
		if(filelist.files.length) {
			res.write('id: ' + id + '\n');
			res.write('data: ' + JSON.stringify(filelist) + '\n\n');
		}
		setTimeout(function() {
			constructSSE(res, id);
		}, 5000);
}

console.log("Listening on port %d", app.address().port);