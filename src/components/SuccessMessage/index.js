import React, {memo} from 'react';
import { View, SafeAreaView, StatusBar, Platform, Modal } from 'react-native';
import { SuccessMarkSvg, CloseSvg, XCircleSvg }  from '../../svg';
import AppText from '../../components/AppText';
import SmallBtn from '../../components/SmallBtn';
import styles from './styles.js';
import { SUPPORTED_ORIENTATIONS } from '../../variables';


const SuccessMessage = ({
	isVisible = false,
	close = null,
	success = true,
	message = 'Успех!',
	closeTestId
}) =>
{
	return (
		<>
			{isVisible && <StatusBar hidden={(Platform.OS !== 'android') ? true : false} backgroundColor={'#fff'}/>}
			<Modal
				visible={isVisible}
				transparent
				animationType={'slide'}
				backdropColor={'#fff'}
				supportedOrientations={SUPPORTED_ORIENTATIONS}
				onRequestClose={close}
				style={ styles.container }
			>
				<SafeAreaView style={ styles.safeArea }>
					<View style={ styles.wr }>
						<View style={styles.head}>
							<SmallBtn
								testID={closeTestId}
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

export default memo(SuccessMessage);
