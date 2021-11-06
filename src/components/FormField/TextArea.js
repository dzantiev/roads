import React, {useState, useRef, memo} from 'react';
import {TouchableOpacity, TextInput} from 'react-native';
import AppText from '../AppText';
import styles from './styles.js';

const TextArea = ({
	value = '',
	onChangeText,
	placeholder,
	prop,
	style,
	inputStyle,
	textAlignVertical = 'center',
	error,
	testID
}) => {
	const [currentValue, setCurrentValue] = useState(value);

	const input = useRef();

	const onChange = val => {
		setCurrentValue(val);
		onChangeText && onChangeText(val, prop);
	};

	const setFocusOnInput = () => {
		input.current.focus();
	};

	return (
		<TouchableOpacity
			style={{...styles.textAreaWr, ...style, ...(error && styles.error)}}
			onPress={() => setFocusOnInput()}
			activeOpacity={0.7}>
			{!!error && <AppText style={styles.errorMsg}>{error}</AppText>}
			<TextInput
				testID={testID}
				textAlignVertical={textAlignVertical}
				multiline
				ref={input}
				onChangeText={onChange}
				style={{
					...styles.input,
					...inputStyle,
					// fontSize: currentValue ? 18 : 15,
					// lineHeight: currentValue ? 21 : 15,
				}}
				value={currentValue}
				placeholder={placeholder}
				placeholderTextColor={'#81858C'}
			/>
		</TouchableOpacity>
	);
};

export default memo(TextArea);
