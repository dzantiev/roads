import React, {useEffect, useRef, useState, memo} from 'react';
import {View, TouchableOpacity, Animated} from 'react-native';
import AppText from '../../components/AppText/index.js';
import DateRangePicker from '../../components/DateRangePicker/index.js';

import styles from './styles.js';
import Modal from 'react-native-modal';
import {numericDate, FullDateFormatter, getNextYear} from '../../services/';

const DateField = ({
	value,
	style,
	wrapperStyle,
	placeholder,
	onChangeText,
	error,
	minDate,
	getLayoutData,
	testID,
	successBtnTestID
}) => {
	const [isModal, setIsModal] = useState(false);
	const [date, setDate] = useState(() => {
		if (value) {
			if (typeof value !== 'object') return value;
			else return numericDate(value);
		}
	});
	const [placeholderWidth, setPlaceholderWidth] = useState(0);
	const fadeAnim = useRef(new Animated.Value(value ? 1 : 0)).current;

	useEffect(() => {
		Animated.timing(fadeAnim, {
			toValue: isModal || value !== '' ? 1 : 0,
			duration: 300,
			useNativeDriver: false,
		}).start();
	}, [fadeAnim, isModal]);

	const setDateForDatePicker = () => {
		return `${date.substr(6, 10)}-${date.substr(3, 2)}-${date.substr(
			0,
			2,
		)}`;
	};

	const renderDatePicker = () => {
		return (
			<Modal
				isVisible={isModal}
				animationType={'none'}
				onBackdropPress={() => setIsModal(false)}
				onRequestClose={() => setIsModal(false)}>
				<DateRangePicker
					successTestID={successBtnTestID}
					onDateSelect={dateSelect}
					cansel={() => setIsModal(false)}
					current={date}
					value={date && setDateForDatePicker()}
					maxDate={numericDate(getNextYear())
						.split('.')
						.reverse()
						.join('-')}
					minDate={minDate}
				/>
			</Modal>
		);
	};

	const getPlaceholderWidth = e => {
		if (placeholderWidth === 0)
			setPlaceholderWidth(e.nativeEvent.layout.width);
	};

	const dateSelect = newDate => {
		setIsModal(false);
		setDate(FullDateFormatter(newDate));
		onChangeText && onChangeText(FullDateFormatter(newDate));
	};

	return (
		<>
			<View
				onLayout={e => {
					if (typeof getLayoutData === 'function')
						getLayoutData(e.nativeEvent.layout);
				}}
			>
				<TouchableOpacity
					testID={testID}
					activeOpacity={0.7}
					onPress={() => setIsModal(true)}
					style={{...wrapperStyle}}>
					<View>
						<View
							style={{
								...style,
								...styles.wr,
								...(error && styles.error),
							}}
						>
							{error && (
								<AppText style={styles.errorMsg}>{error}</AppText>
							)}
							<AppText
								style={{
									...styles.selectedText,
									paddingRight: placeholderWidth,
								}}>
								{date}
							</AppText>
							<View
								style={[
									styles.placeholderContainer,
									{
										paddingRight: placeholderWidth,
									},
								]}
							>
								<Animated.View
									onLayout={e => getPlaceholderWidth(e)}
									style={[
										styles.placeholderWrapper,
										{
											left: fadeAnim.interpolate({
												inputRange: [0, 1],
												outputRange: ['0%', '100%'],
											}),
										},
									]}>
									<AppText style={{...styles.placeholder}}>
										{placeholder}
									</AppText>
								</Animated.View>
							</View>
						</View>
					</View>
				</TouchableOpacity>
			</View>
			{isModal && renderDatePicker()}
		</>
	);
};

export default memo(DateField);
