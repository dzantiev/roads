import React, {useState, useEffect, useMemo, memo} from 'react';
import {View, TouchableOpacity, ScrollView} from 'react-native';
import {Calendar, LocaleConfig} from 'react-native-calendars';
import AppText from '../../components/AppText/index.js';
import GreenBtn from '../../components/GreenBtn/index.js';

import styles from './styles.js';
import {monthYear} from '../../services';
import {months} from '../../variables.js';

/**
 * get props: isRange: Boolean, cansel: Function, onDateSelect: Function, minDate: String, maxDate: String;
 * if isRange return {"end": "2021-05-27", "start": "2021-05-20"}
 * '2039-12-31' minDate and maxDate format
 * else return "2021-05-20"
 */

const monthList = [
	'Янв.',
	'Фев.',
	'Март',
	'Апр.',
	'Май',
	'Июнь',
	'Июль',
	'Авг.',
	'Сент.',
	'Окт.',
	'Ноя.',
	'Дек.',
]
const daysList = [
	'Воскресенье',
	'Понедельник',
	'Вторник',
	'Среда',
	'Четверг',
	'Пятница',
	'Суббота',
]
const extDaysColor = '#76A829';
const daysColor = '#92c932';
const markColor = {
	color: extDaysColor,
	textColor: 'white'
}
const markSingleDayData = {
	startingDay: true,
	endingDay: true,
	...markColor
};
const markStartDayData = {
	startingDay: true,
	...markColor
};
const markEndDayData = {
	endingDay: true,
	...markColor
};

const dateFormater = date => new Date(date).toISOString().slice(0, 10);

