const path = require('path');

const express = require('express');
const multer = require('multer');
const router = express.Router();

const { google } = require('googleapis');
const converter = require('../converter');

router.post('/rfrshtoken', (netReq, netRes) => {
	const SCOPES = ['https://mail.google.com/'];

	const oAuth2Client = new google.auth.OAuth2(process.env.CLIENT_ID, process.env.CLIENT_SECRET, process.env.REDIRECT_URI);

	const authUrl = oAuth2Client.generateAuthUrl({
		access_type: 'offline',
		scope: SCOPES,
	});

	netRes.redirect(authUrl);
});

router.post('/convertThisFile', multer({ dest: path.join(__dirname, '../temp/') }).array('file'), (netReq, netRes) => {
	const useableFiles = netReq.files.filter(file => file.mimetype === 'application/vnd.ms-excel');
	const unUseableFiles = netReq.files.filter(file => file.mimetype !== 'application/vnd.ms-excel').map(file => file.originalname);

	if (useableFiles.length !== netReq.files.length) {
		netRes.render('index.hbs', {
			msg: 'These files were not csv. Other files were sent for conversion, if they were in correct format of M.D.K they will be converted. Refresh to see new converted files',
			msgColor: '#0fc790',
			unUseableFiles,
			showFileForm: false,
		});
	} else {
		netRes.render('index.hbs', {
			msg: 'Files were sent for conversion, if they were in correct format of M.D.K they will be converted. Refresh to see new converted files',
			msgColor: '#0fc790',
			showFileForm: false,
		});
	}

	useableFiles.forEach(file => {
		converter(file.path, file.originalname);
	});
});

module.exports = router;
