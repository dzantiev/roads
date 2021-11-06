import React, {useState, useEffect, useRef} from 'react';
import {View, TextInput, TouchableOpacity, ScrollView} from 'react-native';
import AppText from '../AppText';
import styles from './styles.js';

const SegmentedInput = ({codeChange, style, errorMsg, keyboardOpen, testID}) => {
	const [value, setValue] = useState('');
	const input = useRef();

	const setFocusOnInput = () => {
		input.current.focus();
	};

	useEffect(() =>
	{
		const timeout = setTimeout(() =>
		{
			setFocusOnInput();
		}, 300);
		return () => clearTimeout(timeout);
	}, []);

	const onChangeCode = value => {
		setValue(value);
		typeof codeChange === 'function' && codeChange(value);
	};

	return (
		<View style={[styles.wrapper, style]}>
			<ScrollView keyboardShouldPersistTaps="always">
				<TouchableOpacity style={styles.container} activeOpacity={0.7}>
					<View
						onStartShouldSetResponder={setFocusOnInput}
						style={
							errorMsg
								? [styles.codeInput, styles.error]
								: styles.codeInput
						}
						activeOpacity={1}>
						<AppText style={styles.codeInputText}>
							{value[0]}
						</AppText>
					</View>
					<View
						onStartShouldSetResponder={setFocusOnInput}
						style={
							errorMsg
								? [styles.codeInput, styles.error]
								: styles.codeInput
						}
						activeOpacity={1}>
						<AppText style={styles.codeInputText}>
							{value[1]}
						</AppText>
					</View>
					<View
						onStartShouldSetResponder={setFocusOnInput}
						style={
							errorMsg
								? [styles.codeInput, styles.error]
								: styles.codeInput
						}
						activeOpacity={1}>
						<AppText style={styles.codeInputText}>
							{value[2]}
						</AppText>
					</View>
					<View
						onStartShouldSetResponder={setFocusOnInput}
						style={
							errorMsg
								? [styles.codeInput, styles.error]
								: styles.codeInput
						}
						activeOpacity={1}>
						<AppText style={styles.codeInputText}>
							{value[3]}
						</AppText>
					</View>
					<TextInput
						testID={testID}
						ref={input}
						style={styles.input}
						maxLength={4}
						// autoFocus
						keyboardType={'numeric'}
						onChangeText={onChangeCode}
						caretHidden={true}
					/>
				</TouchableOpacity>
			</ScrollView>
			<View style={styles.errorWrapper}>
				<AppText style={styles.codeError}>
					{!!errorMsg && errorMsg}
				</AppText>
			</View>
		</View>
	);
};

export default SegmentedInput;
