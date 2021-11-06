import React from 'react';
import {View, Image, TouchableOpacity} from 'react-native';
import AppText from '../AppText';
import styles from './styles.js';
import {declOfNum, randomImgFromName} from '../../services';

const DriverPreview = ({name, experience, imgUrl, style, onPress, testID}) => {
	const getImage = () => {
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
	};

	const img = imgUrl ? {uri: imgUrl} : getImage();

	const ExperienceElement = () => {
		return experience >= 1
			? <AppText style={styles.smallText}>
				{`Стаж ${experience} ${declOfNum(experience, ['год', 'года', 'лет'])}`}
			</AppText>
			: <AppText style={styles.smallText}>Новичок</AppText>
	}

	return (
		<TouchableOpacity
			testID={testID}
			style={{...styles.container, ...style}}
			onPress={onPress}
			activeOpacity={onPress ? 0.7 : 1}
		>
			<View style={styles.wrap}>
				<Image source={img} style={styles.avatar} />
				<View style={styles.texts}>
					<AppText
						ellipsizeMode={'tail'}
						numberOfLines={1}
						style={styles.text}
					>
						{name}
					</AppText>
					{
						experience && <ExperienceElement />
					}
				</View>
			</View>
		</TouchableOpacity>
	);
};

export default DriverPreview;
