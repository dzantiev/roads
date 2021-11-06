import React from 'react';
// import {connect} from 'react-redux';
import {
	SafeAreaView,
	View,
	Image,
	TouchableOpacity,
	Text,
	TextInput,
	ScrollView,
} from 'react-native';
import {styles} from './styles';
import {AppText} from '../../components';
import {AddFile, MessageStatusReceived, SendMessageArrow} from '../../svg';

const img = require('../../img/support-avatar.jpg');

const Chat = () => {
	const mockMessages = [
		{
			text: 'Привет, как дела ?',
			time: '17:30',
			senderName: 'support',
			senderImage: img,
		},
		{
			text: 'На текущий момент может енкорректно отображаться баланс рублевой секции брокерсокго счета, из зачего общий баланс тоже может быть меньше обычного. Мы знаем о ситуации, и уже занимаемся её исправлением, исправим до 12:00. Извините за доставленные неудобства.',
			time: '17:30',
			senderName: 'support',
			senderImage: img,
		},
		{
			text: 'Здравствуйте! У вас израсходован лимит на снятие наличных без комиссии, он составляет 100 000 рублей за расчётный период. Поэтому и списали комиссию. Следить за лимитами можете в приложении. Нажмите на строку "счёт" - шестерёнка в правом верхнем углу - тарифные лимиты.',
			time: '17:30',
			senderName: 'me',
			senderImage: img,
		},
		{
			text: '',
			time: '17:30',
			senderName: 'me',
			senderImage: img,
			filesList: ['img','file'],
		},
	];
	const Header = () => {
		return (
			<View style={styles.header}>
				<Image style={styles.headerImage} source={img} />

				<View style={styles.headerTextContaienr}>
					<AppText style={styles.headerTitle}>Поддержка</AppText>
					<AppText style={styles.headerTime}>Мы рядом 24/7</AppText>
				</View>
			</View>
		);
	};

	const SendMessageContainer = () => {
		return (
			<View style={styles.sendMessageContainer}>
				<TouchableOpacity>
					<View style={[styles.sendMessageBtn, styles.addFileBtn]}>
						<AddFile />
					</View>
				</TouchableOpacity>
				<View style={styles.sendMessageInputContainer}>
					<TextInput
						style={styles.sendMessageInput}
						multiline={true}
						placeholder="Сообщение..."
						textAlignVertical="top"
						numberOfLines={5}
					/>
				</View>

				<TouchableOpacity>
					<View style={styles.sendMessageBtn}>
						<SendMessageArrow />
					</View>
				</TouchableOpacity>
			</View>
		);
	};

	const Message = ({message}) => {
		const {senderName, text, senderImage, time, status, filesList} =
			message;
		const messageStyle = [styles.message];
		const messageTextStyle = [styles.messageText];
		const messageContentStyle = [styles.messageContent];
		const messageTimeStyle = [styles.messageTime];
		const messageInfoStyle = [styles.messageInfo];

		if (filesList) {
			messageInfoStyle.push({
				alignSelf: 'flex-end',
			});
		}

		let senderAvatar = (
			<Image style={styles.messageAvatar} source={senderImage} />
		);
		let messageStatus = null;
		const MakeFile = ({file}) => {
			if (file === 'img') {
				return <Image source={img} style={styles.messageFile} />;
			} else if (file === 'file') {
				return <Image source={img} style={styles.messageFile} />;
			}
			return null;
		};
		let files = filesList ? (
			<View style={styles.filesContainer}>
				{filesList.map((el, i) => (
					<MakeFile key={i} file={el} />
				))}
			</View>
		) : null;

		if (senderName === 'me') {
			messageStyle.push(styles.myMessage);
			messageTextStyle.push(styles.myMessageText);
			messageContentStyle.push(styles.myMessageContent);
			messageTimeStyle.push(styles.myMessageTime);
			senderAvatar = null;
			messageStatus = (
				<MessageStatusReceived style={styles.messageStatus} />
			);
		}

		return (
			<View style={messageStyle}>
				{senderAvatar}
				<View style={messageContentStyle}>
					{files || <Text style={messageTextStyle}>{text}</Text>}
					<View style={messageInfoStyle}>
						<Text style={messageTimeStyle}>{time}</Text>
						{messageStatus}
					</View>
				</View>
			</View>
		);
	};

	return (
		<SafeAreaView style={styles.areaWrapper}>
			<Header />
			<ScrollView
				contentContainerStyle={styles.messages}
				showsVerticalScrollIndicator={false}>
				<AppText style={styles.date}>25 сент. 2021</AppText>
				<Message message={mockMessages[0]} />
				<Message message={mockMessages[1]} />
				<AppText style={styles.date}>Сегодня</AppText>
				<Message message={mockMessages[2]} />
				<Message message={mockMessages[3]} />
				<Message message={mockMessages[0]} />
				<Message message={mockMessages[0]} />
			</ScrollView>
			<SendMessageContainer />
		</SafeAreaView>
	);
};

// const mapDispatchToProps = dispatch => {
// 	return {
// 		// FETCH_DRIVERS: args => dispatch(fetchDrivers(args)),
// 	};
// };

// export default connect(null, mapDispatchToProps)(Chat);
export default Chat;
