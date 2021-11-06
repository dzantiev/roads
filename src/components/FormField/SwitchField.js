import React, {memo} from 'react';
import {View, Switch} from 'react-native';
import AppText from '../AppText';
import styles from './styles';

const SwitchField = ({
	style,
	errorStyle,
	value = false,
	text = '',
	onPress = null,
	error,
}) => {
	return (
		<View style={{
			...styles.textAreaWr,
			...styles.spaceBetween,
			...style,
			...(error && styles.error),
		}}>
			{error && <AppText style={{...styles.errorMsg, ...errorStyle}}>{error}</AppText>}
			<AppText>{text}</AppText>
			<Switch
				trackColor={{ false: '#F4F6F6', true: '#76A829' }}
				thumbColor={value ? '#F4F6F6' : '#76A829'}
				ios_backgroundColor={'#FFF'}
				value={value}
				onValueChange={onPress}
			/>
		</View>
	);
};

export default memo(SwitchField);
