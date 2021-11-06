import React, {useState} from 'react';
import PromptTemplate from '../PromptTemplate';
import SegmentedInput from '../SegmentedInput';
import MessageWithTimer from '../MessageWithTimer';
import styles from './style';
import {View} from 'react-native';
import AppText from '../AppText';

export default ({
	isOpen = false,
	onCancel = null,
	onPrompt = null,
	onClose = null,
	onSendSms = null,
	onInput = null,
	customStyles = {},
	title = 'Do you want to continue?',
	message = '',
	showCancel = true,
	showPrompt = true,
	textCancel = 'Отменить',
	textPrompt = 'Отправить',
	useNativeDriver = false,
	closeOnPressMask = true,
	closeOnPressBack = true,
	errorMsg = '',
	value = '',
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
			closeOnPressBack={closeOnPressBack}>
			<SegmentedInput
				style={styles.codeInput}
				codeChange={onInput}
				errorMsg={errorMsg}
				value={value}
			/>
			<MessageWithTimer
				style={styles.codeInput}
				time={30}
				sendSms={onSendSms}
			/>
		</PromptTemplate>
	);
};
