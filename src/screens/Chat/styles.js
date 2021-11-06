import {StyleSheet, Dimensions} from 'react-native';
const screen = Dimensions.get('screen');
const modelWidth = 375;
const textColorBlack = '#2E394B';
const textColorGray = '#81858C';

const messageMaxWidth = screen.width / (modelWidth / 248);
const messageMinWidth = screen.width / (modelWidth / 208);
const sendMessageBtnSize = 34;

export const styles = StyleSheet.create({
	areaWrapper: {
		flex: 1,
		backgroundColor: '#FFF',
	},
	header: {
		flexDirection: 'row',
		justifyContent: 'flex-start',
		alignItems: 'center',
		paddingVertical: 15,
		paddingTop: 15,
		paddingBottom: 16,
		paddingHorizontal: 16,
		borderBottomColor: 'rgba(222, 222, 222, 0.4)',
		borderBottomWidth: 1,
	},
	headerImage: {
		width: 35,
		height: 35,
		borderRadius: 35,
	},
	headerTime: {
		fontSize: 10,
		lineHeight: 12,
		color: textColorBlack,
	},
	headerTitle: {
		fontFamily: 'Roboto-Medium',
		fontSize: 14,
		lineHeight: 16,
		color: textColorBlack,
		marginBottom: 3,
	},
	headerTextContaienr: {
		marginLeft: 14,
	},
	container: {
		flex: 1,
	},
	date: {
		color: textColorGray,
		marginBottom: 10,
	},
	messages: {
		alignItems: 'center',
		marginHorizontal: 18,
		flexDirection: 'column',
		paddingTop: 29,
	},
	message: {
		flexDirection: 'row',
		alignItems: 'flex-end',
		alignSelf: 'flex-start',
		marginBottom: 10,
	},
	messageContent: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		alignItems: 'center',
		padding: 10,
		backgroundColor: 'rgba(118, 168, 41, 0.1)',
		marginLeft: 6,
		borderRadius: 7,
		maxWidth: messageMaxWidth,
		minWidth: messageMinWidth,
	},
	messageText: {
		paddingRight: 5,
		// backgroundColor: 'green'
	},
	messageFile: {
		width: 69,
		height: 69,
		borderRadius: 5,
		marginRight: 9,
		marginTop: 5,
	},
	filesContainer: {
		flexDirection: 'row',
		flexWrap: 'wrap',
	},
	messageAvatar: {
		width: 29,
		height: 29,
		borderRadius: 29,
	},
	messageInfo: {
		flex: 1,
		justifyContent: 'flex-end',
		flexDirection: 'row',
		alignItems: 'center',
		marginLeft: 10,
	},
	messageTime: {
		textAlign: 'right',
		color: textColorGray,
		fontSize: 9,
		lineHeight: 11,
	},
	messageStatus: {
		marginLeft: 4,
	},
	myMessage: {
		alignSelf: 'flex-end',
	},
	myMessageContent: {
		backgroundColor: '#6673EA',
	},
	myMessageText: {
		color: '#ffffff',
	},
	myMessageTime: {
		color: 'rgba(255, 255, 255, 0.8)',
	},
	sendMessageContainer: {
		paddingHorizontal: 10,
		paddingVertical: 7,
		flexDirection: 'row',
		alignItems: 'flex-end',
		justifyContent: 'space-between',
		backgroundColor: '#F0F4F4',
		maxHeight: 120,
	},
	addFileBtn: {
		backgroundColor: 'rgba(222, 222, 222, 0.6)',
	},
	sendMessageInput: {
		fontSize: 14,
		lineHeight: 16,
		backgroundColor: '#fff',
		flex: 1,
		color: textColorBlack,
		minHeight: 16,
	},
	sendMessageInputContainer: {
		backgroundColor: '#fff',
		alignItems: 'center',
		flexDirection: 'row',
		backgroundColor: '#fff',
		flex: 1,
		borderRadius: 28,
		marginHorizontal: 10,
		paddingHorizontal: 17,
		paddingVertical: 8,
		paddingBottom: 12,
	},
	sendMessageBtn: {
		justifyContent: 'center',
		alignItems: 'center',
		width: sendMessageBtnSize,
		height: sendMessageBtnSize,
		backgroundColor: '#91B954',
		borderRadius: sendMessageBtnSize,
		marginBottom: 2,
	},
});
