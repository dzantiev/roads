export default async () => {
	await element(by.id('TabPersonalCabinet')).tap();

	await element(by.id('scrollView')).scrollTo('bottom');
	await element(by.id('addCarBtn')).tap();

	await element(by.id('numerField')).replaceText('с725ом15');
	await element(by.id('companyField')).replaceText('jeep');
	await element(by.id('modelField')).replaceText('cherokee');
	await element(by.id('yearField')).replaceText('1992');
	await element(by.id('seatsField')).replaceText('4');

	await element(by.id('imageField')).tap();
	// console.log('image selected')
	// await element(by.type('android.widget.ImageView')).atIndex(0).tap();

	await element(by.id('addAutoBtn')).tap();

	await element(by.id('closeSuccessBtn')).tap();
}
