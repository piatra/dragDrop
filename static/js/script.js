var output = document.getElementById('message');
var itemlist = document.getElementById('itemlist');
var timestamp=0;

document.getElementById('dropTarget').addEventListener("change", function (e) {
	output.innerHTML = "";
	var files = e.target.files
		, formData = new FormData();

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
	}

	oXHR.send(formData)

}, false);

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
			appendItems(data.files);
			timestamp = data.timestamp;
		}
	}
}