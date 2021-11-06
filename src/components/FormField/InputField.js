import React, {memo} from 'react';
import {
	View,
	TextInput,
} from 'react-native';
import AppText from '../AppText';
import styles from './styles.js';

const InputField = ({
	value = '',
	keyboardType = 'default',
	style,
	placeholder = 'placeholder',
	onChangeText,
	error = null,
	errorStyle,
	testID
}) => {
	return (
		<View style={{...styles.wr, ...style, ...(error && styles.error),}}>
			{error && <AppText style={{...styles.errorMsg, ...errorStyle}}>{error}</AppText>}
			<TextInput
				testID={testID}
				style={styles.input}
				value={value}
				onChangeText={onChangeText}
				keyboardType={keyboardType}
				placeholder={placeholder}
				placeholderTextColor={'#81858C'}
			/>
		</View>
	)
}

export default memo(InputField);
