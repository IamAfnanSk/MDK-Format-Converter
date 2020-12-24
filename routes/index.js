const fs = require('fs');
const url = require('url');
const path = require('path');

const express = require('express');
const router = express.Router();

const { google } = require('googleapis');

router.get('/', (netReq, netRes) => {
	const queries = url.parse(netReq.url, true).query;

	if (queries.code) {
		const code = queries.code;

		const oAuth2Client = new google.auth.OAuth2(process.env.CLIENT_ID, process.env.CLIENT_SECRET, process.env.REDIRECT_URI);

		oAuth2Client.getToken(code, (error, token) => {
			if (!error) {
				oAuth2Client.setCredentials(token);

				fs.promises.writeFile(path.join(__dirname, `../${process.env.TOKEN_FILE_NAME}`), JSON.stringify(token)).then(() => {
					netRes.render('index.hbs', {
						show: false,
						msg: 'Refresh done',
						msgColor: '#0fc790',
					});
				});
			} else {
				netRes.render('index.hbs', {
					show: false,
					msg: 'Oh no something went wrong, refresh again',
					msgColor: '#dd1551',
				});
			}
		});
	} else {
		const outputPath = path.join(__dirname, '../public/output');

		fs.promises.readdir(outputPath).then(files => {
			const sortedFiles = files
				.map(file => {
					return {
						name: file,
						time: fs.statSync(outputPath + '/' + file).mtime,
					};
				})
				.sort((a, b) => b.time - a.time)
				.map(file => file.name);

			netRes.render('index.hbs', {
				show: false,
				files: sortedFiles,
				showFileForm: true,
			});
		});
	}
});

module.exports = router;
