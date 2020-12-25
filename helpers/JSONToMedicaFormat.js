const XLSX = require('xlsx');
const medicaFormat = require('../utils/medicaFormat');

const JSONToMedicaFormat = invoice => {
	try {
		const workbook = XLSX.utils.book_new();

		const dataToWrite = [medicaFormat];

		for (let index = 0; index < invoice.products.length; index++) {
			const rowData = [];

			for (let i = 0; i < medicaFormat.length; i++) {
				const columnHeader = medicaFormat[i].toLowerCase();
				const product = invoice.products[index];
				const productAmtxQty = product.rate * product.qty;
				const productGrsAmt = productAmtxQty - productAmtxQty * (product.CD / 100);
				const productcGSTAmt = (product.cGST / 100) * product.rate;
				const productsGSTAmt = (product.cGST / 100) * product.rate;
				const productNetAmt = productGrsAmt + productcGSTAmt + productsGSTAmt;

				let cellData;

				if (columnHeader === 'vendor') {
					cellData = invoice.vendor;
				} else if (columnHeader === 'cucode') {
					cellData = invoice.customerCode;
				} else if (columnHeader === 'customer') {
					cellData = invoice.customer;
				} else if (columnHeader === 'area') {
					cellData = 'MUMBRA';
				} else if (columnHeader === 'city') {
					cellData = 'THANE';
				} else if (columnHeader === 'pincode') {
					cellData = 400612;
				} else if (columnHeader === 'invno') {
					cellData = invoice.number;
				} else if (columnHeader === 'invdate') {
					cellData = invoice.date;
				} else if (columnHeader === 'invamt') {
					cellData = invoice.amount;
				} else if (columnHeader === 'manufacturer') {
					cellData = product.manufacture;
				} else if (columnHeader === 'prcode') {
					cellData = product.code;
				} else if (columnHeader === 'productdesc') {
					cellData = product.name;
				} else if (columnHeader === 'ppack') {
					cellData = product.pack;
				} else if (columnHeader === 'batchno') {
					cellData = product.batch;
				} else if (columnHeader === 'expdate') {
					cellData = product.exp;
				} else if (columnHeader === 'qty') {
					cellData = product.qty;
				} else if (columnHeader === 'free') {
					cellData = product.free;
				} else if (columnHeader === 'rate') {
					cellData = product.rate;
				} else if (columnHeader === 'grsamt') {
					cellData = productGrsAmt;
				} else if (columnHeader === 'ptr') {
					cellData = product.rate;
				} else if (columnHeader === 'mrp') {
					cellData = product.MRP;
				} else if (columnHeader === 'cdper') {
					cellData = product.CD;
				} else if (columnHeader === 'cstper') {
					cellData = product.cGST;
				} else if (columnHeader === 'vatper') {
					cellData = product.cGST;
				} else if (columnHeader === 'inetamt') {
					cellData = productNetAmt;
				} else if (columnHeader === 'vgstin') {
					cellData = invoice.vendorGSTIN;
				} else if (columnHeader === 'cgstin') {
					cellData = invoice.customerGSTIN;
				} else if (columnHeader === 'hsncode') {
					cellData = product.HSN;
				} else if (columnHeader === 'cgstper') {
					cellData = product.cGST;
				} else if (columnHeader === 'cgstamt') {
					cellData = productcGSTAmt;
				} else if (columnHeader === 'sgstper') {
					cellData = product.cGST;
				} else if (columnHeader === 'sgstamt') {
					cellData = productsGSTAmt;
				} else if (columnHeader === 'pitemname') {
					cellData = product.name;
				}

				rowData.push(cellData);
			}

			dataToWrite.push(rowData);
		}

		const sheet = XLSX.utils.aoa_to_sheet(dataToWrite);

		XLSX.utils.book_append_sheet(workbook, sheet, invoice.number);

		return workbook;
	} catch (error) {}
};

module.exports = JSONToMedicaFormat;
