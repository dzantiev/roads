import React, {useState, useRef, useEffect, memo} from 'react';
import {View, TouchableOpacity, Animated} from 'react-native';
import styles from './styles.js';
import AppText from '../../components/AppText/index.js';
import ModalSelect from '../../components/ModalSelect/index.js';
import {CaretRight} from '../../svg/';


const SelectField = ({
	data,
	onChange,
	placeholder,
	value = '',
	prop,
	wrapperStyle,
	error,
	testID
}) => {
	const [isModal, setIsModal] = useState(false);
	const [selectItem, setSelectItem] = useState('');
	const [placeholderWidth, setPlaceholderWidth] = useState(0);
	const fadeAnim = useRef(new Animated.Value(value ? 1 : 0)).current;

	useEffect(() =>
	{
		Animated.timing(fadeAnim, {
			toValue: (isModal || value !== '') ? 1 : 0,
			duration: 300,
			useNativeDriver: false,
		}).start();
	}, [fadeAnim, isModal]);

	useEffect(() => {
		value !== '' && setSelectItem(data[value]);
	}, []);

	const getPlaceholderWidth = e =>
	{
		if (placeholderWidth === 0)
			setPlaceholderWidth(e.nativeEvent.layout.width);
	};

	const onSelect = item => {
		setSelectItem(`${data[item]}`);
		setIsModal(false);
		onChange && onChange(item, prop);
	};

	return (
		<TouchableOpacity
			testID={testID}
			activeOpacity={0.7}
			onPress={() => setIsModal(true)}
			style={{...wrapperStyle, ...((error && wrapperStyle) && styles.error)}}>
			{error && <AppText style={styles.errorMsg}>{error}</AppText>}
			<View style={styles.wr}>
				<View style={{
					...styles.placeholderContainer,
					paddingRight: placeholderWidth,
				}}>
					<AppText style={{
						...styles.selectedText,
					}}>
						{selectItem && selectItem.length > 15
							? selectItem.substring(0, 15 - 3) + '...'
							: selectItem }
					</AppText>
					<Animated.View
						onLayout={e => getPlaceholderWidth(e)}
						style={[styles.placeholderWrapper,
							{
								left: fadeAnim.interpolate({
									inputRange: [0, 1],
									outputRange: ['0%', '92%'],
								}),
							},
						]}
					>
						<AppText style={styles.placeholder}>{placeholder}</AppText>
					</Animated.View>
				</View>
				<CaretRight
					height={22}
					width={22}
					style={{marginLeft: 'auto'}}
				/>
				<ModalSelect
					data={data}
					isVisible={isModal}
					close={() => setIsModal(false)}
					onSelect={onSelect}
				/>
			</View>
		</TouchableOpacity>
	);
};

export default memo(SelectField);
