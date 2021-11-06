import sendPhone from './sendPhone';
import sendCode from './sendCode';

export default async ({phone, code}) => {
	await sendPhone(phone)
	await sendCode(code)
};
