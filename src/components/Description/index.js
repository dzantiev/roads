import React, {memo} from 'react';
import {View, StyleSheet} from 'react-native';
import AppText from '../../components/AppText/index.js';
import AppBoldText from '../../components/AppBoldText/index.js';
import Hyperlink from 'react-native-hyperlink';
import {openUrl} from '../../services/index.js';

const Description = ({title, text, style, titleStyle}) => {
	return (
		<View style={{...styles.container, ...style}}>
			<AppBoldText style={{...styles.title, ...titleStyle}}>
				{title}
			</AppBoldText>
			<Hyperlink linkStyle={{color: '#76A829'}} onPress={openUrl}>
				<AppText style={styles.text}>{text}</AppText>
			</Hyperlink>
		</View>
	);
};

export default memo(Description);

const styles = StyleSheet.create({
	container:
	{
		paddingVertical: 6,
	},
	title:
	{
		fontSize: 18,
		lineHeight: 21.6,
		color: '#2E394B',
	},
	text:
	{
		marginTop: 3,
		fontSize: 14,
		lineHeight: 18.9,
		color: '#2E394B',
	},
});
