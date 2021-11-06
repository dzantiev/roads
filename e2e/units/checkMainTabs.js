export default async () => {
	await element(by.id('toTripsSwitcher')).tap();
	await element(by.id('toRoutesSwitcher')).tap();
}
