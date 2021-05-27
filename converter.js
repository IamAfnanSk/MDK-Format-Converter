const fs = require("fs");
const XLSX = require("xlsx");

const JSONToMedicaFormat = require("./helpers/JSONToMedicaFormat");
const pasreToJSON = require("./helpers/pasreToJSON");

const converter = (pathtofile, originalFileName = "unNamedFile") => {
  const workbookToFormat = XLSX.readFile(pathtofile);

  const sheetToFormat = workbookToFormat.Sheets[workbookToFormat.SheetNames[0]];

  const date = new Date();

  const dateToAddInFileName = `${date.getUTCDate()}-${
    date.getUTCMonth() + 1
  }-${date.getUTCFullYear()}__${date.getUTCHours()}-${date.getUTCMinutes()}-${date.getUTCSeconds()}`;

  const randomFileName = (Math.random() * 10000 + 1).toFixed(4);

  if (sheetToFormat["A1"].v === "H") {
    const invoice = pasreToJSON(sheetToFormat);

    const formattedWorkbook = JSONToMedicaFormat(invoice);

    XLSX.writeFile(
      formattedWorkbook,
      `./public/output/valid__${dateToAddInFileName}__${randomFileName}__${invoice.number}.csv`
    );

    fs.promises.unlink(pathtofile).catch((error) => {});
  }
};

module.exports = converter;
