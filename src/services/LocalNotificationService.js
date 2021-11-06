import PushNotification from 'react-native-push-notification';
import PushNotificationIOS from '@react-native-community/push-notification-ios';

class LocalNotificationService {
	constructor() {
		this.lastId = 0;
		this.lastChannelCounter = 0;
		this.createDefaultChannels();
		PushNotification.getApplicationIconBadgeNumber(function (number) {
			if (number > 0)
				PushNotification.setApplicationIconBadgeNumber(0);
		});
	}

	configure = onOpenNotification => {
		PushNotification.configure({
			onNotification: function (notification) {
				if (notification?.data)
					notification.userInteraction && onOpenNotification(notification.data);
			},
			permissions: {
				alert: true,
				badge: true,
				sound: true,
			},
			popInitialNotification: true,
			requestPermissions: true,
		});
	};

	createDefaultChannels() {
		this.createChannel({
			channelId: 'default-channel-id',
			channelName: 'Default channell',
			channelDescription: 'A default channel',
			soundName: 'default',
		});
		this.createChannel({
			channelId: 'sound-channel-id',
			channelName: 'Sound channel',
			channelDescription: 'A sound channel',
			soundName: 'sample.mp3',
		});
	}

	createChannel = ({channelId, channelName, channelDescription, soundName}) => {
		PushNotification.createChannel(
			{
				channelId: channelId || 'default-channel-id',
				channelName:channelName || 'Default channel',
				channelDescription: channelDescription || 'A default channel',
				soundName: soundName || 'default',
				vibrate: true,
			},
			created => {
				console.log(`createChannel returned '${created}'`);
			},
		);
	}

	unregister = () => {
		PushNotification.unregister();
	};

	showNotificationIOS = ({id = 'roads', title = 'title', body = 'message', data = {}}) => {
		PushNotificationIOS.addNotificationRequest({
			id: id,
			title: title,
			body: body,
			userInfo: data,
		});
	};

	showNotification = ({id, title, body, android, data = {}, options = {}}) => {
		const ops = options;
		ops.channelId && this.createChannel({
			channelId: ops.channelId,
			channelName: ops.channelName,
			soundName: 'default',
			vibrate: true,
		});
		PushNotification.localNotification({
			...this.buildAndroidNotification(id, title, body, data, options),
			title: title || '',
			message: body || '',
			playSound: ops.playSound || false,
			soundName: ops.soundName || 'default',
			userInteraction: false,
			channelId: ops.channelId || 'default-channel-id',
			badge: true,
		});
	};

	buildAndroidNotification = (
		id,
		title,
		message,
		data = {},
		options = {},
	) => {
		return {
			id: id,
			autoCancel: true,
			largeIcon: options.largeIcon || 'ic_launcher',
			smallIcon: options.smallIcon || 'ic_notification',
			bigText: message || '',
			subText: title || '',
			vibrate: options.vibrate || true,
			vibration: options.vibration || 300,
			priority: options.priority || 'high',
			importance: options.importance || 'high',
			data: data,
		};
	};

	cancelAllLocalNotifications = () => {
		PushNotification.cancelAllLocalNotifications();
	};

	removeDeliveredNotificationByID = notificationId => {
		PushNotification.cancelLocalNotifications({id: `${notificationId}`});
	};
}

export const localNotificationService = new LocalNotificationService();
