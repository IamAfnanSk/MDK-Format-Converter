const fs = require('fs');
const path = require('path');

const express = require('express');
const router = express.Router();

const { google } = require('googleapis');

const converter = require('../converter');
const validateToken = require('../helpers/validateToken');

router.post('/newgmail', (netReq, netRes) => {
	const resData = JSON.parse(new Buffer.from(netReq.body.message.data, 'base64').toString());
	const emailAddress = resData.emailAddress;

	const gmail = google.gmail({ version: 'v1' });
	let mailId;

	if (emailAddress === 'mdkpharma@gmail.com') {
		validateToken()
			.then(tokenAndoAuthClient => {
				gmail.context._options.auth = tokenAndoAuthClient.oAuth2Client;

				return gmail.users.messages.list({
					userId: 'me',
				});
			})
			.then(mailList => {
				mailId = mailList.data.messages[0].id;

				return gmail.users.messages.get({
					userId: 'me',
					id: mailId,
				});
			})
			.then(mail => {
				const attachmentParts = mail.data.payload.parts.filter(part => part.mimeType === 'application/vnd.ms-excel' || part.filename.toLowerCase().split('.')[1] == 'csv');

				const attachmentsPromises = [];

				if (attachmentParts.length !== 0) {
					attachmentParts.forEach(part => {
						const attachmentId = part.body.attachmentId;

						attachmentsPromises.push(
							gmail.users.messages.attachments.get({
								userId: 'me',
								id: attachmentId,
								messageId: mailId,
							})
						);
					});

					return Promise.all(attachmentsPromises);
				} else {
					// end task
					throw new Error('No need to go further');
				}
			})
			.then(attachments => {
				attachments.forEach(attachment => {
					const pathToStore = path.join(__dirname, `../temp/${Math.random() * 100 + 1}.csv`);
					fs.promises.writeFile(pathToStore, attachment.data.data, 'base64').then(() => converter(pathToStore));
				});
			})
			.catch(error => {
				console.log(error);
			});
	}

	netRes.status(200).json({
		acknowledged: true,
	});
});

router.get('/refreshtoken', (netReq, netRes) => {
	validateToken()
		.then(tokenAndoAuthClient =>
			netRes.status(200).json({
				wasValid: tokenAndoAuthClient.wasValid,
				message: 'Token validated',
				error: null,
			})
		)
		.catch(error =>
			netRes.status(200).json({
				message: 'Something is wrong with token, make a new please.',
				error: 'token-error',
			})
		);
});

router.get('/rewatch', (netReq, netRes) => {
	validateToken()
		.then(tokenAndoAuthClient => {
			const gmail = google.gmail({ version: 'v1', auth: tokenAndoAuthClient.oAuth2Client });

			return gmail.users.watch({
				userId: 'me',
				requestBody: {
					topicName: 'projects/mdk-format-conve-1608722372351/topics/gmail',
				},
			});
		})
		.then(watchResponse => {
			watchResponse.data.message = 'Topic rewatch success';
			watchResponse.data.error = null;
			netRes.status(200).json(watchResponse.data);
		})
		.catch(error =>
			netRes.status(200).json({
				message: 'Something is wrong with token, make a new please.',
				error: 'token-error',
			})
		);
});

module.exports = router;
