export default async (code) => {
	await element(by.id('codeNumber')).typeText(code);
	console.log('code inputed');
	await element(by.id('MainLogo')).tap();
	console.log('main ligo pressed');
	await element(by.id('codeBtn')).tap();
	console.log('send code btn pressed')
}
