export default async (phone) => {
	await element(by.id('phoneNumber')).typeText(phone);
	console.log('phone inputed')
	await element(by.id('phoneBtn')).tap();
	console.log('send phone btn pressed')
}
