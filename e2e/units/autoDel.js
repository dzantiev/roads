export default async () => {
	await element(by.id('TabPersonalCabinet')).tap();

	await element(by.id('scrollView')).scrollTo('bottom');

	await element(by.id('addCarBtn')).tap({x: 20, y: -40});

	// await element(by.label('carPreview')).atIndex(4).tap();

	await element(by.id('autoDelBtn')).tap();

	await element(by.id('buttonConfirm')).tap();

	await element(by.id('closeSuccessBtn')).tap();
}
