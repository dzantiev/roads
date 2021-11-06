import React, {useState, useEffect, useMemo, memo} from 'react';
import {View, TouchableOpacity, ScrollView} from 'react-native';
import {Calendar, LocaleConfig} from 'react-native-calendars';
import AppText from '../../components/AppText/index.js';

import styles from './styles.js';
import {monthYear} from '../../services';
import {months} from '../../variables.js';

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
const extDaysColor = '#2E394B';
const markSingleDayData = {
	customStyles: {
        container: {
			backgroundColor: extDaysColor,
			borderRadius: 3
        },
        text: {
			color: 'white',
        }
	}
};
const dateFormater = date => new Date(date).toISOString().slice(0, 10);

const RouteCalendarPicker = ({
	onDateSelect,
	minDate,
	maxDate,
	value = '',
	markDaysList
}) => {
	const [currentYear, setCurrentYear] = useState(
		monthYear(new Date()).substr(-4, 4),
	);
	const markeredDays = useMemo(() => {
		return markDaysList.reduce((acc, el) => {
			const d = (new Date(el)).toISOString().slice(0, 10);
			return {
				...acc,
				[d]: markSingleDayData
			}
		}, {})
	}, [])
	const currentDate = useMemo(() => value !== '' ? value : dateFormater(new Date()), []);

	const getMaxDate = () => {
		const curYear = new Date().getFullYear();
		const maxDate = new Date(`${curYear + 15}`);
		return maxDate.toISOString().substr(0, 10);
	};

	const [currentMarkeredDays, setCurrentMarkeredDays] = useState({});
	const [yearsListIsOpen, setYearsListIsOpen] = useState(false);

	useEffect(() => {
		setCurrentMarkeredDays(markeredDays)
	}, [markeredDays])

	LocaleConfig.locales['ru'] = {
		monthNames: months,
		monthNamesShort: monthList,
		dayNames: daysList,
		dayNamesShort: ['Вс.', 'Пн.', 'Вт.', 'Ср.', 'Чт.', 'Пт.', 'Сб.'],
		today: "Сегодня'привет",
	};
	LocaleConfig.defaultLocale = 'ru';

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
			{yearsListIsOpen && renderYearDropDown()}
			<Calendar
				ref={datePicker}
				// marking={1}
				renderHeader={date => renderHeader(date)}
				markingType={'custom'}
				markedDates={currentMarkeredDays}
				firstDay={1}
				current={currentDate}
				minDate={minDate ? dateFormater(minDate) : false}
				maxDate={maxDate ? maxDate : getMaxDate()}
				monthFormat={'MMMM'}
				showWeekNumbers={false}
				enableSwipeMonths={true}
				theme={{
					arrowColor: extDaysColor,
					todayTextColor: '#76A829',
				}}
				disableAllTouchEventsForDisabledDays={true}
				onMonthChange={month => setCurrentYear(month.year)}
				onDayPress={date => onDateSelect(date.dateString)}
				onPressArrowLeft={subtractMonth => subtractMonth()}
				onPressArrowRight={addMonth => addMonth()}
			/>
		</View>
	);
};

export default memo(RouteCalendarPicker);
