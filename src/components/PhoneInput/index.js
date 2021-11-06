import React, {useState} from 'react';
import {View, TextInput} from 'react-native';
import styles from './styles.js';
import {onPhoneInput} from '../../services';

export default ({onChange, style, testID}) => {
	const [phone, setPhone] = useState('+7');
	const [key, setKey] = useState('');

	let selection = {
		start: 0,
		end: 0,
	}

	const changeInputValue = val => {
		let v = val
		if (val.startsWith('+7+7')) {v = val.replace('+7+7', '+7')}
		if (val.startsWith('+78')) {v = val.replace('+78', '+7')}
		if (val.startsWith('+77')) {v = val.replace('+77', '+7')}

		const newValue = Math.abs(phone.length - v.length) > 9
			? onPhoneInput(v, key, v.length - 1)
			: onPhoneInput(v, key, selection.start)
		setPhone(newValue);
		typeof onChange === 'function' && onChange(newValue);
	};

	return (
		<View style={{...styles.container, ...style}}>
			<TextInput
				testID={testID}
				value={phone}
				onChangeText={v => changeInputValue(v)}
				onKeyPress={v => setKey(v.nativeEvent.key)}
				onSelectionChange={v => selection = v.nativeEvent.selection}
				style={styles.input}
				placeholder={'+'}
				placeholderTextColor="#181818"
				// maxLength={maxLength}
				maxLength={phone.startsWith('+7') ? 18 : 22}
				keyboardType={'numeric'}
			/>
		</View>
	);
};
