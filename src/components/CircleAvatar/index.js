import React from 'react';
import { TouchableOpacity, Image } from 'react-native';
import styles from './styles';


const CircleAvatar = ({ images, onPress }) =>
{
	const imgCount = images ? images.length : 0;
	return (
		<TouchableOpacity
			style={styles.container}
			onPress={onPress}
			activeOpacity={0.7}
		>
			<Image style={styles.imgFirst} source={imgCount ? {uri: images[0]} : require('../../img/car.png')}/>
			{imgCount > 1 &&
				<Image style={styles.imgSecond} source={imgCount ? {uri: images[1]} : require('../../img/car.png')}/>
			}
			{imgCount > 2 &&
				<Image style={styles.imgThird} source={imgCount ? {uri: images[2]} :require('../../img/car.png')}/>
			}
		</TouchableOpacity>
	);
};

export default CircleAvatar;
