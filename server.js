console.log('My first node app');

const PORT = process.env.PORT || 8080;

const fs = require('fs');
const path = require('path');
const http = require('http');
const debug = require('debug');

const logger = debug('mylogger');

const server = http.createServer((req, res) => {
	console.log(req.url);
	console.log(process.memoryUsage());
	const filename = req.url === '/' ? '/index.html' : req.url;
	fs.readFile(path.join(__dirname, '/public', filename), (err, data) => {
		console.log(req.url);
		if (err) {
			console.log(err);
			res.writeHead(404, 'file problems');
			res.end();
			return;
		}
		res.writeHead(200, 'OK');
		res.write(data);
		res.end();
	});
});



server.listen(PORT, () => console.log(`Listening on ${ PORT }`));