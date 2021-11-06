import React from 'react';
import {View, Dimensions} from 'react-native';
import styles from './styles.js';
import {PlusSvg, MinusSvg} from '../../svg/index.js';
import AppText from '../../components/AppText/index.js';
import SmallBtn from '../../components/SmallBtn/index.js';

const borderRadius =
	Math.round(
		Dimensions.get('window').width + Dimensions.get('window').height,
	) / 2;

const Counter = ({onChange, count = 1, max}) => {
	const changeCount = isPlus => {
		if (isPlus && count === max) return;
		if (!isPlus && count === 1) return;
		onChange && onChange(isPlus);
	};

	return (
		<View style={styles.container}>
			<View style={styles.wr}>
				<SmallBtn
					width={30}
					height={30}
					style={{borderRadius: borderRadius}}
					onPress={() => changeCount(false)}>
					<MinusSvg height="18" width="18" />
				</SmallBtn>
				<AppText style={styles.counterText}>{count}</AppText>
				<SmallBtn
					width={30}
					height={30}
					style={{borderRadius: borderRadius}}
					onPress={() => changeCount(true)}>
					<PlusSvg height="18" width="18" />
				</SmallBtn>
			</View>
		</View>
	);
};

export default Counter;
