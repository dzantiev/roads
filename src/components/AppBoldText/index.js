import React from 'react';
import { Text, StyleSheet } from 'react-native';


const AppText = ({ style, children, numberOfLines, ellipsizeMode }) =>
{
	return (
		<Text
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
		fontFamily: 'Roboto-Bold',
	},
});

export default AppText;
