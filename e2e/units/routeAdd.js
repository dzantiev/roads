import { scroller } from "../services";

export default async () => {
	await element(by.id('TabPersonalCabinet')).tap();

	await scroller('addRouteBtn', 'scrollView', 'down')

	await element(by.id('addRouteBtn')).tap();

	await element(by.id('titleField')).replaceText('Тестовый маршрут');
	await element(by.id('categoryField')).tap();
	await element(by.id('select-2')).tap();

	await element(by.id('imageField')).tap();
	await element(by.type('android.widget.ImageView')).atIndex(0).tap();

	await element(by.id('addPointTestID')).tap();
	await element(by.id('pointFialdTestID0')).replaceText('Первая точка');
	await element(by.id('pontsTitle')).tap();
	await element(by.id('addPointTestID')).tap();
	await element(by.id('pointFialdTestID1')).replaceText('Вторая точка');
	await element(by.id('pontsTitle')).tap();
	await element(by.id('addPointTestID')).tap();
	await element(by.id('pointFialdTestID2')).replaceText('Третья точка');
	await element(by.id('pontsTitle')).tap();

	await scroller('priceTitle', 'scrollView', 'down')

	await element(by.id('daysField')).replaceText('1');
	await element(by.id('hourcesField')).replaceText('11');

	await scroller('descriptionTitle', 'scrollView', 'down')

	await element(by.id('priceField')).replaceText('3999');

	await scroller('createRouteBtn', 'scrollView', 'down')

	await element(by.id('descriptionField')).replaceText('какое то большое описание на более чем 20 символов');

	await element(by.id('createRouteBtn')).tap();

	await element(by.id('closeSuccessBtn')).tap();
}
