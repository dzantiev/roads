import { scroller } from "../services";

export default async () => {
	await element(by.id('TabPersonalCabinet')).tap();

	await scroller('addRouteBtn', 'scrollView', 'down')

	await element(by.id('addRouteBtn')).tap({x: 20, y: -40});
	await element(by.id('toSettings')).tap();

	await element(by.id('titleField')).replaceText('Тестовый маршрут1');
	await element(by.id('categoryField')).tap();
	await element(by.id('select-1')).tap();

	await element(by.id('imageField')).tap();
	await element(by.type('android.widget.ImageView')).atIndex(0).tap();

	await element(by.id('pointFialdTestID0')).replaceText('Первая точка1');
	await element(by.id('pointFialdTestID1')).replaceText('Вторая точка1');
	await element(by.id('pointFialdTestID2')).replaceText('Третья точка1');

	await scroller('priceTitle', 'scrollView', 'down')

	await element(by.id('daysField')).replaceText('2');
	await element(by.id('hourcesField')).replaceText('22');

	await scroller('descriptionTitle', 'scrollView', 'down')
	await element(by.id('priceField')).replaceText('2999');

	await scroller('deleteRouteBtn', 'scrollView', 'down')
	await element(by.id('descriptionField')).replaceText('какое то большое описание на более чем 20 символов111111');

	// await element(by.id('scrollView')).scrollTo('top');
	await scroller('successBtn', 'scrollView', 'up')
	await element(by.id('successBtn')).tap();
	await element(by.id('closeSuccessBtn')).tap();
}
