import React from 'react';
import { View } from 'react-native';
import AppText from '../AppText';
import { GeolocationSvg, LogoText }  from '../../svg';
import styles from './styles';


const Header = ({ logoText = 'Roads', city, style, testID }) =>
{
	return (
		<View style={{...styles.container, ...style}} testID={testID}>
			<LogoText  style={styles.logoText} numberOfLines={1} />
			<View style={styles.cityContainer}>
				<AppText style={styles.cityText} numberOfLines={1}>{city}</AppText>
				<GeolocationSvg height={25} width={25}/>
			</View>
		</View>
	);

};

export default Header;
