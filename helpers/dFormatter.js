const dFormatter = (datesToFormat = []) => {
	let formattedDates = [];

	datesToFormat.forEach(dateToFormat => {
		const year = dateToFormat.slice(dateToFormat.length - 4, dateToFormat.length);
		const month = dateToFormat.slice(dateToFormat.length - 6, dateToFormat.length - 4);
		const day = dateToFormat.slice(0, dateToFormat.length - 6);

		const formattedDate = `${day}-${month}-${year}`;

		formattedDates.push(formattedDate);
	});

	return formattedDates.length === 1 ? formattedDates[0] : formattedDates;
};

module.exports = dFormatter;
