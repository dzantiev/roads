import React from 'react';
import { TouchableOpacity } from 'react-native';
import AppText from '../AppText';
import styles from './styles';


const UserCallBtn = ({ caption = 'вызов', onPress, style, textStyle, children }) =>
{
	const text = caption.length > 11 ? caption.slice(0, 11) + '...' : caption
	return (
		<TouchableOpacity style={{...styles.button, ...style}} onPress={onPress} activeOpacity={0.7}>
			{children}
			<AppText style={{...styles.buttonText, ...textStyle}}>{text}</AppText>
		</TouchableOpacity>
	);
};

export default UserCallBtn;
