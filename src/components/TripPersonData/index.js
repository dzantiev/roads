import React from 'react';
import {View, TouchableOpacity, Image} from 'react-native';
import AppText from '../AppText';
import styles from './styles';
import {PhoneBlueSvg} from '../../svg';
import {declOfNum, randomImgFromName} from '../../services';

const TripPersonData = ({
	name,
	seats,
	image,
	onCallPress,
	onUserPress,
	style,
}) => {
	const getImage = () => {
		if (image) return {uri: image};
		else {
			const imageNumber = randomImgFromName(name);

			switch (imageNumber) {
				case 0:
					return require('../../img/DefaultAvatar1.png');
				case 1:
					return require('../../img/DefaultAvatar2.png');
				case 2:
					return require('../../img/DefaultAvatar3.png');
				case 3:
					return require('../../img/DefaultAvatar4.png');
			}
		}
	};

	const seatTitles = ['место', 'места', 'мест'];
	return (
		<View style={{...styles.container, ...style}}>
			<TouchableOpacity
				style={styles.dataWrapper}
				onPress={onUserPress}
				activeOpacity={0.7}>
				<Image source={getImage()} style={styles.avatar} />
				<View style={styles.textInfo}>
					<AppText style={styles.name}>{name}</AppText>
					{+seats > 1 && (
						<AppText style={styles.seats}>
							бронь на {seats} {declOfNum(seats, seatTitles)}
						</AppText>
					)}
				</View>
			</TouchableOpacity>
			<TouchableOpacity
				style={styles.callBtn}
				activeOpacity={0.7}
				onPress={onCallPress}>
				<PhoneBlueSvg height={24} width={24} />
			</TouchableOpacity>
		</View>
	);
};

export default TripPersonData;
