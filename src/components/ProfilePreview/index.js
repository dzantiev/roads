import React, {memo} from 'react';
import {View, TouchableOpacity, Image, StyleSheet} from 'react-native';
import AppText from '../AppText';
import {randomImgFromName} from '../../services';

const ProfilePreview = ({name, imgUrl, style, onPressImg, showName = true}) => {
	const imageNumber = randomImgFromName(name || 'a');
	const getImage = () => {
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

	return (
		<>
			<View style={{...styles.container, ...style}}>
				{onPressImg && imgUrl ? (
					<TouchableOpacity
						onPress={() => onPressImg && onPressImg()}
						activeOpacity={0.7}>
						<Image source={img} style={styles.avatar} />
					</TouchableOpacity>
				) : (
					<Image source={img} style={styles.avatar} />
				)}
				{name && showName && (
					<AppText style={styles.text}>{name}</AppText>
				)}
			</View>
		</>
	);
};

export default memo(ProfilePreview);

const styles = StyleSheet.create({
	container: {
		alignItems: 'center',
		justifyContent: 'center',
	},
	avatar: {
		height: 68,
		width: 68,
		borderRadius: 68,
	},
	text: {
		marginTop: 12,
		fontStyle: 'normal',
		fontFamily: 'Roboto-Bold',
		fontSize: 18,
		textAlign: 'center',
		color: '#2E394B',
	},
});
