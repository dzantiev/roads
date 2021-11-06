import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import AppText from '../AppText';

const GreenBtn = ({ text, onPress, style, textStyle, testID }) =>
{
	return (
		<TouchableOpacity testID={testID} onPress={onPress} style={style} activeOpacity={0.7}>
			<AppText style={{...styles.text, ...textStyle}}>{ text }</AppText>
		</TouchableOpacity>
	);
};

export default GreenBtn;

const styles = StyleSheet.create({
	text:
	{
		fontStyle: 'normal',
		fontFamily: 'Roboto-Medium',
		fontSize: 14,
		lineHeight: 16,
		color: '#76A829',
		textAlign: 'center',
	},
});
