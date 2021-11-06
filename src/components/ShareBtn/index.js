import React from 'react';
import {TouchableOpacity} from 'react-native';
import AppText from '../AppText';
import styles from './styles';
import {ShareBlue} from '../../svg';

const ShareBtn = ({onPress, style, text}) => {
	return (
		<TouchableOpacity
			style={{...styles.roleSwither, ...style}}
			activeOpacity={0.7}
			onPress={onPress}>
			<ShareBlue height={25} width={25} />
			<AppText style={styles.btnText}>{text}</AppText>
		</TouchableOpacity>
	);
};

export default ShareBtn;
