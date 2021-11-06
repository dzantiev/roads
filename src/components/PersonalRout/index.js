import React, {memo} from 'react';
import {View, TouchableOpacity, Image} from 'react-native';
import AppText from '../AppText';
import AppBoldText from '../AppBoldText';
import styles from './styles';
import {localNumeric, convertDuration} from '../../services';

const PersonalRout = ({
	price,
	duration,
	routeImage,
	onPress,
	style,
	description,
	title,
	category,
	categories,
	driver,
	driverFace,
	old,
	testID,
}) => {
	const timeString = convertDuration(duration);
	return (
		<TouchableOpacity
			testID={testID}
			style={{...styles.container, ...style}}
			disabled={onPress ? false : true}
			activeOpacity={0.7}
			onPress={onPress}>
			<View style={styles.routeImageWrap}>
				<Image source={{uri: routeImage}} style={styles.routeImage} />
			</View>
			<View style={styles.wrapper}>
				<View style={{...styles.row, ...styles.firstRow}}>
					<AppText style={styles.grayTextUpper}>
						{categories[category]}
					</AppText>
				</View>
				{!!title && (
					<AppBoldText numberOfLines={2} style={styles.title}>
						{title}
					</AppBoldText>
				)}
				<AppText numberOfLines={3} style={styles.description}>
					{description}
				</AppText>
				<View style={styles.row}>
					{driverFace && (
						<Image
							source={{uri: driverFace}}
							style={styles.driverFace}
						/>
					)}
					<AppText
						numberOfLines={1}
						style={styles.driverName}
					>
						{driver}
					</AppText>
				</View>
				<View style={styles.footer}>
					<AppText style={styles.grayText}>
						длительность {timeString}{' '}
					</AppText>
					{!old && (
						<AppBoldText style={styles.price}>
							{+price ? localNumeric(price) : 'Бесплатно'}
						</AppBoldText>
					)}
				</View>
			</View>
		</TouchableOpacity>
	);
};

export default memo(PersonalRout);
