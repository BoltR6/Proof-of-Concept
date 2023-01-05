const R6API = require('r6api.js').default;
const readline = require("readline");
const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: '<username>',
    pass: '<password>',
  }
});
const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});
var path = require('path');
var fs = require('fs');
var emailIndex = 0;
var waitDelay = false;
var delay = 60000;
var startIter = 0;
var stop = false;
const emails = fs.readFileSync('data/emails.txt', 'utf-8').split(',');
const password = process.env['ps'];
const words = fs.readFileSync('data/words.txt', 'utf-8').split('\n');
var email = 'johnwhite86112@gmail.com';
function sleep(ms) {
	return new Promise((resolve) => {
		setTimeout(resolve, ms);
	});
}
function changeLast(indOf, changeTo) {
	let last = fs.readFileSync('data/last.txt', 'utf-8').split(',');
	last[indOf] = changeTo;
	last = last.join(',');
	fs.writeFile('data/last.txt', last, (err) => { if (err) { console.log('Could not write index. ' + err) } });
}
function startClaim(fileName) {
	try {
		var wordList = fs.readFileSync(fileName, 'utf-8').split('\n');
		console.log('Attempting to start list')
		async function startList() {
			console.log('	List Started With A ' + (delay / 1000) + ' Second Delay: ' + wordList.length + " words")
			for (var iter = startIter; iter < wordList.length; iter++) {
				if (stop) {
					stop = false;
					return;
				}
				if (iter % 5 == 0) {
					changeLast(1, iter);
				}
				if (waitDelay) {
					await new Promise(resolve => setTimeout(resolve, 300000));
					waitDelay = false;
					iter -= 2;
				}
				gaming(wordList[iter], () => { }, iter, wordList.length);
				await new Promise(resolve => setTimeout(resolve, delay));
			}
		}
		startList();
	} catch (err) {
		console.log('Error: ' + (err + "").substring(0, 30) + '...')
	}
}

async function gaming(n, final, i, l) {
	emailIndex = emailIndex !== (emails.length - 1) ? emailIndex + 1 : 0;
	var email = emails[emailIndex];
	var user = n;
	var plat = 'uplay';
	var r6api = new R6API({ email, password });
	const data = {};
	console.log("	Checked " + n + ", " + i + "/" + l + ", under " + email);
	let score = 100;
	try {
		if ((await r6api.findByUsername(plat, user))[0]) {
		} else {
			data.check = await r6api.validateUsername(user);
			if (!(data.check.valid == false && data.check.validationReports[0].message !== 'NameOnPlatform is not available')) {
				console.log("		CLAIMABLE: '" + n + "''")
				fs.appendFileSync('data/toclaim.txt', ',' + n);
				var mailOptions = {
  				from: 'johnwhite86113@gmail.com',
  				to: 'johnwallacewhite@gmail.com',
  				subject: 'Claim',
  				text: n + ' is available',
				};

				transporter.sendMail(mailOptions, function(error, info){
  				if (error) {
    				console.log(error);
  				} else {
    				console.log('Email sent: ' + info.response);
  				}
				});
			} else {
				console.log('Cannot claim name, is impossible')
			}
		}
	} catch (err) {
		if (err.toString().includes('429')) {
			console.log('Rate limited. FUCK ' + err)
		}
		waitDelay = true;
		return -1;
	}
};
rl.on('line', (input) => {
	switch (input.substring(0, 5).toLowerCase()) {
		case 'read ':
			gaming(input.substring(5, input.length), {
				raw: function(data) {
					console.log(data)
				},
				score: function(data) {
					if (Number.isInteger(data)) {
						console.log('Score: ' + data)
					} else {
						console.log(data)
					}
				}
			});
			break;
		case 'delay':
			delay = (input.substring(6, input.length) * 1) > 0 ? (input.substring(6, input.length) * 1) : delay;
			console.log('	Delay successfully set to ' + (delay / 1000) + ' seconds');
			changeLast(0, delay);
			break;
		case 'carry':
			let last = fs.readFileSync('data/last.txt', 'utf-8').split(',');
			delay = (last[0] * 1);
			startIter = (last[1] * 1);
			fileName = last[2];
			startClaim(fileName);
			break;
		case 'stop ':
			stop = true;
			break;
		case 'lista':
			console.log(fs.readFileSync('data/words.txt', 'utf-8').split('\n'));
			break;
		case 'sitr ':
			if (Number.isInteger(input.substring(5, input.length) * 1)) {
				startIter = Math.floor(input.substring(5, input.length) * 1);
				changeLast(1, startIter)
				console.log('	Set starting iterator to ' + startIter);
			} else if (input.substring(5, 6) == '.') {
				startIter = (
					fs.readFileSync('data/last.txt', 'utf-8').split(',')[1] * 1
				);
				console.log('	Read starting iter to be ' + startIter + ' from data/last.txt');
			} else {
				try {
					let throwErr = Math.floor(input.substring(5, input.length) * 1);
				} catch (err) {
					console.log(err)
				}
			}

			break;
		case 'list ':
			startClaim(input.substring(5, input.length));
			break;
	}
});
