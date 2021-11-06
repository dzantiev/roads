import { StyleSheet, NativeModules } from 'react-native';

const { StatusBarManager } = NativeModules;
const STATUSBAR_HEIGHT = StatusBarManager.HEIGHT;

export default StyleSheet.create({
	container:
	{
		backgroundColor: '#2E394B',
		height: '100%',
		justifyContent: 'center',
		alignItems: 'center',
		position: 'relative',
	},
	modalWrapper:
	{
		margin: 0,
	},
	slide:
	{
		alignItems: 'center',
		justifyContent: 'center',
		flex: 1,
	},
	text:
	{
		fontStyle: 'normal',
		fontWeight: 'normal',
		fontSize: 15,
		lineHeight: 18,
		textAlign: 'center',
		color: '#FFFFFF',
	},
	wr:
	{
		alignItems: 'center',
		justifyContent: 'center',
		borderWidth: 1,
		borderColor: '#fff',
	},
	closeBtn:
	{
		position: 'absolute',
		alignItems: 'flex-end',
		top: -5,
		right: 16,
		height: 100,
		width: 100,
	},
	slideImg:
	{
		height: '100%',
		width: '100%',
		resizeMode: 'contain',
		flex: 1,
	},
	head:
	{
		flexDirection: 'row',
		position: 'absolute',
		justifyContent: 'center',
		alignItems: 'center',
		width: '100%',
		top: STATUSBAR_HEIGHT + 10,
		zIndex: 1,
	},
	slideWr:
	{
		flex: 1,
		backgroundColor: 'gray',
		width: '100%',
	},
});
