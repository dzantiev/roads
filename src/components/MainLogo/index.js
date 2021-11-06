import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import AppText from '../AppText';
import {Logo} from '../../svg';

export default ({title = 'Roads', slogan = 'Путешествуй легко', style, testID}) =>
{
	return (
		<View style={{...styles.container, ...style}} testID={testID}>
			<Logo style={styles.logo} />
			<AppText style={styles.text}>{slogan}</AppText>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		alignItems: 'center'
	},
	logo:
	{
		marginBottom: 12,
	},
	text: {
		textAlign: 'center',
		fontSize: 12,
		lineHeight: 14,
		color: '#81858C',
	},
});
