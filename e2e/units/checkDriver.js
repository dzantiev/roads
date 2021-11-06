import { scroller } from "../services";

export default async () => {
	await element(by.id('TabDriversList')).tap();
	await element(by.id('driver0')).tap();

	await scroller('route0', 'scrollView', 'down')
	await element(by.id('route0')).tap();
}
