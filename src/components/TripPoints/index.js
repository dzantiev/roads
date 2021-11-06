import React from 'react';
import {TouchableOpacity, View} from 'react-native';
import styles from './styles.js';
import AppText from '../AppText';
import {GeolocationSvg, PointSvg} from '../../svg';
import {goToPlace} from '../../services/yaMaps.js';

const TripPoints = ({places}) => {
	return (
		<View style={styles.container}>
			{places.map((el, i) => {
				if (i === 0 || i === places.length - 1)
					return (
						<View style={styles.item} key={i}>
							<GeolocationSvg height={16} width={16} />
							<TouchableOpacity
								onPress={() => goToPlace(el)}
								activeOpacity={0.7}>
								<AppText style={styles.text}>{el}</AppText>
							</TouchableOpacity>
						</View>
					);
				return (
					<View style={styles.item} key={i}>
						<PointSvg height={16} width={16} />
						<TouchableOpacity
							onPress={() => goToPlace(el)}
							activeOpacity={0.7}>
							<AppText style={styles.text}>{el}</AppText>
						</TouchableOpacity>
					</View>
				);
			})}
		</View>
	);
};

export default TripPoints;
