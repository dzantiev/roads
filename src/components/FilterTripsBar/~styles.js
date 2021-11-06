import {StyleSheet} from 'react-native';

export default StyleSheet.create({
	container: {
		borderRadius: 4,
		overflow: 'hidden',
	},
	firstLine: {
		width: '100%',
		backgroundColor: '#F4F6F6',
		paddingHorizontal: 21,
		paddingVertical: 15,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
	},
	item: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	clearBtn: {
		backgroundColor: '#F4F6F6',
		opacity: 0.7,
		paddingVertical: 12,
	},
	clearBtnText: {
		textAlign: 'center',
		fontSize: 12,
	},
	svg: {
		marginRight: 5,
	},
	text: {
		color: '#2E394B',
		fontSize: 14,
	},
	rate: {
		width: 87,
	},
	cancelText: {
		backgroundColor: '#fff',
		opacity: 1,
	},
	textStyle: {
		textAlign: 'center',
	},
	clickOutSide:
	{
		flex: 1,
		backgroundColor: 'rgba(0, 0, 0, 0.5)',
		justifyContent: 'center',
	},
});
