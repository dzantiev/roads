import React, {useState, useEffect, useRef, memo} from 'react';
import {Animated, View, TextInput, TouchableOpacity} from 'react-native';
import {TextInputMask} from 'react-native-masked-text';
import AppText from '../AppText';
import styles from './styles';

const AnimTextInput = ({
	mask,
	anim = true,
	value = '',
	keyboardType = 'default',
	autoCorrect = true,
	style,
	wrapperStyle,
	placeholderStyle,
	originalPl = '',
	placeholder = 'placeholder',
	onChangeAI,
	error = null,
	errorStyle,
	getLayoutData,
	fieldTestID
}) => {
	const [inputValue, setInputValue] = useState(value);
	const [isFocus, setIsFocus] = useState(false);
	const [placeholderWidth, setPlaceholderWidth] = useState(0);
	const fadeAnim = useRef(new Animated.Value(value ? 1 : 0)).current;
	const input = useRef();

	useEffect(() => {
		if (anim) {
			if (value || !inputValue) {
				Animated.timing(fadeAnim, {
					toValue: isFocus || value ? 1 : 0,
					duration: 300,
					useNativeDriver: false,
				}).start();
			}
		}
	}, [fadeAnim, isFocus, anim]);

	const setFocusOnInput = () => {
		input.current.getElement
			? input.current.getElement().focus()
			: input.current.focus();
	};

	useEffect(() => {
		if (value && value !== inputValue) {
			setInputValue(value);
			setFocusOnInput();
		}
	}, [value]);

	const onChangeText = val => {
		setInputValue(val);
	};
	useEffect(() => {
		if (value || inputValue) {
			typeof onChangeAI === 'function' && onChangeAI(inputValue);
		}
	}, [inputValue]);

	const getPlaceholderWidth = e => {
		if (placeholderWidth === 0)
			setPlaceholderWidth(e.nativeEvent.layout.width);
	};

	return (
		<View
			style={wrapperStyle}
			onLayout={
				e => {
					if (typeof getLayoutData === 'function')
						getLayoutData(e.nativeEvent.layout);
				}
			}
		>
			{error && <AppText style={{...styles.errorMsg, ...errorStyle}}>{error}</AppText>}
			<TouchableOpacity
				style={{
					...styles.container,
					...style,
					...(error && styles.error),
				}}
				activeOpacity={0.7}
				onPress={() => setFocusOnInput()}>
				<View
					style={[
						styles.placeholderContainer,
						{
							paddingRight: placeholderWidth,
						},
					]}>
					<Animated.View
						onLayout={e => getPlaceholderWidth(e)}
						style={[
							styles.placeholderWrapper,
							anim
								? {
									left: fadeAnim.interpolate({
										inputRange: [0, 1],
										outputRange: ['0%', '100%'],
									}),
								}
								: value || inputValue
									? {left: '100%'}
									: {left: '0%'},
							placeholderStyle,
						]}>
						<AppText style={styles.placeholder}>
							{placeholder}
						</AppText>
					</Animated.View>
				</View>
				{mask ? (
					<TextInputMask
						testID={fieldTestID}
						type={'custom'}
						options={{mask}}
						maxLength={mask.length}
						style={[
							styles.textInput,
							{
								paddingRight: placeholderWidth + 20,
							},
						]}
						value={inputValue}
						onChangeText={onChangeText}
						keyboardType={keyboardType}
						onFocus={() => setIsFocus(true)}
						onBlur={() => setIsFocus(false)}
						placeholder={originalPl}
						autoCorrect={autoCorrect}
						ref={input}
					/>
				) : (
					<TextInput
						testID={fieldTestID}
						style={[
							styles.textInput,
							{
								paddingRight: placeholderWidth + 20,
							},
						]}
						value={inputValue}
						onChangeText={onChangeText}
						keyboardType={keyboardType}
						onFocus={() => setIsFocus(true)}
						onBlur={() => setIsFocus(false)}
						placeholder={originalPl}
						autoCorrect={autoCorrect}
						ref={input}
					/>
				)}
			</TouchableOpacity>
		</View>
	);
};

export default memo(AnimTextInput);
