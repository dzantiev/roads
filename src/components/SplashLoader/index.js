import React, {memo} from 'react';
import {View, SafeAreaView} from 'react-native';
import AppText from '../AppText';
import Modal from 'react-native-modal';
import styles from './styles.js';

const SplashLoader = ({
	isVisible = false,
	onModalHide,
	text = 'Заявка отправляется'
}) => {
	return (
		<Modal
			isVisible={isVisible}
			backdropColor="#F4F6F6"
			backdropOpacity={0.8}
			onModalHide={onModalHide && onModalHide}
		>
			<SafeAreaView>
				<View style={styles.container}>
					<AppText style={ styles.text}>{text} . . .</AppText>
				</View>
			</SafeAreaView>
		</Modal>
	);
};

export default memo(SplashLoader)
