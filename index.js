const express = require('express');
const request = require('request');
const cheerio = require('cheerio');
// const cookieParser = require('cookie-parser');

const kbbiScrapperRouter = express.Router();
const app = express();
const port = 3000;

// app.use(cookieParser());
app.use(express.json());

app.use((req,res,next) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, POST, PATCH, DELETE, OPTIONS');
	res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
	next();
})

kbbiScrapperRouter.get('/entri/:kata', (req, res, next) => {
	let kata = req.params.kata;

	request(`https://kbbi.kemdikbud.go.id/entri/${kata}`, (err, respone, html) => {
		if(!err && respone.statusCode === 200) {
			let webHtml = cheerio.load(html);	
			let data = webHtml('li:first-of-type', 'ol:first-of-type').html();
			if(!data) {data = webHtml('font:first-of-type', 'ul:first-of-type').parent().html()};
			res.status(200).json({
				message : 'berhasil mengambil data dari KBBI',
				data : data
			})
		}
	})

})

app.use('/', kbbiScrapperRouter);

app.listen(process.env.PORT || port, () => {
	console.log('listening on port 3000')
})

module.exports = app;