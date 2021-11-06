import React from 'react';
import {View, TouchableOpacity} from 'react-native';
import AppText from '../AppText';
import styles from './styles.js';

const DeadBtn = ({onPress, text, style, testID}) => {
	return (
		<TouchableOpacity
			testID={testID}
			onPress={() => onPress()}
			style={{...styles.btn, ...style}}
			activeOpacity={0.7}>
			<AppText style={styles.btnText}>{text}</AppText>
		</TouchableOpacity>
	);
};

export default DeadBtn;
