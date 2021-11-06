import React from 'react';
import { View, SafeAreaView, StatusBar, Platform, TouchableOpacity } from 'react-native';
import { SuccessMarkSvg, CloseSvg, XCircleSvg }  from '../../svg';
import AppText from '../../components/AppText/index.js';
import SmallBtn from '../../components/SmallBtn/index.js';
import styles from './styles.js';
import Modal from 'react-native-modal';


const SuccessMessage = ({ isVisible, close, success = true, message = 'Успех!' }) =>
{
	return (
		<>
			{isVisible && <StatusBar hidden={(Platform.OS !== 'android') ? true : false} backgroundColor={'#fff'}/>}
			<Modal
				animationType={'slide'}
				isVisible={isVisible}
				backdropColor={'#fff'}
				style={ styles.container }
				onRequestClose={close}
			>
				<SafeAreaView style={ styles.safeArea }>
					<View style={ styles.wr }>
						<View style={styles.head}>
							<SmallBtn
								wrapperStyle={styles.closeBtn}
								width={28}
								height={28}
								borderRadius={5}
								onPress={close}
							>
								<CloseSvg height={16} width={16}/>
							</SmallBtn>
						</View>
						<View style={styles.centerGroup}>
							{success ? (
								<View style={{...styles.successIcon}}>
									<SuccessMarkSvg height={32} width={32}/>
								</View>
							) : (
								<View style={{...styles.successIcon, ...styles.faultIcon}}>
									<XCircleSvg height={48} width={48}/>
								</View>
							)}
							<AppText style={styles.text}>{message}</AppText>
						</View>
					</View>
				</SafeAreaView>
			</Modal>
		</>
	);
};

export default SuccessMessage;
