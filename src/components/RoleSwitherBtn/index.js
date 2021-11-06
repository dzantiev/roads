import React from 'react';
import {TouchableOpacity} from 'react-native';
import AppText from '../AppText';
import styles from './styles';
import {CarSvg, SunSvg} from '../../svg';

const RoleSwitherBtn = ({isDriver, onPress, style, testID}) => {
	return (
		<TouchableOpacity
			testID={testID}
			style={{...styles.roleSwither, ...style}}
			onPress={onPress}
			activeOpacity={0.7}>
			{isDriver ? (
				<SunSvg height={25} width={25} />
			) : (
				<CarSvg height={25} width={25} />
			)}
			<AppText style={styles.btnText}>
				{isDriver
					? 'Переключиться на туриста'
					: 'Переключиться на организатора'}
			</AppText>
		</TouchableOpacity>
	);
};

export default RoleSwitherBtn;
