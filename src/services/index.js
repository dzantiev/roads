import {Dimensions, Linking, Share} from 'react-native';
import 'intl';
import 'intl/locale-data/jsonp/ru';
import {errorResponse, months} from '../variables';

export const randomNumber = (min, max) => {
	const r = Math.random() * (max - min) + min;
	return Math.floor(r);
};

export const randomImgFromName = name => {
	return name[0].codePointAt() % 4;
};

export const declOfNum = (n, titles) => {
	return titles[
		n % 10 === 1 && n % 100 !== 11
			? 0
			: n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20)
				? 1
				: 2
	];
};

export const getMonthStr = num => {
	return months[num];
};

export const longDate = date => {
	return new Intl.DateTimeFormat('ru-RU', {
		day: '2-digit',
		month: 'long',
		year: 'numeric',
	})
		.format(date)
		.slice(0, -3);
};

export const numericDate = date => {
	return new Intl.DateTimeFormat('ru-RU', {
		day: '2-digit',
		month: '2-digit',
		year: 'numeric',
	}).format(date);
};

export const monthYear = date => {
	const d = new Intl.DateTimeFormat('ru-RU', {
		month: 'long',
		year: 'numeric',
	})
		.format(date)
		.slice(0, -3);
	return d.charAt(0).toUpperCase() + d.slice(1);
};

export const twoDigitTime = date =>
{
	let time = new Intl.DateTimeFormat('ru-RU', {
		hour: '2-digit',
		minute: '2-digit',
	}).format(date);
	if (time.split(':')[0].length === 1) {
		time = '0' + time;
	}
	return time;
};

export const dateFormatter = date => {
	return new Intl.DateTimeFormat('ru-RU', {
		day: '2-digit',
		month: '2-digit',
	}).format(new Date(date));
};

export const FullDateFormatter = date => {
	return new Intl.DateTimeFormat('ru-RU', {
		day: '2-digit',
		month: '2-digit',
		year: 'numeric',
	}).format(new Date(date));
};

export const dateTimeString = date =>
{
	const formatDate = new Intl.DateTimeFormat('ru-RU', {
		day: '2-digit',
		month: '2-digit',
		year: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
	}).format(new Date(date));
	return formatDate;
};

export const convertDuration = duration => {
	const time = new Date(duration);
	const daysShift = time.getUTCDate() - 1;
	const hoursShift = time.getUTCHours();
	const minutesShift = time.getUTCMinutes();

	let rez = daysShift ? `${daysShift} д. ` : '';
	rez += hoursShift ? `${hoursShift} ч. ` : '';
	rez += minutesShift ? `${minutesShift} мин. ` : '';
	return rez;
};

export const convertDurationLongWords = duration => {
	const time = new Date(duration);
	const daysShift = time.getUTCDate() - 1;
	const hoursShift = time.getUTCHours();
	const minutesShift = time.getUTCMinutes();

	const days = ['день', 'дня', 'дней'];
	const hources = ['час', 'часа', 'часов'];

	let rez = daysShift ? `${daysShift} ${declOfNum(daysShift, days)}` : '';
	hoursShift && (rez += ` ${hoursShift} ${declOfNum(hoursShift, hources)}`);
	minutesShift && (rez += ` ${minutesShift} мин. `);
	return rez;
};

export const getDaysFromDuration = duration => {
	const date = new Date(+duration);
	return date.getUTCDate() - 1;
};

export const getHourseFromDuration = duration => {
	const date = new Date(+duration);
	return date.getUTCHours();
};

export const localNumeric = num => {
	return new Intl.NumberFormat('ru-RU', {
		style: 'currency',
		minimumFractionDigits: 0,
		currency: 'RUB',
	}).format(num);
};

// dd/mm/yyyy to DateObj
export const stringToDate = string => {
	let [day, month, year] = string.split('.');
	return new Date(`${year}-${month}-${day}`);
};

export const GetScreenOrientation = () => {
	if (Dimensions.get('window').width > Dimensions.get('window').height)
		return false;
	else return true;
};

export const createImgFormData = (table, field, imgs) => {
	const formData = new FormData();
	formData.append('tableCode', table);
	formData.append('fieldCode', field);
	formData.append('typeUpload', 'file');
	imgs.forEach(img =>
		formData.append(`${field}[]`, {
			uri: img.uri,
			type: 'image/jpeg',
			name: img.name,
		}),
	);
	return formData;
};

export const getNextYear = () => {
	let date = new Date();
	date.setYear(date.getFullYear() + 1);

	return date;
};

export const callToNumber = phone => {
	const phoneNumber = onPhoneInput(phone, 10);
	Linking.openURL(`tel:${phoneNumber}`);
};

export const openUrl = url => Linking.openURL(url)

export const onShare = async message => {
	try
	{
		await Share.share({message});
	}
	catch (error)
	{
		console.log('onShare', error);
	}
};

export const checkTimeValue = v => {
	let val = v;
	+v[0] > 2 && +v[0] && (val = `0${val}:`);
	v.length === 2 && (val = `${val}:`);
	if(v.length === 4 && +v.substr(3,1) > 5)
		val = `${val.slice(0, 2)}:0${v[3]}`;

	return val;
};

export const defaultFieldValue = value => ({
	value,
	status: false,
	text: '',
})

const abortTime = 15 // сек

export const aborter = (funcName) => {
	const controller = new AbortController();
	const signal = controller.signal;
	const timeout = setTimeout(() => {
		console.warn(`Aborting ${funcName} function.`);
		controller.abort();
	}, abortTime * 1000);
	return {signal, timeout};
}

// phoneInput
import {onPhoneInput, onRemove, findSymbol, checkLength} from './phoneInput';
// trips
import {smallTripFormatter} from './trips';
// routes
import {smallRouteFormatter, planingRouteToTripFormatter} from './routes';
// validator
import {saveFieldValue, validator} from './validator';
import {imgDecrement, imgIncrement} from './images';

export {
	onPhoneInput,
	onRemove,
	findSymbol,
	checkLength,
	smallTripFormatter,
	smallRouteFormatter,
	planingRouteToTripFormatter,
	saveFieldValue,
	imgDecrement,
	imgIncrement,
	validator,
};
