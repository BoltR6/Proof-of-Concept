"use strict";

const http = require('http');
const Unblocker = require("unblocker");
const fs = require('fs');
const url = require('url');
const ytdl = require("ytdl-core");

const port = 8080;
const prefix = 't';
const options = {
	key: fs.readFileSync('./ssl/key.pem'),
	cert: fs.readFileSync('./ssl/cert.pem'),
};
const unblocker = Unblocker({
	prefix: '/' + prefix + '/',
	clientScripts: true,
	requestMiddleware: [processRequest],
});
//read video html file as utf8
const videoHTML = fs.readFileSync('./html/video.html', 'utf8');

function processRequest(data) {
	const { hostname, pathname } = new URL(data.url);
	if (hostname === "www.youtube.com" && pathname === "/watch") {
		const res = data.clientResponse;
		res.writeHead(200, { "content-type": "text/html; charset=utf-8" });
		ytdl
			.getInfo(data.url)
			.then((info) => {
				const formats = ytdl.filterFormats(info.formats, "audioandvideo");
				const thumb = info.videoDetails.thumbnails.pop();
				res.end(videoHTML);
			})
			.catch((err) => {
				console.error(`Error getting info for ${data.url}`, err);
				res.end("Couldn't get video");
			});
	}
}
var server = http.createServer(options, function(req, res) {
	var query = req.url.substring(3, 83);
	if (req.url.substring(0, 6) === '/?url=') {
		console.log('Redirecting...')
		res.writeHead(302, {
			location: './t/' + req.url.substring(6, req.url.length),
		});
		res.end();
		re turn; 
	} else {
		if(query !== '' && query !== 'http:/www.youtube.com/'){
		console.log("Search: " + query);
		}
	}      // Code that checks if a link is a real and valid link
	if(req.url.substring(3).search(/\w+.\w+/g) == -1 && !['/','/p/','/d/','/t/'].includes(req.url) )
	{
		res.end('Please directly copy the FULL link. Do not omit http type.');
		return;
	}
	unblocker(req, res, function(err) {
		var headers = { text: { "content-type": "text/plain" }, html: { "content-type": "text/html; charset=UTF-8" } };
		if (err) {
			res.writeHead(500, headers.text);
			res.end(err);
	return;
		}
		
		switch (req.url) {
			case '/':
				res.writeHead(200, headers.html)
				fs.readFile('./html/home.html', function(err, read_html) {
					if (err) {
						console.log(err + "fuck");
					} else {
						res.write(read_html);
						res.end();
					}
				});
					break;
			case '/p/':
			res.writeHead(200, headers.html)
				fs.readFile('./html/proxy.html', function(err, read_html) {
					if (err) {
						console.log(err + "fuck");
					} else {
						res.write(read_html);
						res.end();
						}
				});
				break;
			case '/d/':
			res.writeHead(200, headers.html)
				fs.readFile('./html/discord.html', function(err, read_html) {
					if (err) {
						console.log(err + "fuck");
					} else {
						res.write(read_html);
						res.end();
						}
				});
			break;
			default:
				res.writeHead(404, headers.text);
				res.end("type your urls right dumbass");
				break;
		}

	});
}).listen(port);

// allow unblocker to proxy websockets
server.on("upgrade", unblocker.onUpgrade);

console.log(`Framework Live on Repl Machine At: http://localhost:${port}/`);