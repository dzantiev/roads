import React from 'react';
import {View, TouchableOpacity} from 'react-native';
import AppText from '../AppText';
import styles from './styles.js';
import {CarSvg, OrangeCarSvg, RedCarSvg, CarBlue} from '../../svg';

const DriverStatus = ({status, text, onPress, style}) => {
	let bg = '',
		color = '',
		svg = false;
	switch (status) {
		case 'request':
			bg = '#F4F6F6';
			color = '#3A83F3';
			svg = <CarBlue height={25} width={25} />;
			break;
		case 'fail':
			bg = '#FFE1D8';
			color = '#FE693A';
			svg = <RedCarSvg height={25} width={25} />;
			break;
		case 'waiting':
			bg = '#FFF3D8';
			color = '#FEC33A';
			svg = <OrangeCarSvg height={25} width={25} />;
			break;
		default:
			bg = '#E4EED4';
			color = '#76A829';
			svg = <CarSvg height={25} width={25} />;
	}

	return onPress ? (
		<TouchableOpacity
			style={{...styles.wr, backgroundColor: bg, ...style}}
			activeOpacity={0.7}
			onPress={onPress}>
			{svg}
			<AppText style={{...styles.text, color}}>{text}</AppText>
		</TouchableOpacity>
	) : (
		<View style={{...styles.wr, backgroundColor: bg, ...style}}>
			{svg}
			<AppText style={{...styles.text, color}}>{text}</AppText>
		</View>
	);
};

export default DriverStatus;
