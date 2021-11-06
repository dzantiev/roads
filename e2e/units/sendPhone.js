export default async (phone) => {
	await element(by.id('phoneNumber')).typeText(phone);
	await element(by.id('phoneBtn')).tap();
}
