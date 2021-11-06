// import detox from "detox";
// import config from "../.detoxrc.json";
import units from "./units";

describe('Example', () => {
	beforeAll(async () => {
		// await detox.init(config)
		console.log('device.name', device.name)
		console.log('launch app...')
		await device.launchApp();
	});

	beforeEach(async () => {
		await device.reloadReactNative();
	})

	// ========== driver work ==========
	it('login (phone, code)', async () => {
		await units.login({phone: '6666666666', code: '6666'})
	});

	it('check main tabs', async () => {
		await units.checkMainTabs()
	});

	it('check main pages', async () => {
		await units.checkMainPages()
	});

	it('check driver', async () => {
		await units.checkDriver()
	});

	it('check filter trips', async () => {
		await units.filterTrips()
	});

	it('check route', async () => {
		await units.checkRoute()
	});

	it('check role switcher', async () => {
		await units.checkRoleSwitcher()
	});

	it('change user data', async () => {
		await units.changeUserData()
	});

	it('add auto', async () => {
		await units.autoAdd()
	});
	it('edit auto', async () => {
		await units.autoEdit()
	});
	it('del auto', async () => {
		await units.autoDel();
	});


	it('add route', async () => {
		await units.routeAdd()
	});
	it('edit route', async () => {
		await units.routeEdit()
	});
	it('add trip', async () => {
		await units.tripAdd()
	});
	it('edit trip', async () => {
		await units.tripEdit()
	});

	it('logout', async () => {
		await units.logout()
	});
	// ========== driver work ==========

	// ========== user work ==========
	it('login (phone, code)', async () => {
		await units.login({phone: '1111111111', code: '6666'})
	});
	it('booked to planing trip 1', async () => {
		await units.bookedOnTrip()
	});
	it('unbooked from planing trip', async () => {
		await units.unbookedFromTrip()
	});
	it('booked to planing trip 2', async () => {
		await units.bookedOnTrip()
	});
	it('unbooked from planing trip from cabinet', async () => {
		await units.unbookedFromTripCabinet()
	});

	it('logout', async () => {
		await units.logout()
	});
	// ========== user work ==========


	// ========== driver work ==========
	it('login (phone, code)', async () => {
		await units.login({phone: '6666666666', code: '6666'})
	});
	it('del trip', async () => {
		await units.tripDel()
	});
	it('del route', async () => {
		await units.routeDel()
	});

	it('logout', async () => {
		await units.logout()
	});
	// ========== driver work ==========
});
