import React from 'react';
import {TouchableOpacity, View} from 'react-native';
import styles from './styles.js';
import AppText from '../AppText';
import {declOfNum} from '../../services';
import {goToPlace} from '../../services/yaMaps.js';

const TripStatusBar = ({status, meetPlace, seats, style}) => {
	const seatTitles = ['место', 'места', 'мест'];
	return (
		<View style={{...styles.container, ...style}}>
			{status === 'pending' ? (
				<View style={[styles.status, styles.pendingStatus]}>
					<AppText style={styles.pendingText}>Идет набор</AppText>
				</View>
			) : (
				<View style={[styles.status, styles.anotherStatus]}>
					<AppText style={styles.anotherText}>Полная посадка</AppText>
				</View>
			)}
			<View style={styles.info}>
				<View>
					<AppText style={styles.bigText}>Место сбора:</AppText>
					<TouchableOpacity
						onPress={() => goToPlace(meetPlace)}
						activeOpacity={0.7}>
						<AppText
							style={{...styles.bigText, ...styles.bigTextURL}}>
							{meetPlace}
						</AppText>
					</TouchableOpacity>
				</View>
				<AppText style={styles.smallText}>
					осталось {seats} {declOfNum(seats, seatTitles)}
				</AppText>
			</View>
		</View>
	);
};

export default TripStatusBar;
