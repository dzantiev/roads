/**
 * @format
 */

import {AppRegistry, Platform} from 'react-native';
import App from './App.js';
import {name as appName} from './app.json';
import messaging from '@react-native-firebase/messaging';
import {localNotificationService} from './src/services/LocalNotificationService';
import AppMetrica from 'react-native-appmetrica';
import {APP_METRICA_KEY} from '@env';

if (Platform.OS === 'android')
{
	const onNotification = notify => {
		const data  = {
			...JSON.parse(notify.data.notification),
			data: notify.data,
		};
		localNotificationService.showNotification(data);
	};

	messaging().setBackgroundMessageHandler(async remoteMessage => {
		onNotification(remoteMessage);
	});
}

AppMetrica.activate({
	apiKey: APP_METRICA_KEY,
	sessionTimeout: 120,
	firstActivationAsUpdate: true,
});

AppRegistry.registerComponent(appName, () => App);
