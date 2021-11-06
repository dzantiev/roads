import { scroller } from "../services";

export default async () => {
	await element(by.id('route0')).tap();

	await element(by.id('toDriverScreen')).tap();
	await element(by.id('goBack')).tap();

	await element(by.id('slide0')).tap();
	await expect(element(by.id('closeSliderModal'))).toBeVisible();
	await element(by.id('closeSliderModal')).tap({x: 5, y: 5});

	await scroller('carInfoLine0', 'scrollView', 'down')
	await element(by.id('carInfoLine0')).tap();
	await element(by.id('closeSliderModal')).tap({x: 5, y: 5});
}
