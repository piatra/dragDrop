var droparea = document.getElementById("container");
var output = document.getElementById('message');
var itemlist = document.getElementById('itemlist');

droparea.ondragover = function() {
	var _class = this.className;
	if(_class.trim() != 'hover' ) this.className += 'hover';
	else this.innerHTML = 'Drop files anywhere in here';
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
			appendItems(files);
		} else {
			output.innerHTML = "Error " + oXHR.status + " occurred uploading your file.<br \/>";
		}
	};

	oXHR.send(formData);
	
	return false;
}

var appendItems = function(files) {
	var content,
		item;
	for (var i = 0; i < files.length; i++) {
		item = files[i];
		content += '<li><a href=/upload/' + item.name + '>' + item.name + '</a></li>';
	};
	itemlist.innerHTML += content;
}