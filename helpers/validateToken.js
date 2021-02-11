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
				const wasValid = response.token === token.access_token;

				if (!wasValid) {
					if (response.res) {
						if (!response.res.data.refresh_token) {
							console.log('I saved error');
							response.res.data.refresh_token = token.refresh_token;
						}

						token = response.res.data;
						oAuth2Client.setCredentials(token);
					} else {
						token.access_token = response.token;
					}
				}

				const tokenAndOAuthClient = {
					oAuth2Client,
					token,
					wasValid,
				};

				const dataToWriteToFile = JSON.stringify(tokenAndOAuthClient.token);

				return fs.promises
					.writeFile(TOKEN_PATH, dataToWriteToFile)
					.then(() => {
						resolve(tokenAndOAuthClient);
					})
					.catch(error => reject(error));
			})
			.catch(error => reject(error));
	});
};

module.exports = validateToken;
