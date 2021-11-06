export default async () => {
	await element(by.id('TabPersonalCabinet')).tap();
	await element(by.id('roleSwitherBtn')).tap();
	await element(by.id('roleSwitherBtn')).tap();
}
