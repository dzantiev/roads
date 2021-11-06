import React, {memo, useCallback, useEffect, useState, useRef} from "react";
import {ScrollView, View, TouchableOpacity, Animated} from 'react-native';
import Modal from 'react-native-modal';
import RouteCalendarPicker from '../RouteCalendarPicker';
import AppText from '../AppText';
import AppBoldText from '../AppBoldText';
import styles from "./styles";
import {Calendar} from '../../svg';
import {numericDate, getNextYear} from '../../services/';

const weekDays = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
const monts = ['Янв', 'Фев', 'Мар', 'Апр', 'Мая', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек']
const mockActiveDates = [
	new Date('2021-10-29'),
	new Date('2021-11-02'),
	new Date('2021-11-05'),
	new Date('2021-11-09'),
]
const createMockDatesArray = (startDate) => {
	return (new Array(15))
		.fill('')
		.map((_, i) => {
			const nowDate = new Date(startDate);
			const d = nowDate.setDate(nowDate.getDate() + i);
			const date = (new Date(d)).toISOString().slice(0, 10);

			return new Date(date);
		});
}
const createDatesArray = (datesList) => {
	return datesList.map(el => new Date(el))
}
const mockMinDate = new Date();

const RouteCalendar = ({
	title = 'Даты поездок',
	subtitle = 'выберите дату поездки',
	activeDates = mockActiveDates,
	onDayPress,
	successBtnTestID,
	minDate = mockMinDate,
	onlyActiveDates,
	style
}) => {
	const animValue = () => {
		if (!onlyActiveDates) {
			return 1;
		}

		return activeDates.length ? 1 : 0;
	}
	const fadeAnim = useRef(new Animated.Value(animValue())).current;

	useEffect(() => {
		if (activeDates.length) {
			Animated.timing(fadeAnim, {
				toValue: 1,
				duration: 300,
				useNativeDriver: false,
			}).start();
		}
	}, [activeDates])

	const [isModal, setIsModal] = useState(false);
	const datesList = onlyActiveDates
		? createDatesArray(activeDates)
		: createMockDatesArray(new Date());

	const dateSelect = date => {
		const isMarkedDay = activeDates.find(el => {
			return date === new Date(el)
				.toISOString()
				.slice(0, 10);
		})

		if (onlyActiveDates && isMarkedDay) {
			setIsModal(false)
			onDayPress({
				date,
				isMarked: !!isMarkedDay
			});
		}
		if (!onlyActiveDates) {
			setIsModal(false)
			onDayPress({
				date,
				isMarked: !!isMarkedDay
			});
		}
	};

	const CalendarElement = useCallback(() => {
		return (
			<TouchableOpacity
				activeOpacity={0.7}
				style={styles.item}
				onPress={() => setIsModal(true)}
			>
				<Calendar />
				<AppText style={styles.itemSubtitle}>Календарь</AppText>
			</TouchableOpacity>
		)
	}, [])

	const renderDatePicker = () => {
		return (
			<Modal
				isVisible={isModal}
				animationType={'none'}
				onBackdropPress={() => setIsModal(false)}
				onRequestClose={() => setIsModal(false)}>
				<RouteCalendarPicker
					successTestID={successBtnTestID}
					onDateSelect={dateSelect}
					cansel={() => setIsModal(false)}
					maxDate={numericDate(getNextYear())
						.split('.')
						.reverse()
						.join('-')}
					minDate={minDate}
					markDaysList={activeDates}
				/>
			</Modal>
		);
	};

	const gatDayElement = (d, isActive) => {
		const date = new Date(d);
		const dateStr = date.toISOString().slice(0, 10);
		return (
			<TouchableOpacity
				style={{
					...styles.item,
					...(!onlyActiveDates && isActive && styles.activeItem)
				}}
				activeOpacity={0.7}
				onPress={() => dateSelect(dateStr)}
				key={date.getTime()}
			>
				<AppBoldText
					style={{
						...styles.itemDay,
						...(!onlyActiveDates && isActive && styles.activeText)
					}}
				>
					{ date.getDate() }
				</AppBoldText>
				<AppText
					style={{
						...styles.itemSubtitle,
						...(!onlyActiveDates && isActive && styles.activeText)
					}}
				>
					{`${monts[date.getMonth()]}, ${weekDays[date.getDay()]}`}
				</AppText>
			</TouchableOpacity>
		)
	}

	const DaysList = ({dates}) => {
		return (
			<ScrollView
				style={styles.scrollContainer}
				horizontal={true}
				showsHorizontalScrollIndicator={false}
			>
				{dates.map(d => {
					const isActive = activeDates.find(el => {
						return el.getTime() === d.getTime();
					});
					return gatDayElement(d, !!isActive);
				})}
				<CalendarElement />
			</ScrollView>
		)
	}

	return (
		<Animated.View style={{
			...styles.container,
			...style,
			height: fadeAnim.interpolate({
				inputRange: [0, 1],
				outputRange: [0, 103],
			}),
			marginTop: fadeAnim.interpolate({
				inputRange: [0, 1],
				outputRange: [0, 25],
			}),
		}}>
			<AppBoldText style={styles.title}>{ title }</AppBoldText>
			<AppText style={styles.subtitle}>{ subtitle }</AppText>

			<DaysList
				dates={datesList}
			/>
			{isModal && renderDatePicker()}
		</Animated.View>
	)
};

export default memo(RouteCalendar);
