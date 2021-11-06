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
		// paddingHorizontal: 16,
	},
	rectangleWrap: {
		paddingVertical: 20,
		width: '100%',
	},
	rectangle: {
		maxWidth: '15%',
		width: 50,
		height: 4,
		borderRadius: 100,
		backgroundColor: 'rgba(25, 28, 33, 0.1)',
		alignSelf: 'center',
	},
	contentWrapper: {
		// marginTop: 20,
		marginBottom: 30,
		paddingHorizontal: 16
	},
	item: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingVertical: 10,
		borderBottomWidth: 1,
		borderBottomColor: '#F4F6F6',
	},
	itemText: {
		color: '#2E394B',
		fontSize: 18,
	},
	icons: {
		marginRight: 7,
	},
});
