var droparea = document.getElementById("container");
var output = document.getElementById('message');
var itemlist = document.getElementById('itemlist');
var timestamp=0;

droparea.ondragover = function() {
	var _class = this.className;
	if(_class.trim() != 'hover' ) this.className += 'hover';
	else output.innerHTML = 'Drop files anywhere in here';
	output.className = '';
}

droparea.ondragend = function() {
	// nothing to do here
}

droparea.ondrop = function(e) {
	e.preventDefault();
	this.className = '';

	var files = event.dataTransfer.files;
	var formData = new FormData();

	for (var i = 0; i < files.length; i++) {
		formData.append('file' + i, files[i]);
	}

	var oXHR = new XMLHttpRequest();
	oXHR.open("POST", "/upload", true);
	oXHR.onload = function(oEvent) {
		if (oXHR.status == 200) {
			output.innerHTML = "Uploaded!";
			output.className += 'alert-success';
		} else {
			output.innerHTML = "Error " + oXHR.status + " occurred uploading your file.<br \/>";
		}
	};

	oXHR.send(formData);
	
	return false;
}

var appendItems = function(file) {
	var content = '';
	if(file.length>1) {
		for (var i = 0; i < file.length; i++) {
			var item = file[i].split('/');
			content += '<li class="new"><a href=/upload/' + file[i] + '>' + item[item.length-1] + '</a></li>';
		};
	} else {
		var item = file[0].split('/');
		content += '<li class="new"><a href=/upload/' + file + '>' + item[item.length-1] + '</a></li>';
	}
	itemlist.innerHTML += content;
}

if (!!window.EventSource) {
	var source = new EventSource('/update');
	source.onmessage = function(e) {
		var data = JSON.parse(e.data);
		if(timestamp == data.timestamp) return;
		else {
			console.log(timestamp);
			console.log(data.timestamp);
			appendItems(data.files);
			timestamp = data.timestamp;
		}
	}
}