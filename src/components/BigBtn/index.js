import React from 'react';
import {TouchableOpacity} from 'react-native';
import AppText from '../AppText';
import styles from './styles';

const BigBtn = ({caption, onPress, view = 'green', style, testID}) => {
	const curStyle = {
		green: {
			bigBtn: {
				backgroundColor: '#76A829',
			},
			btnText: {
				color: '#FFF',
			},
		},
		gray: {
			bigBtn: {
				backgroundColor: '#F4F6F6',
			},
			btnText: {
				color: '#2E394B',
			},
		},
	};
	return (
		<TouchableOpacity
			testID={testID}
			style={{...styles.bigBtn, ...curStyle[view].bigBtn, ...style}}
			onPress={onPress}
			activeOpacity={0.7}>
			<AppText style={{...styles.btnText, ...curStyle[view].btnText}}>
				{caption}
			</AppText>
		</TouchableOpacity>
	);
};

export default BigBtn;
