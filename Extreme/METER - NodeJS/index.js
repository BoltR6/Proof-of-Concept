const R6API = require('r6api.js').default;
const readline = require("readline");
const resemble = require("resemblejs");
const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});
var express = require('express');
var app = express();
var path = require('path');
var http = require('http').Server(app);
var io = require('socket.io')(http);
var fs = require('fs');
const email = "johnwhite86113@gmail.com";
const password = process.env['ps2'];
const r6api = new R6API({ email, password });


async function gaming(n, final) {
	const user = n;
	const plat = 'uplay';
	const data = {};
	let score = 100;
	try {
		data.info = (await r6api.findByUsername(plat, user))[0];
		if (data.info.id) {
			data.status = (await r6api.getUserStatus(data.info.id))[0];
			data.apps = (await r6api.getProfileApplications(data.info.id, { fetchApplications: true }))[0];
			console.log(data.apps)
			data.ranks = (await r6api.getRanks('uplay', '0b95544b-0228-49a7-b338-6d15cfbc3d6a', { regionIds: 'ncsa', boardIds: 'pvp_ranked', seasonIds: [23,24] }))[0];
			console.log(data)
			if (data.apps && data.status) {
				score += (data.apps.applications.length - 4);
				score += (4 - data.info.username.length);
			}
			if (data.info) {
				let calc = resemble('comp.png').compareTo(data.info.avatar['256']).ignoreColors();
				let res = await new Promise((resolve) => calc.onComplete(resolve));
				score += res.rawMisMatchPercentage == 0 ? -10 : 0
			}
			if (data.apps == undefined) {
				score = "Autoclaimed Name"
			}
		}
		data.check = await r6api.validateUsername(user);
		if (!data.info) {
			score = "Not taken"
		}
		if (data.check.valid == false && data.check.validationReports[0].message !== 'NameOnPlatform is not available') {
			score += ", invalid under Ubi naming";
		}
		if(data.ranks.seasons){
			let stats = data.ranks.seasons['24'].regions.ncsa.boards.pvp_ranked;
			console.log(stats.current)
		}
		final.raw(data.ranks.seasons['24'].regions.ncsa);
		final.score(score);
	} catch (err) {
		if(!err.toString().includes('429')){
			console.log("Name doesn't exist\n" + err)
		}else{
			console.log('Rate limited. FUCK')
		}
		return -1;
	}
};
rl.on('line', (input) => {
	gaming(input, {
		raw: function(data) {
			console.log(data)
		},
		score: function(data) {
			if(Number.isInteger(data)){
				console.log('Score: ' + data)
			}else{
				console.log(data)
			}
		}
	})
});

