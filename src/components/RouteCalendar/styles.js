import {StyleSheet} from 'react-native';

export default StyleSheet.create({
	container: {
	},
	title: {
		fontSize: 18,
		lineHeight: 22,
	},
	subtitle: {
		color: '#81858C',
		fontSize: 14,
		lineHeight: 16,
		marginTop: 1
	},
	scrollContainer: {
		marginTop: 10,
		height: '100%'
	},
	item: {
		width: 53,
		height: '100%',
		marginRight: 11,
		alignItems: 'center',
		justifyContent: 'center',
		borderWidth: 1,
		borderColor: '#F1F3F3',
		borderRadius: 3
	},
	activeItem: {
		backgroundColor: '#2E394B',
	},
	itemDay: {
		fontFamily: 'Roboto-Medium',
	},
	itemSubtitle: {
		fontSize: 8,
		lineHeight: 9,
		marginTop: 5,
		color: '#81858C'
	},
	activeText: {
		color: '#fff'
	},
})
