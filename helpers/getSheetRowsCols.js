const getSheetRowsCols = sheet => {
	const ref = sheet['!ref'];

	const refSplit = ref.split(':');

	const extractor = (extractFrom, isString) => {
		const res = extractFrom
			.split('')
			.filter(v => (isString ? isNaN(parseInt(v)) : !isNaN(parseInt(v))))
			.join('');

		return isString ? res : parseInt(res);
	};

	const startAlp = extractor(refSplit[0], true);
	const startNum = extractor(refSplit[0], false);

	const endAlp = extractor(refSplit[1], true);
	const endNum = extractor(refSplit[1], false);

	return {
		start: {
			row: startAlp,
			col: startNum,
		},
		end: {
			row: endAlp,
			col: endNum,
		},
	};
};

module.exports = getSheetRowsCols;
