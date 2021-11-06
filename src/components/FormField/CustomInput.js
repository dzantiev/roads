import React from 'react';
import { View} from 'react-native';
import styles from './styles.js';

const CustomInput = ({left, right, style}) =>
{
	return (
		<View style={ {...styles.wr, ...style}  }>
			<View style={ [styles.side, styles.leftSide ] }>
				{ left }
			</View>
			<View style={ [styles.side, styles.rightSide] }>
				{ right }
			</View>
		</View>
	);
};

export default CustomInput;
