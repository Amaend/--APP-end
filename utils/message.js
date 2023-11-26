var http = require('http');

var Sms = require('./sendsms.js');
// 创建实例


function sendMessage(phone) {
	let code = Math.floor(Math.random() * 900000) + 100000 + ""; //验证码
	let mobile = phone; //接收短信手机号码，如果多个手机号用逗号间隔

	var app_id = "hw_12208";
	var secretKey = "6de60490c5280c86deebf6bc837b0fdb";

	var template_sign = "闪验";
	var template_id = "ST_2020101100000004"; //短信模板ID

	var sms = new Sms();
	var res = sms.getSendSmsData(
		app_id,
		secretKey,
		template_sign,
		template_id,
		mobile,
		code,
		URL
	);
	let request = http.get('http://api.shansuma.com/gateway.do' + res, function (res) {
		var sendresult = '';
		res.setEncoding('utf8');
		res.on('data', (chunk) => { //获取放回结果
			sendresult = chunk;
		});
		res.on('end', () => {
			console.log(sendresult); //显示返回结果
		});

	}).on('error', function (e) { //错误
		console.log("Got error: " + e.message);
	});
	request.end()
	return code
};
module.exports = sendMessage;