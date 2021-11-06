import React from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import AppText from '../AppText';

export default ({text = 'Загрузка...', style}) =>
{
	return (
		<View style={{...styles.wrapper, ...style}}>
			<ActivityIndicator color={'#76A829'} style={styles.indicator} size={'large'} />
			<AppText style={styles.text}>{text}</AppText>
		</View>
	);
};

const styles = StyleSheet.create({
	wrapper:
	{
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center'
	},
	indicator: {
		marginBottom: 10
	}
});
