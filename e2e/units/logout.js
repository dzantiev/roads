export default async () => {
	await element(by.id('TabPersonalCabinet')).tap();
	await element(by.id('toSettings')).tap();
	await element(by.id('scrollView')).scrollTo('bottom');
	await element(by.id('logout')).tap();
}
