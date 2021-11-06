import { StyleSheet, Dimensions } from 'react-native';

export default StyleSheet.create({
	container:
	{
		flex: 1,
		backgroundColor: '#fff',
		margin: 0,
	},
	safeArea:
	{
		flex: 1,
		backgroundColor: '#fff',
	},
	head:
	{
		justifyContent: 'flex-end',
		flexDirection: 'row',
		width: '100%',
		position: 'absolute',
		top: 0,
		zIndex: 10,
	},
	wr:
	{
		flex: 1,
	},
	successIcon:
	{
		height: 100,
		width: 100,
		borderRadius: Math.round(Dimensions.get('window').width + Dimensions.get('window').height) / 2,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#F4F6F6',
		marginBottom: 27,
	},
	faultIcon:
	{
		backgroundColor: '#FFE1D8',
	},
	text:
	{
		fontSize: 15,
		lineHeight: 21,
		alignItems: 'center',
		textAlign: 'center',
		color: '#2E394B',
	},
	centerGroup:
	{
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
	},
	closeBtn:
	{
		alignItems: 'flex-end',
		top: 16,
		right: 16,
		zIndex: 10,
		height: 100,
		width: 100,
	},
});
