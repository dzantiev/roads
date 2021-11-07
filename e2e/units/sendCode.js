export default async (code) => {
	await element(by.id('codeNumber')).typeText(code);
	console.log('code inputed')
	// await element(by.id('MainLogo')).tap();
	// await element(by.id('codeBtn')).tap();
}
