import React, {useState, useRef, useEffect} from 'react';
import {
	View,
	TouchableOpacity,
	Animated,
	Dimensions,
	Platform,
} from 'react-native';
import styles from './styles.js';
import AppText from '../../components/AppText/index.js';
import Modal from 'react-native-modal';
import DateTimePicker from '@react-native-community/datetimepicker';
import {twoDigitTime} from '../../services/';

export default ({
	style,
	data,
	onChange,
	placeholder,
	placeholderPadding = 0,
	value = '',
	prop,
	error,
}) => {
	const [isModal, setIsModal] = useState(false);
	const [placeholderWidth, setPlaceholderWidth] = useState(0);
	const fadeAnim = useRef(new Animated.Value(placeholderPadding)).current;
	const TimePickerRef = useRef();
	const [layoutWidth, setLayoutWidth] = useState(
		Dimensions.get('window').width,
	);

	useEffect(() => {
		const placeholderPos =
			layoutWidth - placeholderWidth - placeholderPadding;

		Animated.timing(fadeAnim, {
			toValue: isModal ? placeholderPos : 0,
			duration: 300,
			useNativeDriver: false,
		}).start();
	}, [fadeAnim, isModal]);

	const getPlaceholderWidth = e => {
		if (placeholderWidth === 90)
			setPlaceholderWidth(e.nativeEvent.layout.width);
	};

	const onSelect = val => {
		onChange && onChange(val, prop);
	};

	const renderTimePicker = () => {
		return (
			<>
				{Platform.OS === 'ios' ? (
					<Modal
						style={styles.timepickerModal}
						backdropOpacity={0.1}
						isVisible={isModal}
						onBackdropPress={() => setIsModal(false)}>
						<View style={styles.timepickerModalWr}>
							<DateTimePicker
								value={value !== '' ? value : new Date()}
								mode={'time'}
								is24Hour={true}
								display={'spinner'}
								onChange={(event, selected) =>
									onSelect(selected)
								}
							/>
						</View>
					</Modal>
				) : (
					isModal && (
						<DateTimePicker
							value={value !== '' ? value : new Date()}
							mode={'time'}
							is24Hour={true}
							display={'default'}
							onChange={(event, selected) => {
								const current = selected || value;
								onSelect(current);
								setIsModal(false);
							}}
						/>
					)
				)}
			</>
		);
	};

	return (
		<View onLayout={e => setLayoutWidth(e.nativeEvent.layout.width)}>
			{error && <AppText style={styles.errorMsg}>{error}</AppText>}
			<TouchableOpacity
				style={{...styles.wr, ...style, ...(error && styles.error)}}
				onPress={() => setIsModal(true)}
				activeOpacity={0.7}>
				<AppText style={styles.selectedText}>
					{value && twoDigitTime(value)}
				</AppText>
				<Animated.View
					style={[
						value !== ''
							? {right: placeholderPadding}
							: {left: fadeAnim},
						styles.animPlaceholderWr,
					]}
					onLayout={e =>
						setPlaceholderWidth(
							e.nativeEvent.layout.width -
								placeholderPadding +
								20,
						)
					}>
					<AppText style={styles.placeholder}>{placeholder}</AppText>
				</Animated.View>
			</TouchableOpacity>
			{renderTimePicker()}
		</View>
	);
};
