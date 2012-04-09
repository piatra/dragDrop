var droparea = document.getElementById("container");
var output = document.getElementById('message');

droparea.ondragover = function() {
	var _class = this.className;
	if(_class.trim() != 'hover' ) this.className += 'hover';
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
		} else {
			output.innerHTML = "Error " + oXHR.status + " occurred uploading your file.<br \/>";
		}
	};

	oXHR.send(formData);
	
	return false;
}