const express = require('express');
const router = express.Router();

const { google } = require('googleapis');

router.post('/rfrshtoken', (netReq, netRes) => {
	const SCOPES = ['https://mail.google.com/'];

	const oAuth2Client = new google.auth.OAuth2(process.env.CLIENT_ID, process.env.CLIENT_SECRET, process.env.REDIRECT_URI);

	const authUrl = oAuth2Client.generateAuthUrl({
		access_type: 'offline',
		scope: SCOPES,
	});

	netRes.redirect(authUrl);
});

module.exports = router;
