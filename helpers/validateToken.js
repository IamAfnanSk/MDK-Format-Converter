const fs = require('fs');
const path = require('path');

const { google } = require('googleapis');

const validateToken = () => {
	const TOKEN_PATH = path.join(__dirname, `../${process.env.TOKEN_FILE_NAME}`);

	const oAuth2Client = new google.auth.OAuth2(process.env.CLIENT_ID, process.env.CLIENT_SECRET, process.env.REDIRECT_URI);

	return new Promise((resolve, reject) => {
		fs.promises
			.readFile(TOKEN_PATH)
			.then(tokenFile => JSON.parse(tokenFile.toString()))
			.then(token => {
				oAuth2Client.setCredentials(token);

				return new Promise((resolve, reject) => {
					oAuth2Client.getAccessToken((error, freshToken) => {
						error ? reject(error) : '';

						const respToForward = {};

						token.access_token === freshToken ? (respToForward.wasValid = true) : (respToForward.wasValid = false);

						token.access_token = freshToken;
						oAuth2Client.setCredentials(token);

						respToForward.oAuth2Client = oAuth2Client;
						respToForward.token = token;

						resolve(respToForward);
					});
				});
			})
			.then(tokenAndoAuthClient => {
				if (!tokenAndoAuthClient.wasValid) {
					fs.promises
						.writeFile(TOKEN_PATH, JSON.stringify(tokenAndoAuthClient.token))
						.then(() => {
							resolve(tokenAndoAuthClient);
						})
						.catch(error => reject(error));
				} else {
					resolve(tokenAndoAuthClient);
				}
			})
			.catch(error => reject(error));
	});
};

module.exports = validateToken;
