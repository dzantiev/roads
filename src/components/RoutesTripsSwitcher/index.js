import React, {memo} from 'react';
import {View, TouchableOpacity, StyleSheet} from 'react-native';
import AppText from '../AppText';

const RoutesTripsSwitcher = ({onTripsPress, onRoutesPress, isRoutes, style}) => {
	return (
		<View style={{...styles.wrapper, ...style}}>
			<TouchableOpacity
				testID={'toRoutesSwitcher'}
				disabled={isRoutes ? true : false}
				activeOpacity={0.7}
				style={{
					...styles.btn,
					...(isRoutes && {backgroundColor: '#FFF'})
				}}
				onPress={onRoutesPress}
			>
				<AppText style={styles.btnText}>
					Маршруты
				</AppText>
			</TouchableOpacity>

			<TouchableOpacity
				testID={'toTripsSwitcher'}
				disabled={!isRoutes ? true : false}
				activeOpacity={0.7}
				style={{
					...styles.btn,
					...(!isRoutes && {backgroundColor: '#FFF'})
				}}
				onPress={onTripsPress}
			>
				<AppText style={styles.btnText}>
					Предстоящие
				</AppText>
			</TouchableOpacity>
		</View>
	);
};

export default memo(RoutesTripsSwitcher);

const styles = StyleSheet.create({
	wrapper:
	{
		flexDirection: 'row',
		backgroundColor: '#F4F6F6',
		borderRadius: 4,
		paddingHorizontal: 4,
		paddingVertical: 2,
	},
	btn:
	{
		flex: 1,
		borderRadius: 4,
		alignItems: 'center',
	},
	btnText:
	{
		fontSize: 11,
		lineHeight: 23,
	},
});
