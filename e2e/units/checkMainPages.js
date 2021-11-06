export default async () => {
	await element(by.id('TabDriversList')).tap();
	await element(by.id('TabMainTrips')).tap();
	// await element(by.id('TabChat')).tap();
	await element(by.id('TabPersonalCabinet')).tap();
}
