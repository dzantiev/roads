import { scroller } from "../services";

export default async () => {
	await element(by.id('TabPersonalCabinet')).tap();

	await scroller('addRouteBtn', 'scrollView', 'down')

	await element(by.id('addRouteBtn')).tap({x: 20, y: -40});
	await element(by.id('toSettings')).tap();

	await element(by.id('scrollView')).scrollTo('bottom');
	await element(by.id('deleteRouteBtn')).tap();
	await element(by.id('buttonConfirm')).tap();
	await element(by.id('closeSuccessBtn')).tap();
}
