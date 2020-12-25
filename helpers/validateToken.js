const fs = require('fs');
const path = require('path');

const { google } = require('googleapis');

const validateToken = () => {
	const TOKEN_PATH = path.join(__dirname, `../${process.env.TOKEN_FILE_NAME}`);
	const oAuth2Client = new google.auth.OAuth2(process.env.CLIENT_ID, process.env.CLIENT_SECRET, process.env.REDIRECT_URI);

	return new Promise((resolve, reject) => {
		let token;

		fs.promises
			.readFile(TOKEN_PATH)
			.then(tokenFile => JSON.parse(tokenFile.toString()))
			.then(tokenData => {
				token = tokenData;

				oAuth2Client.setCredentials(token);

				return oAuth2Client.getAccessToken();
			})
			.then(response => {
				const tokenAndOAuthClient = {};

				if (response.token !== token.access_token && response.res !== undefined) {
					token = response.res.data;

					oAuth2Client.setCredentials(token);

					tokenAndOAuthClient.wasValid = false;
				} else {
					tokenAndOAuthClient.wasValid = true;
				}

				tokenAndOAuthClient.oAuth2Client = oAuth2Client;
				tokenAndOAuthClient.token = token;

				fs.promises
					.writeFile(TOKEN_PATH, JSON.stringify(tokenAndOAuthClient.token))
					.then(() => {
						resolve(tokenAndOAuthClient);
					})
					.catch(error => reject(error));
			})
			.catch(error => reject(error));
	});
};

module.exports = validateToken;
