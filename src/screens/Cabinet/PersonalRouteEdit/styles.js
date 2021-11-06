import { StyleSheet } from 'react-native';


export default StyleSheet.create({
	areaWrapper:
	{
		flex: 1,
		justifyContent: 'center',
		backgroundColor: '#FFF',
	},
	container:
	{
		flex: 1,
		backgroundColor: '#F4F6F6',
	},
	contentContainer:
	{
		flexGrow: 1,
	},
	contentGroup:
	{
		flex: 1,
		marginBottom: 50
	},
	timeGroup:
	{
		flexDirection: 'row',
	},
	header:
	{

	},
	section:
	{
		borderBottomWidth: 1,
		borderColor: '#DEDEDE',
	},
	sectionTitle:
	{
		paddingHorizontal: 17,
		paddingTop: 30,
		paddingBottom: 10,
		color: '#81858C',
	},
	endSection:
	{
		backgroundColor: '#FFF',
		borderBottomWidth: 1,
		borderBottomColor: '#DEDEDE',
	},
	textInput:
	{
		// backgroundColor: '#FFF',
		paddingLeft: 17,
		zIndex: -1
	},
	endTextInput: {
		paddingLeft: 17,
		// zIndex: -1,
		backgroundColor: '#FFF',
		borderBottomWidth: 1,
		borderBottomColor: '#DEDEDE',
	},
	endTextInputZ1: {
		paddingLeft: 17,
		backgroundColor: '#FFF',
		borderBottomWidth: 1,
		borderBottomColor: '#DEDEDE',
		zIndex: 1
	},
	endTextInputRow: {
		borderBottomWidth: 1,
		borderBottomColor: '#DEDEDE',
		flex: 1,
		backgroundColor: '#FFF',
		paddingHorizontal: 17,
	},
	defaultInput:
	{
		marginLeft: 17,
		paddingRight: 17,
	},
	textInputRow:
	{
		flex: 1,
		backgroundColor: '#FFF',
		paddingHorizontal: 17,
	},
	price:
	{
		backgroundColor: '#FFF',
		paddingHorizontal: 17,
	},
	discription:
	{
		backgroundColor: '#FFF',
		paddingHorizontal: 17,
		// paddingVertical: 0,
		borderBottomWidth: 1,
		borderColor: '#DEDEDE',
		// marginBottom: 50
		// height: 100
	},
	textAreaStyle:
	{
		paddingVertical: 10
	},
	deleteBtn: {
		marginBottom: 37,
	},
	delText:
	{
		fontSize: 18,
		color: '#FE693A',
	},
	error: {
		borderBottomColor: '#FE693A',
	},
	errorMsg: {
		backgroundColor: '#FE693A',
		color: '#fff',
		paddingHorizontal: 7,
		borderBottomLeftRadius: 5,
		position: 'absolute',
		fontSize: 9,
		lineHeight: 11,
		right: 0,
		bottom: -13
	},
	pl17: {
		paddingLeft: 17
	},
	z2: {
		zIndex: 2
	},
	bn13: {
		bottom: -13
	}
});
