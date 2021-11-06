import { scroller } from "../services";

export default async () => {
	await element(by.id('TabPersonalCabinet')).tap();

	await element(by.id('scrollView')).scrollTo('bottom');

	await element(by.id('addCarBtn')).tap({x: 20, y: -40});

	await element(by.id('companyField')).replaceText('jeeb');
	await element(by.id('modelField')).replaceText('cheroke');
	await element(by.id('yearField')).replaceText('1993');
	await element(by.id('seatsField')).replaceText('5');

	await element(by.id('imageField')).tap();
	await element(by.type('android.widget.ImageView')).atIndex(0).tap();

	await scroller('successBtn', 'scrollView', 'up')
	await element(by.id('successBtn')).tap();

	await element(by.id('closeSuccessBtn')).tap();
}
