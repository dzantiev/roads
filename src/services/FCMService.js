import messaging from '@react-native-firebase/messaging';
import {Platform} from 'react-native';

class FCMService {
	register = (onRegister, onNotification, onOpenNotification) => {
		this.checkPermission(onRegister);
		this.createNotificationListeners(
			onRegister,
			onNotification,
			onOpenNotification,
		);
	};

	checkPermission = onRegister => {
		messaging()
			.hasPermission()
			.then(enabled => {
				if (enabled) this.getToken(onRegister);
				else this.requestPermission(onRegister);
			})
			.catch(error => {
				console.log('[FCMService] Permission Rejected', error);
			});
	};

	getToken = onRegister => {
		messaging()
			.getToken()
			.then(fcmToken => {
				if (fcmToken) onRegister(fcmToken);
				else console.log('User does not have a devices token');
			})
			.catch(error => {
				console.log('[FCMService] getToken Rejected', error);
			});
	};

	requestPermission = onRegister => {
		messaging()
			.requestPermission()
			.then(() => {
				this.getToken(onRegister);
			})
			.catch(error => {
				console.log('[FCMService] Request Permission Rejected', error);
			});
	};

	deleteToken = () => {
		messaging()
			.deleteToken()
			.catch(error => {
				console.log('[FCMService] Delete Token Error', error);
			});
	};

	createNotificationListeners = (
		onRegister,
		onNotification,
		onOpenNotification,
	) => {
		if (Platform.OS === 'android')
		{
			// When Application Running on Background
			messaging().onNotificationOpenedApp(remoteMessage => {
				onOpenNotification(remoteMessage);
			});

			// When Application open from quit state
			messaging()
				.getInitialNotification()
				.then(remoteMessage => {
					if (remoteMessage) {
						onOpenNotification(remoteMessage);
					}
				});
		}

		//Forground state message
		this.messageListener = messaging().onMessage(async remoteMessage => {
			onNotification(remoteMessage);
		});

		// Triggered when have new Token
		messaging().onTokenRefresh(fcmToken => {
			onRegister(fcmToken);
		});
	};

	unRegister = () => {
		this.messageListener();
	};

	stopAlarmRing = async () => {
		if (Platform.OS !== 'ios') await messaging().stopAlarmRing();
	};
}

export const fcmService = new FCMService();
