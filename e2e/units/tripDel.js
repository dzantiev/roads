import { scroller, expectToBeVisible } from "../services";

export default async () => {
	await element(by.id('TabPersonalCabinet')).tap();

	await scroller('addTripBtn', 'scrollView', 'down')
	await element(by.id('addTripBtn')).tap({x: 10, y: -40});
	await element(by.id('toSettings')).tap();

	await element(by.id('scrollView')).scrollTo('bottom');
	await element(by.id('deleteTripBtn')).tap();
	await element(by.id('buttonConfirm')).tap();

	await element(by.id('closeSuccessBtn')).tap();
}
