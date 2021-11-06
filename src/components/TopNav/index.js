import React from 'react';
import {View, TouchableOpacity} from 'react-native';
import AppText from '../AppText';
import styles from './styles';

const TopNav = ({
	leftCaption = 'Отмена',
	title,
	rightCaption = 'Готово',
	ready,
	onLeftPress,
	onRightPress,
	style,
	paddingVertical = 22,
	сompleteTestID
}) => {
	return (
		<View style={{...styles.container, ...style}}>
			<TouchableOpacity
				style={{...styles.button, paddingVertical}}
				activeOpacity={0.7}
				onPress={onLeftPress}>
				<AppText style={styles.leftText} numberOfLines={1}>
					{leftCaption}
				</AppText>
			</TouchableOpacity>
			<AppText style={styles.titleText} numberOfLines={3}>
				{title}
			</AppText>
			<TouchableOpacity
				testID={сompleteTestID}
				style={{...styles.button, ...styles.leftBtn, paddingVertical}}
				disabled={ready ? false : true}
				activeOpacity={0.7}
				onPress={onRightPress}>
				<AppText style={styles.rightText} numberOfLines={1}>
					{ready ? rightCaption : ''}
				</AppText>
			</TouchableOpacity>
		</View>
	);
};

export default TopNav;
