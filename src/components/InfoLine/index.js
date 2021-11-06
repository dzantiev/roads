import React, {memo} from 'react';
import {View, TouchableOpacity} from 'react-native';
import AppText from '../AppText';
import styles from './styles.js';

const InfoLine = ({children, boldText, smallText, style, sideStyle, onPress, testID}) => {
	return (
		<TouchableOpacity
			testID={testID}
			style={{...styles.wr, ...style}}
			disabled={onPress ? false : true}
			activeOpacity={0.7}
			onPress={onPress}>
			<View style={{...styles.side, ...sideStyle}}>
				{!!boldText && (
					<AppText style={styles.boldText}>{boldText}</AppText>
				)}
				{!!smallText && (
					<AppText style={styles.smallText}>{smallText}</AppText>
				)}
			</View>
			{children && <View style={styles.side}>{children}</View>}
		</TouchableOpacity>
	);
};

export default memo(InfoLine);
