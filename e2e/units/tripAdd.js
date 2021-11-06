import { scroller, expectToBeVisible } from "../services";

export default async () => {
	const [year, month, day] = (new Date())
		.toISOString()
		.slice(0, 10)
		.split('-')

	const d = (+day).toString().length === 1
		? '0' + (+day + 1)
		: +day + 1;

	await element(by.id('TabPersonalCabinet')).tap();

	await scroller('addTripBtn', 'scrollView', 'down')
	await element(by.id('addTripBtn')).tap();

	await element(by.id('routeField')).tap();
	await element(by.id('select-0')).tap();
	await element(by.id('dateField')).tap();
	await element(by.id(`native.calendar.SELECT_DATE_SLOT-${year}-${month}-${d}`)).tap();
	await element(by.id('dateSuccessBtn')).tap();
	await element(by.id('meetTimeField')).replaceText('1111');
	await element(by.id('meetPlaceField')).replaceText('какое то место');
	if (await expectToBeVisible('carField')) {
		await element(by.id('carField')).tap();
		await element(by.id('select-0')).tap();
		await element(by.id('emptySeatsField')).replaceText('6');
	}
	await scroller('descriptionTitle', 'scrollView', 'down')
	await element(by.id('costField')).replaceText('999');
	await scroller('createTripBtn', 'scrollView', 'down')
	await element(by.id('discriptionField')).replaceText('какое то описание тестовой поездки');

	await element(by.id('descriptionTitle')).tap();
	await element(by.id('createTripBtn')).tap();

	await element(by.id('closeSuccessBtn')).tap();
}
