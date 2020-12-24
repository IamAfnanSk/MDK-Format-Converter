const dFormatter = require('./dFormatter');
const getSheetRowsCols = require('./getSheetRowsCols');

const pasreToJSON = sheet => {
	try {
		const number = sheet['C1'].v;
		const date = dFormatter([sheet['D1'].v.toString()]);
		const amount = sheet[`X${getSheetRowsCols(sheet).end.col}`].v;
		const customer = sheet['Q1'].v;
		const customerGSTIN = sheet['R1'].v;
		const vendor = 'M.D.K Pharma';
		const vendorGSTIN = '27AFCPC7477G1ZE';
		const customerCode = 180;

		const products = [];

		for (let i = getSheetRowsCols(sheet).start.col; i <= getSheetRowsCols(sheet).end.col; i++) {
			if (i !== 1 && i !== getSheetRowsCols(sheet).end.col) {
				const code = sheet[`E${i}`].v;
				const name = sheet[`F${i}`].v;
				const pack = sheet[`G${i}`].v;
				const manufacture = sheet[`H${i}`].v;
				const batch = sheet[`I${i}`].v;
				const exp = dFormatter([sheet[`J${i}`].v.toString()]);
				const rate = sheet[`N${i}`].v;
				const MRP = sheet[`Q${i}`].v;
				const qty = sheet[`U${i}`].v;
				const free = sheet[`V${i}`].v;
				const CD = sheet[`W${i}`].v;
				const cGST = sheet[`AA${i}`].v;
				const sGST = sheet[`AB${i}`].v;
				const HSN = sheet[`AE${i}`].v;

				const productData = {
					code,
					name,
					pack,
					manufacture,
					batch,
					exp,
					rate,
					MRP,
					qty,
					free,
					CD,
					cGST,
					sGST,
					HSN,
				};

				products.push(productData);
			}
		}

		return {
			number,
			date,
			amount,
			customer,
			customerGSTIN,
			vendor,
			vendorGSTIN,
			customerCode,
			products,
		};
	} catch (error) {}
};

module.exports = pasreToJSON;
