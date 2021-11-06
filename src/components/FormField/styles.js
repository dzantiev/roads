import { StyleSheet, Dimensions } from 'react-native';
export default StyleSheet.create({
	bottomLine:
	{
		borderBottomWidth: 1,
		borderBottomColor: '#DEDEDE',
	},
	wr:
	{
		flex: 1,
		paddingVertical: 15,
		paddingRight: 17,
		flexDirection: 'row',
		alignItems: 'center',
	},
	textAreaWr:
	{
		paddingVertical: 15,
		paddingRight: 17,
		flexDirection: 'row',
		alignItems: 'center',
	},
	placeholder:
	{
		fontStyle: 'normal',
		fontWeight: 'normal',
		fontSize: 14,
		color: '#81858C',
	},
	spaceBetween: {
		justifyContent: 'space-between',
	},
	touchPlaceholder:
	{
		fontSize: 18,
		color: '#81858C',
		maxWidth: '60%',
	},
	touchPlaceholderText:
	{
		fontSize: 18,
		color: '#81858C',
	},
	text: {
		fontSize: 18,
		color: '#2E394B',
	},
	placeholderWr:
	{
		maxWidth: Math.round( (Dimensions.get('window').width - 34) / 2 ) - 5,
		width: 'auto',
		position: 'relative',
	},
	input:
	{
		fontSize: 18,
		color: '#2E394B',
		fontFamily: 'Roboto-Regular',
		flex: 1,
		paddingVertical: 0,
	},
	side:
	{
		width: 'auto',
		maxWidth: Math.round( (Dimensions.get('window').width - 34) / 2 ) - 5,
	},
	rightSide:
	{
		marginLeft: 'auto',
	},
	leftSide:
	{
		marginRight: 'auto',
	},
	selectedText:
	{
		fontSize: 18,
		color: '#2E394B',
	},
	animPlaceholderWr:
	{
		flexDirection: 'row',
		alignItems: 'center',
		position: 'absolute',
	},
	timepickerModal:
	{
		flex: 1,
		margin: 0,
		justifyContent: 'flex-end',
	},
	timepickerModalWr:
	{
		backgroundColor: '#FFF',
	},
	error: {
		borderBottomColor: '#FE693A',
		// zIndex: 1
	},
	errorMsg: {
		zIndex: 100,
		backgroundColor: '#FE693A',
		color: '#fff',
		paddingHorizontal: 7,
		borderBottomLeftRadius: 5,
		position: 'absolute',
		fontSize: 9,
		lineHeight: 11,
		right: 0,
		bottom: -13,
	},
	placeholderContainer:
	{
		width: '100%',
		height: '100%',
		position: 'absolute',
		flexDirection: 'row',
		alignItems: 'flex-end'
	},
	placeholderWrapper:
	{
		height: '100%',
		position: 'absolute',
		justifyContent: 'center',
	},
});
