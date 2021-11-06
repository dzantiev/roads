import { scroller, expectToBeVisible } from "../services";

export default async () => {
	const [year, month, day] = (new Date())
		.toISOString()
		.slice(0, 10)
		.split('-')
	const d = (+day).toString().length === 1
		? '0' + (+day + 2)
		: +day + 2;

	await element(by.id('TabPersonalCabinet')).tap();

	await scroller('addTripBtn', 'scrollView', 'down')
	await element(by.id('addTripBtn')).tap({x: 10, y: -40});
	await element(by.id('toSettings')).tap();

	await element(by.id('dateField')).tap();
	await element(by.id(`native.calendar.SELECT_DATE_SLOT-${year}-${month}-${d}`)).tap();
	await element(by.id('dateSuccessBtn')).tap();
	await element(by.id('meetTimeField')).replaceText('1122');
	await element(by.id('meetPlaceField')).replaceText('какое то место1');
	await scroller('descriptionTitle', 'scrollView', 'down')
	await element(by.id('costField')).replaceText('0');
	await scroller('deleteTripBtn', 'scrollView', 'down')
	await element(by.id('discriptionField')).replaceText('какое то описание тестовой поездки1111111');

	await scroller('successBtn', 'scrollView', 'up')
	await element(by.id('successBtn')).tap();

	await element(by.id('closeSuccessBtn')).tap();
}
