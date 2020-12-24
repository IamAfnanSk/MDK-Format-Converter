const fs = require('fs');
const XLSX = require('xlsx');

const JSONToMedicaFormat = require('./helpers/JSONToMedicaFormat');
const pasreToJSON = require('./helpers/pasreToJSON');

const converter = pathtofile => {
	const workbookToFormat = XLSX.readFile(pathtofile);

	const sheetToFormat = workbookToFormat.Sheets[workbookToFormat.SheetNames[0]];

	const invoice = pasreToJSON(sheetToFormat);

	const formattedWorkbook = JSONToMedicaFormat(invoice);

	const date = new Date();

	const dateToAddInFileName = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;

	try {
		XLSX.writeFile(formattedWorkbook, `./public/output/${(Math.random() * 10000 + 1).toFixed(4)}__${invoice.number}__${dateToAddInFileName}.csv`);
	} catch (error) {}

	fs.promises.unlink(pathtofile).catch(error => {});
};

module.exports = converter;
