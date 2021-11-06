import React, {useEffect, useState} from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import AppText from '../AppText';

export default ({time, sendSms, style}) => {
	const [timeCouner, setTimeCouner] = useState(time);

	useEffect(() => {
		const delTimeout = setTimeout(() => {
			timeCouner > 0 && setTimeCouner(v => v - 1);
		}, 1000);
		return () => clearTimeout(delTimeout);
	}, [timeCouner]);

	return (
		<View style={{...style}}>
			<AppText style={styles.text}>Не приходит смс?</AppText>
			{timeCouner > 0 ? (
				<AppText style={styles.text}>
					Попробовать через {timeCouner} сек
				</AppText>
			) : (
				<TouchableOpacity
					onPress={() => {
						sendSms();
						setTimeCouner(time);
					}}
					activeOpacity={0.7}>
					<AppText style={{...styles.text, color: '#76A829'}}>
						Отправить смс
					</AppText>
				</TouchableOpacity>
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	text: {
		textAlign: 'center',
		fontSize: 16,
		lineHeight: 19,
	},
});
