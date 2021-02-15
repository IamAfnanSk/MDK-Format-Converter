const XLSX = require('xlsx');
const medicaFormat = require('../utils/medicaFormat');

const JSONToMedicaFormat = invoice => {
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

			switch (columnHeader) {
				case 'vendor':
					cellData = invoice.vendor;
					break;

				case 'cucode':
					cellData = invoice.customerCode;
					break;

				case 'customer':
					cellData = invoice.customer;
					break;

				case 'area':
					cellData = 'MUMBRA';
					break;

				case 'city':
					cellData = 'THANE';
					break;

				case 'pincode':
					cellData = 400612;
					break;

				case 'invno':
					cellData = invoice.number;
					break;

				case 'invdate':
					cellData = invoice.date;
					break;

				case 'invamt':
					cellData = invoice.amount;
					break;

				case 'manufacturer':
					cellData = product.manufacture;
					break;

				case 'prcode':
					cellData = product.code;
					break;

				case 'productdesc':
					cellData = product.name;
					break;

				case 'ppack':
					cellData = product.pack;
					break;

				case 'batchno':
					cellData = product.batch;
					break;

				case 'expdate':
					cellData = product.exp;
					break;

				case 'qty':
					cellData = product.qty;
					break;

				case 'free':
					cellData = product.free;
					break;

				case 'rate':
					cellData = product.rate;
					break;

				case 'grsamt':
					cellData = productGrsAmt;
					break;

				case 'ptr':
					cellData = product.rate;
					break;

				case 'mrp':
					cellData = product.MRP;
					break;

				case 'cdper':
					cellData = product.CD;
					break;

				case 'cstper':
					cellData = product.cGST;
					break;

				case 'vatper':
					cellData = product.cGST;
					break;

				case 'inetamt':
					cellData = productNetAmt;
					break;

				case 'vgstin':
					cellData = invoice.vendorGSTIN;
					break;

				case 'cgstin':
					cellData = invoice.customerGSTIN;
					break;

				case 'hsncode':
					cellData = product.HSN;
					break;

				case 'cgstper':
					cellData = product.cGST;
					break;

				case 'cgstamt':
					cellData = productcGSTAmt;
					break;

				case 'sgstper':
					cellData = product.cGST;
					break;

				case 'sgstamt':
					cellData = productsGSTAmt;
					break;

				case 'pitemname':
					cellData = product.name;
					break;
			}

			rowData.push(cellData);
		}

		dataToWrite.push(rowData);
	}

	const sheet = XLSX.utils.aoa_to_sheet(dataToWrite);

	XLSX.utils.book_append_sheet(workbook, sheet, invoice.number);

	return workbook;
};

module.exports = JSONToMedicaFormat;
