import React, {memo} from 'react';
import {View, TouchableOpacity} from 'react-native';
import AppText from '../../components/AppText/index.js';
import styles from './styles.js';

const TouchebleField = ({title, value, onPress, style, testID}) => {
	return (
		<View style={{...styles.wr, ...styles.spaceBetween, ...style}}>
			<AppText style={styles.text} ellipsizeMode='head'>{title}</AppText>
			<TouchableOpacity
				style={styles.touchPlaceholder}
				activeOpacity={0.7}
				onPress={onPress}>
				<AppText
					testID={testID}
					style={styles.touchPlaceholderText}
					numberOfLines={1}>
					{value}
				</AppText>
			</TouchableOpacity>
		</View>
	);
};

export default memo(TouchebleField);
