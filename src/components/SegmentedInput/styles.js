import { StyleSheet } from 'react-native';

export default StyleSheet.create({
	wrapper: {
		alignItems: 'center'
	},
	container:
	{
		alignItems: 'center',
		justifyContent: 'space-between',
		flexDirection: 'row',
		width: 240,
	},
	codeInput:
	{
		height: 56,
		width: 45,
		backgroundColor: '#FFFFFF',
		borderRadius: 10,
		lineHeight: 45,
		borderWidth: 1,
		borderColor: 'transparent'
	},
	codeInputText:
	{
		height: 56,
		textAlign: 'center',
		lineHeight: 56,
	},
	input:
	{
		opacity: 0,
		position: 'absolute',
		left: 0,
		top: 0,
		width: '100%',
		height: '100%',
	},
	error: {
		borderColor: '#FE693A',
	},
	errorWrapper: {
		width: 268
	},
	codeError: {
		textAlign: 'right',
		marginTop: 8,
		color: '#FE693A',
		fontSize: 12,
		paddingHorizontal: 30
	}
});
