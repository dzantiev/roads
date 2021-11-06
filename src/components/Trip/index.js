import React, {memo} from 'react';
import {View, TouchableOpacity, Image} from 'react-native';
import styles from './styles';
import AppText from '../AppText';
import AppBoldText from '../AppBoldText';
import {UsersSvg} from '../../svg';
import {
	declOfNum,
	getMonthStr,
	twoDigitTime,
	localNumeric,
} from '../../services';

const Trip = ({
	date,
	emptySeats,
	price,
	duration,
	tripImage,
	onPress,
	style,
	old,
	title,
	seats,
	category,
	categories,
	driver,
	driverFace,
	description,
	testID,
}) => {
	const d = new Date(date);
	const day = d.getDate().toString();
	const month = getMonthStr(d.getMonth());
	const timeStart = twoDigitTime(d);
	const endDate = new Date(d.getTime() + +duration);
	const isNewDay = day !== endDate.getDate();
	const timeEnd = isNewDay
		? twoDigitTime(endDate) + ' ' + endDate.toLocaleString().slice(0, 5)
		: twoDigitTime(endDate);

	const seatTitles = ['место', 'места', 'мест'];

	const Calendar = ({day, month, time}) => {
		return (
			<View
				style={{
					...styles.calendarWrapper,
					...(old && styles.calendarWrapperOld),
				}}>
				<AppText style={styles.calendar}>
					{day.length === 1 ? `0${day}` : day} {month.slice(0, 3)}{' '}
					{time}
				</AppText>
			</View>
		);
	};

	return (
		<TouchableOpacity
			accessibilityLabel={'tripCard'}
			testID={testID}
			style={{...styles.container, ...style}}
			disabled={onPress ? false : true}
			activeOpacity={0.7}
			onPress={onPress}>
			<View style={styles.tripImgWrap}>
				<Image source={{uri: tripImage}} style={styles.tripImg} />
				<Calendar day={day} month={month} time={timeStart} />
			</View>
			<View style={styles.wrapper}>
				<View style={{...styles.row, ...styles.firstRow}}>
					<AppText style={styles.grayTextUpper}>{seats}</AppText>
					<UsersSvg width={14} height={14} style={styles.usersSvg}/>
					<AppText style={styles.grayTextUpper}>
						{categories[category]}
					</AppText>
				</View>
				<AppBoldText numberOfLines={2} style={styles.title}>
					{title}
				</AppBoldText>
				<AppText numberOfLines={3} style={styles.description}>
					{description}
				</AppText>
				<View style={styles.row}>
					{driverFace && (
						<Image
							source={{uri: driverFace}}
							style={styles.driverFace}
						/>
					)}
					<AppText style={styles.driverName}>
						{driver.length > 17
							? driver.slice(0, 17) + '...'
							: driver}
					</AppText>
				</View>
				<View style={styles.footer}>
					<AppText style={styles.grayText}>до {timeEnd} </AppText>
					{!old && (
						<View>
							<AppBoldText style={styles.price}>
								{+price ? localNumeric(price) : 'Бесплатно'}
							</AppBoldText>
							<AppText style={styles.grayText}>
								осталось {emptySeats}{' '}
								{declOfNum(emptySeats, seatTitles)}
							</AppText>
						</View>
					)}
				</View>
			</View>
		</TouchableOpacity>
	);
};

export default memo(Trip);
