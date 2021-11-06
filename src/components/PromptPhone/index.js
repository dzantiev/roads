import React, {useState} from 'react';
import PromptTemplate from '../PromptTemplate';
import PhoneInput from '../PhoneInput';

import styles from './style';
import AppText from '../AppText';
import { View } from 'react-native';

export default ({
	isOpen = false,
	onCancel = null,
	onPrompt = null,
	onClose = null,
	onInput = null,
	customStyles = {},
	title = "Do you want to continue?",
	message = "",
	showCancel = true,
	showPrompt = true,
	textCancel = "Отменить",
	textPrompt = "Отправить",
	useNativeDriver = false,
	closeOnPressMask = true,
	closeOnPressBack = true,
	errorMsg = ''
}) => {
	return (
		<PromptTemplate
			isOpen={isOpen}
			onCancel={onCancel}
			onPrompt={onPrompt}
			onClose={onClose}
			customStyles={customStyles}
			title={title}
			message={message}
			showCancel={showCancel}
			showPrompt={showPrompt}
			textCancel={textCancel}
			textPrompt={textPrompt}
			useNativeDriver={useNativeDriver}
			closeOnPressMask={closeOnPressMask}
			closeOnPressBack={closeOnPressBack}
		>
			<View style={styles.phoneInput}>
				<PhoneInput style={!!errorMsg && styles.error} onChange={onInput} />
				<AppText style={styles.phoneError}>{!!errorMsg && errorMsg}</AppText>
			</View>
		</PromptTemplate>
	)
}
