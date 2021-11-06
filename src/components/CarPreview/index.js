import React from 'react';
import {View, TouchableOpacity, Image, StyleSheet} from 'react-native';
import AppBoldText from '../AppBoldText';
import AppText from '../AppText';
import {CaretRight} from '../../svg';

export default ({
	company,
	model,
	year,
	imgs,
	isApproved,
	style,
	onPress,
	accessibilityLabel,
}) => {
	return (
		<TouchableOpacity
			accessibilityLabel={accessibilityLabel}
			style={{...styles().container, ...style}}
			onPress={onPress}
			activeOpacity={0.7}>
			<Image source={{uri: imgs[0]}} style={styles().img} />
			<View style={styles().wrap}>
				<View style={styles().titleWrap}>
					<View style={styles(isApproved).titleStatus}></View>
					<AppBoldText
						style={
							styles().title
						}>{`${company} ${model}`}</AppBoldText>
				</View>
				<AppText style={styles().year}>{`${year.substr(
					0,
					4,
				)} год`}</AppText>
			</View>
			<CaretRight />
		</TouchableOpacity>
	);
};

const styles = isMain =>
	StyleSheet.create({
		container: {
			flexDirection: 'row',
			alignItems: 'center',
			paddingVertical: 11,
		},
		img: {
			width: 42,
			height: 42,
			borderRadius: 5,
		},
		wrap: {
			flex: 1,
			marginLeft: 10,
		},
		titleWrap: {
			flexDirection: 'row',
			alignItems: 'center',
		},
		titleStatus: {
			width: 7,
			height: 7,
			borderRadius: 7,
			backgroundColor: isMain ? '#76A829' : '#FEC33A',
			marginBottom: 3,
		},
		title: {
			marginBottom: 2,
			fontSize: 16,
			lineHeight: 18.75,
			marginLeft: 5,
		},
		year: {
			color: '#81858C',
			fontSize: 14,
			lineHeight: 16.41,
		},
	});
