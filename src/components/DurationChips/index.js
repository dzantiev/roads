import React from "react";
import {StyleSheet, View} from 'react-native';
import {Clock} from '../../svg';
import AppBoldText from '../AppBoldText';
import {convertDurationLongWords} from '../../services';

const DurationChips = ({duration, style}) => {
	return (
		<View style={{...styles.wrapper, ...style}}>
			<Clock />
			<AppBoldText style={styles.text}>
				{convertDurationLongWords(+duration)}
			</AppBoldText>
		</View>
	)
}

export default DurationChips;

const styles = StyleSheet.create({
	wrapper: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: '#DEDEDE',
		borderRadius: 50,
		paddingHorizontal: 16
	},
	text: {
		marginLeft: 8,
		fontSize: 12,
		color: '#fff',
	}
})
