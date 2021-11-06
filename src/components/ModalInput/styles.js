import {StyleSheet} from 'react-native';

export default StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'flex-end',
		margin: 0,
	},
	modalView: {
		backgroundColor: '#FFF',
		borderTopLeftRadius: 20,
		borderTopRightRadius: 20,
		paddingTop: 11,
		paddingHorizontal: 16,
		paddingBottom: 26,
	},
	rectangle: {
		maxWidth: '15%',
		width: 50,
		height: 4,
		borderRadius: 100,
		backgroundColor: 'rgba(25, 28, 33, 0.1)',
		alignSelf: 'center',
		marginBottom: 19,
	},
	icons: {
		marginRight: 7,
	},
	title: {
		fontFamily: 'Roboto-Bold',
		color: '#81858C',
		fontSize: 18,
		marginBottom: 12,
	},
	textArea: {
		paddingVertical: 0,
		alignItems: 'flex-start',
		lineHeight: 12,
		paddingRight: 0,
		marginBottom: 12,
	},
	textAreaInput: {
		minHeight: 76,
		maxHeight: 200,
		fontSize: 14,
		lineHeight: 16,
	},
	bigBtn: {
		marginHorizontal: 28,
	},
});
