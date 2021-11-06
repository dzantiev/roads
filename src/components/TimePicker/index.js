import React, {useState} from 'react';
import {View, TouchableOpacity, Platform} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import {twoDigitTime} from '../../services';
import AppText from '../AppText';
import styles from './styles.js';
import Modal from 'react-native-modal';

const TimePicker = ({selectedTime, setSelectedTime, btnStyle, textStyle}) => {
	const [isVisible, setVisible] = useState(false);
	return (
		<>
			<TouchableOpacity
				style={btnStyle}
				onPress={() => setVisible(true)}
				activeOpacity={0.7}>
				<AppText style={{...styles.grayText, ...textStyle}}>
					{twoDigitTime(selectedTime)}
				</AppText>
			</TouchableOpacity>
			{Platform.OS === 'ios' ? (
				<Modal
					style={styles.timepickerModal}
					backdropOpacity={0.1}
					isVisible={isVisible}
					onBackdropPress={() => setVisible(false)}>
					<View style={styles.modalWrapper}>
						<DateTimePicker
							value={selectedTime}
							mode={'time'}
							is24Hour={true}
							display={'spinner'}
							onChange={(event, selected) =>
								setSelectedTime(selected)
							}
						/>
					</View>
				</Modal>
			) : (
				isVisible && (
					<DateTimePicker
						value={selectedTime}
						mode={'time'}
						is24Hour={true}
						display={'default'}
						onChange={(event, selected) => {
							const current = selected || selectedTime;
							setSelectedTime(current);
							setVisible(false);
						}}
					/>
				)
			)}
		</>
	);
};

export default TimePicker;
