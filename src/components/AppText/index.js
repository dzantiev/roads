import React from 'react';
import { Text, StyleSheet } from 'react-native';


const AppText = ({ style, children, numberOfLines, ellipsizeMode, onPress }) =>
{
	return (
		<Text
			onPress={onPress ? onPress : null}
			ellipsizeMode={ellipsizeMode}
			numberOfLines={numberOfLines}
			style={{...styles.default, ...style}}>
			{children}
		</Text>
	);
};

const styles = StyleSheet.create({
	default:
	{
		fontFamily: 'Roboto-Regular',
	},
});

export default AppText;
