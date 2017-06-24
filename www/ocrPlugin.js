if (typeof jQuery === 'undefined') {
  	throw new Error('ocrPlugin\'s JavaScript requires jQuery')
}

+function ($) {
	'use strict';
	var version = $.fn.jquery.split(' ')[0].split('.')
	if ((version[0] < 2 && version[1] < 9) || (version[0] == 1 && version[1] == 9 && version[2] < 1) || (version[0] > 3)) {
		throw new Error('ocrPlugin\'s JavaScript requires jQuery version 1.9.1 or higher, but lower than version 4')
	}
}(jQuery);



  
OcrPlugin = {
	defaults: {
    "x-app-key": "",
    "x-sdk-version": "5.1",
    "x-request-date": new Date().toLocaleDateString(),
    "x-task-config": "lang=chinese_cn,capkey=ocr.cloud.template,property=idcard,templateIndex=0,templatePageIndex=1",
    "x-session-key": "",
    "x-udid": "101:1234567890",
    "x-tid": "12345678",
	},

	version: "1.0.0",

	init: function(options) {
		this.options = this.getOptions(options);
		console.log(this.options);
		if (!$.trim(this.options["x-app-key"])) {
			throw new Error("x-app-key couldn't be empty");
		} 
			
		if (!$.trim(this.options["x-session-key"])) {
			throw new Error("x-session-key couldn't be empty");
		} 
		
	},

	getDefaults: function() {
		return defaults
	},

	getOptions: function(options) {
		options = $.extend({}, this.getDefaults, options);

		return options
	},

	getResult: function() {
		return this.res
	},

	takePhoto: function() {
		function cameraSuccess(imageData) {
            var image = document.getElementById('myImage');
            image.src = "data:image/jpeg;base64," + imageData;
        }

        function cameraError(message) {
            alert('Failed because: ' + message);
        }

        navigator.camera.getPicture(cameraSuccess, cameraError, {
            destinationType: Camera.DestinationType.DATA_URL,
        });
	},
	
	recog: function(data){
		var result;
		$.ajax({
			headers: this.options,
			processData: false,
			//crossDomain: true,
			type: "POST",
			url: "http://localhost:8800/",
			data: "hello world",
			async:false,
			success: function(res){
				result = res;
			}
		})
		return result
	},

}













