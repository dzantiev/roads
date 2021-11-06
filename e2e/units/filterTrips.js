import {scroller} from '../services'

export default async () => {
	await element(by.id('toTripsSwitcher')).tap();

	await scroller('filter-category', 'scrollView', 'right')
	await element(by.id('filter-category')).tap();
	await element(by.id('select-0')).tap();

	await scroller('filter-seats', 'scrollView', 'right')
	await element(by.id('filter-seats')).tap();
	await element(by.id('select-0')).tap();

	const [year, month, day] = (new Date())
		.toISOString()
		.slice(0, 10)
		.split('-');

	const d = (+day).toString().length === 1
		? '0' + (+day + 1)
		: +day + 1;

	console.log('year, month, day', year, month, day)
	console.log(`native.calendar.SELECT_DATE_SLOT-${year}-${month}-${d}`)

	await scroller('filter-date', 'scrollView', 'right')
	await element(by.id('filter-date')).tap();
	await element(by.id(`native.calendar.SELECT_DATE_SLOT-${year}-${month}-${d}`)).tap();

	await element(by.id('successDatePicker')).tap();
	// await element(by.id('clearBtn')).tap();

	await scroller('filter-sort', 'scrollView', 'right')
	await element(by.id('filter-sort')).tap();
	await element(by.id('select-0')).tap();

	await scroller('clearBtn', 'scrollView', 'left')
	await element(by.id('clearBtn')).tap();
}
