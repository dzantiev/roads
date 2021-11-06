export const onPhoneInput = function (value, key, selectionStart) {
	// if (value === '+7' && value.length === 2) return '';
	// if (value === '+' && value.length === 1) return '';
	// if (value.length === 0) return '';

	let input = value,
		inputNumbersValue = getInputNumbersValue(input),
		formattedInputValue = '';

	if (!inputNumbersValue) return '';

	if (
		input.length - 1 !== selectionStart ||
		(selectionStart === 1 && input.length - 2 === 0)
	) {
		const workKeys = ['Backspace']
		if (workKeys.includes(key)) {
			return input
		}
		if (key && /\D/g.test(key)) {
			return inputNumbersValue;
		}
	}

	if (['7', '8', '9'].indexOf(inputNumbersValue[0]) > -1) {
		if (inputNumbersValue[0] === '9')
			inputNumbersValue = '7' + inputNumbersValue;

		// let firstSymbols = inputNumbersValue[0] === '8' ? '8' : '+7';
		let firstSymbols = (inputNumbersValue[0] === '8') ? '+7' : '+7';

		formattedInputValue = input = firstSymbols + ' ';

		if (inputNumbersValue.length > 0)
			formattedInputValue += '(' + inputNumbersValue.substring(1, 4);

		if (inputNumbersValue.length >= 4)
			formattedInputValue += ') ' + inputNumbersValue.substring(4, 7);

		if (inputNumbersValue.length >= 7)
			formattedInputValue += '-' + inputNumbersValue.substring(7, 9);

		if (inputNumbersValue.length >= 9)
			formattedInputValue += '-' + inputNumbersValue.substring(9, 11);
	} else formattedInputValue = '+' + inputNumbersValue;

	return formattedInputValue;
};

// функция очищаяет строку от сего кроме чисел
const getInputNumbersValue = input => input.replace(/\D/g, '');

// функция проверяет и возращает максимальную длину поля ввода
export const checkLength = function (input) {
	if (input.indexOf('+7') !== -1) return 18;
	else return 17;
};
