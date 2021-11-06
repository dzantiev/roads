import { expectToBeVisible } from "../services";

export default async () => {
	await element(by.id('toTripsSwitcher')).tap();
	const isClearBtn = await expectToBeVisible('clearBtn')
	if (isClearBtn) {
		await element(by.id('clearBtn')).tap();
	}
	await element(by.id('filter-sort')).tap();
	await element(by.id('select-1')).tap();
	await element(by.id('trip0')).tap();
	await element(by.id('scrollView')).scrollTo('bottom');

	await element(by.id('toBookedBtn')).tap();
	await element(by.id('scrollView')).scrollTo('bottom');
	await element(by.id('toBookedBtn')).tap();
	await element(by.id('closeTestId')).tap();

	// const isNotBooked = await expectToBeVisible('toBookedBtn')
	// if (isNotBooked) {
	// 	await element(by.id('toBookedBtn')).tap();
	// 	await element(by.id('scrollView')).scrollTo('bottom');
	// 	await element(by.id('toBookedBtn')).tap();
	// 	await element(by.id('closeTestId')).tap();
	// } else {
	// 	await element(by.id('toUnBookedBtn')).tap();
	// 	await element(by.id('modalInputText')).replaceText('Какая то причина');
	// 	await element(by.id('modalInputBtn')).tap();
	// 	await element(by.id('closeTestId')).tap();
	// }
}