const DateRangePicker = ({
	isRange,
	cansel,
	onDateSelect,
	minDate,
	maxDate,
	value = '',
	cancelTestID,
	successTestID,
}) => {
	const [currentYear, setCurrentYear] = useState(
		monthYear(new Date()).substr(-4, 4),
	);
	// const [currentDate, setCurrentDate] = useState(
	// 	value !== '' ? value : dateFormater(new Date()),
	// );
	const currentDate = useMemo(() => value !== '' ? value : dateFormater(new Date()), [])

	const [daysRange, setDaysRange] = useState({
		start: null,
		end: null,
		days: {},
	});

	const getMaxDate = () => {
		const curYear = new Date().getFullYear();
		const maxDate = new Date(`${curYear + 15}`);
		return maxDate.toISOString().substr(0, 10);
	};

	const [currentDay, setCurrentDay] = useState(() => {
		if (value !== '') {
			return {[value]: markSingleDayData};
		}
		return null;
	});
	const [yearsListIsOpen, setYearsListIsOpen] = useState(false);
	// const [yearsListScroll, setYearsListScroll] = useState(0);

	LocaleConfig.locales['ru'] = {
		monthNames: months,
		monthNamesShort: monthList,
		dayNames: daysList,
		dayNamesShort: ['Вс.', 'Пн.', 'Вт.', 'Ср.', 'Чт.', 'Пт.', 'Сб.'],
		today: "Сегодня'привет",
	};
	LocaleConfig.defaultLocale = 'ru';

	const getDateKeyFromObj = obj => Object.keys(obj)[0];

	const createDaysArray = (start, end) => {
		const startDay = getDateKeyFromObj(start);
		let currentDay = new Date(startDay);
		const array = {};
		const shift = new Date(startDay) < new Date(end) ? 1 : -1;

		while (dateFormater(currentDay) !== end) {
			const today = currentDay.setDate(currentDay.getDate() + shift);
			const formatToday = dateFormater(today);
			if (formatToday === end) return array;
			array[formatToday] = {color: daysColor, textColor: 'white'};
		}
	};

	const createDaysRange = date => {
		if (daysRange.end)
			return setDaysRange({start: null, end: null, days: {}});

		if (daysRange.start) {
			const d = dateFormater(date.dateString);
			const startDay = getDateKeyFromObj(daysRange.start);
			if (new Date(startDay) > new Date(d)) {
				return setDaysRange({
					start: {[d]: markStartDayData},
					end: {[startDay]: markEndDayData},
					days: createDaysArray(daysRange.start, d),
				});
			}
			return setDaysRange({
				...daysRange,
				end: {[d]: markEndDayData},
				days: createDaysArray(daysRange.start, d),
			});
		}
		const d = new Date(date.dateString).toISOString().slice(0, 10);
		setDaysRange({
			...daysRange,
			start: {[d]: markStartDayData},
		});
	};
	const markDay = date => {
		setCurrentDay({
			[date.dateString]: markSingleDayData,
		});
	};

	const daysMarker = date =>
		isRange ? createDaysRange(date) : markDay(date);

	const success = () => {
		if (!daysRange.start && !currentDay) return cansel();
		if (isRange) {
			const start = getDateKeyFromObj(daysRange.start);
			const end =
				daysRange.end === null
					? start
					: getDateKeyFromObj(daysRange.end);

			return onDateSelect({
				start: start,
				end: end,
			});
		}
		return onDateSelect(getDateKeyFromObj(currentDay));
	};

	const datePicker = React.useRef();
	const datePickerYearsList = React.useRef();

	useEffect(() => {
		setCurrentYear(datePicker.current.props.current.substr(0, 4));
	}, []);

	const changeYears = newYear => {
		datePicker.current.addMonth((+currentYear - +newYear) * 12 * -1);
	};

	const renderYears = () => {
		const years = [];
		const curYear = new Date().getFullYear();

		for (let i = +curYear; i > +curYear - 70; i--) years.push(i);

		return years.map((el, i) => {
			if (+currentYear === el) {
				return (
					<View key={i}>
						<TouchableOpacity
							style={styles.yearsListItemActive}
							activeOpacity={0.7}
							onPress={() => {
								changeYears(el);
								setYearsListIsOpen(false);
							}}>
							<AppText style={styles.yearsListItemTextActive}>
								{el}
							</AppText>
						</TouchableOpacity>
					</View>
				);
			} else {
				return (
					<View key={i}>
						<TouchableOpacity
							style={styles.yearsListItem}
							activeOpacity={0.7}
							onPress={() => {
								changeYears(el);
								setYearsListIsOpen(false);
							}}>
							<AppText style={styles.yearsListItemText}>
								{el}
							</AppText>
						</TouchableOpacity>
					</View>
				);
			}
		});
	};

	// useEffect(() =>
	// {
	// 	(yearsListIsOpen && datePickerYearsList.current) && datePickerYearsList.current.scrollTo({y: yearsListScroll});
	// }, [yearsListIsOpen, yearsListScroll]);

	const renderYearDropDown = () => {
		return (
			<View style={styles.yearsListWr}>
				<ScrollView ref={datePickerYearsList}>
					{renderYears()}
				</ScrollView>
			</View>
		);
	};

	const renderHeader = date => {
		return (
			<TouchableOpacity
				onPress={() => setYearsListIsOpen(true)}
				activeOpacity={0.7}>
				<AppText style={styles.headerText}>{monthYear(date)}</AppText>
			</TouchableOpacity>
		);
	};

	return (
		<View style={styles.container}>
			{!isRange && yearsListIsOpen && renderYearDropDown()}
			<Calendar
				ref={datePicker}
				renderHeader={date => renderHeader(date)}
				markingType={'period'}
				markedDates={
					isRange
						? {
								...daysRange.start,
								...daysRange.days,
								...daysRange.end,
						  }
						: currentDay
				}
				firstDay={1}
				current={
					isRange
						? dateFormater(minDate ? minDate : new Date())
						: currentDate
				}
				minDate={minDate ? dateFormater(minDate) : false}
				maxDate={maxDate ? maxDate : getMaxDate()}
				onDayPress={day => daysMarker(day)}
				onMonthChange={month => !isRange && setCurrentYear(month.year)}
				monthFormat={isRange ? 'MMMM yyyy' : 'MMMM'}
				showWeekNumbers={false}
				onPressArrowLeft={subtractMonth => subtractMonth()}
				onPressArrowRight={addMonth => addMonth()}
				disableAllTouchEventsForDisabledDays={true}
				enableSwipeMonths={true}
				theme={{
					arrowColor: extDaysColor,
				}}
			/>
			<View style={styles.nav}>
				<GreenBtn
					testID={cancelTestID}
					text={'Отмена'}
					textStyle={styles.greenBtn}
					onPress={cansel}
				/>
				<GreenBtn
					testID={successTestID}
					text={'Готово'}
					textStyle={styles.greenBtn}
					onPress={success}
				/>
			</View>
		</View>
	);
};

export default memo(DateRangePicker);
