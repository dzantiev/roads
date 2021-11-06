export default async () => {
	await element(by.id('TabPersonalCabinet')).tap();
	await element(by.id('toSettings')).tap();

	const name = await element(by.id('nameField')).getAttributes();
	const lastname = await element(by.id('lastnameField')).getAttributes();
	const instagram = await element(by.id('instagramField')).getAttributes();
	const aboutme = await element(by.id('aboutmeField')).getAttributes();

	console.log('name', name.text)
	console.log('lastname', lastname.text)
	console.log('instagram', instagram.text)
	console.log('aboutme', aboutme.text)

	await element(by.id('nameField')).replaceText(`${name.text}` + '11111');
	await element(by.id('lastnameField')).replaceText(`${lastname.text}` + '11111');
	await element(by.id('instagramField')).replaceText(`${instagram.text}` + '11111');
	await element(by.id('aboutmeField')).replaceText(`${aboutme.text}` + '11111');

	await element(by.id('aboutTitle')).tap()
	await element(by.id('scrollView')).scrollTo('top')
	await element(by.id('successBtn')).tap()

	await device.reloadReactNative();
	await element(by.id('TabPersonalCabinet')).tap();
	await element(by.id('toSettings')).tap();

	await element(by.id('nameField')).replaceText(name.text);
	await element(by.id('lastnameField')).replaceText(lastname.text);
	await element(by.id('instagramField')).replaceText(instagram.text);
	await element(by.id('aboutmeField')).replaceText(aboutme.text);

	await element(by.id('aboutTitle')).tap()
	await element(by.id('scrollView')).scrollTo('top')
	await element(by.id('successBtn')).tap()
}
