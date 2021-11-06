import React from 'react';
import {TouchableOpacity, View} from 'react-native';
import styles from './styles';

const SmallBtn = ({onPress, children, style, wrapperStyle, testID}) =>
{
	return (
		<>
			{wrapperStyle ? (
				<TouchableOpacity
					testID={testID}
					style={{...wrapperStyle}}
					activeOpacity={0.7}
					onPress={onPress}>
					<View
						style={{...styles.button, ...style}}>
						{children}
					</View>
				</TouchableOpacity>
			) : (
				<TouchableOpacity
					testID={testID}
					style={{...styles.button, ...style}}
					activeOpacity={0.7}
					onPress={onPress}>
					{children}
				</TouchableOpacity>
			)}
		</>
	);
};

export default SmallBtn;
