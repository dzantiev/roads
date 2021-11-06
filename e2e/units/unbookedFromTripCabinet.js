export default async () => {
	await element(by.id('TabPersonalCabinet')).tap();

	await element(by.id('tripCard0')).tap();
	await element(by.id('scrollView')).scrollTo('bottom');

	await element(by.id('toUnBookedBtn')).tap();
	await element(by.id('modalInputText')).replaceText('Какая то причина');
	await element(by.id('modalInputBtn')).tap();
	await element(by.id('closeTestId')).tap();
}
