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

  
var OcrPlugin = {
	defaults: {
	    "x-app-key": "",		//捷通开发者应用appkey,必填
	    "x-sdk-version": "5.1",	//sdk版本，必填
	    "x-request-date": "",	//请求日期，必填
	    //ocr识别配置串，必填
	    "x-task-config": "lang=chinese_cn,capkey=ocr.cloud.template,property=idcard,templateIndex=0,templatePageIndex=0",
	    "x-session-key": "",	//验证码，必填
	    "x-udid": "101:1234567890",	//udid，必填
	    // "x-tid": "12345678",
	},

	recogTypeArray: [0, 1, 2],	//0-身份证正面，1-身份证反面，2-票据，默认为0
	url: "http://api.hcicloud.com:8880/ocr/auto_recognise",
	//accountTypeArray: [0, 1],	//0-JT商用帐号， 1-JT测试账号，默认为0
	version: "1.0.0",

	init: function(options) {
		this.options = this.getOptions(options);
		console.log(this.options);
	},

	getDefaults: function() {
		return this.defaults;
	},

	optionsVerify: function(options) {
		if (typeof options["appKey"] === "undefined" || !$.trim(options["appKey"])) {
			throw new Error("appKey couldn't be empty");
		} 

		if (typeof options["sessionKey"] === "undefined" || !$.trim(options["sessionKey"])) {
			throw new Error("sessionKey couldn't be empty");
		}

		if (typeof options["requestDate"] === "undefined" || !$.trim(options["requestDate"])) {
			throw new Error("requestDate couldn't be empty");
		}

		if (typeof options["recogType"] !== "undefined" && 
				!(($.trim(options["recogType"])) in this.recogTypeArray)) {
			throw new Error("recogType must be one of (0, 1, 2)");
		}

		// if (typeof options["accountType"] !== "undefined" && 
		// 		!(($.trim(options["accountType"])) in this.accountTypeArray)) {
		// 	throw new Error("recogType must be one of (0, 1)");
		// }
	},

	getOptions: function(options) {

		this.optionsVerify(options);
		newOption = {};
		newOption["x-app-key"] = $.trim(options["appKey"]);
		newOption["x-request-date"] = $.trim(options["requestDate"]);
		newOption["x-session-key"] = $.trim(options["sessionKey"]);

		recogType = $.trim(options["recogType"]);

		if (recogType == 1) {	//身份证反面
			newOption["x-task-config"] = "lang=chinese_cn,capkey=ocr.cloud.template,property=idcard,templateIndex=0,templatePageIndex=1";
		}
		if (recogType == 2) {	//票据识别
			newOption["x-task-config"] = "lang=chinese_cn,capkey=ocr.cloud.template,property=vat,templateIndex=0,templatePageIndex=0";
		}

		accountType = $.trim(options["accountType"]);

		// if (accountType == 1) {	//JT测试账号
		// 	this.url = "http://test.api.hcicloud.com:8880/ocr/auto_recognise";
		// }

		options = $.extend({}, this.getDefaults(), newOption);

		return options;
	},

	dataToBlob: function(data) {
				  
		var bstr = atob(data), n = bstr.length, u8arr = new Uint8Array(n);
		while(n--){
			u8arr[n] = bstr.charCodeAt(n);
		}
		return new Blob([u8arr], {type:"image/jpeg"});
	},
	
	recog: function(data){
		var result;
		data = this.dataToBlob(data);
		$.ajax({
			headers: this.options,
			processData: false,
			type: "POST",
			url: this.url,
			data: data,
			async:false,
			success: function(res){
				result = res;
			}
		})
		return result
	},

	takePhotoAndRecog: function() {
		function cameraSuccess(imageData) {
			// this.imgData = imageData;
			console.log(this)
			console.log(OcrPlugin)
			result = OcrPlugin.recog(imageData);
			console.log(result);
			return result;
		}

		function cameraError(message) {
			alert("Failed because: " + message);
		}

        navigator.camera.getPicture(cameraSuccess, cameraError, {
            destinationType: Camera.DestinationType.DATA_URI,
        });
	},

}













