import {StyleSheet} from 'react-native';


export default StyleSheet.create({
	area:
	{
		flex: 1,
		backgroundColor: '#fff',
	},
	wrapper:
	{

	},
	navBar:
	{
		flexDirection: 'row',
		justifyContent: 'space-between',
		paddingHorizontal: 16,
		width: '100%',
		zIndex: 1000,
	},
	container:
	{
		paddingHorizontal: 16,
		paddingBottom: 32,
	},
	infoLine:
	{
		borderBottomWidth: 1,
		borderColor: '#DEDEDE',
	},
	carSideStyle:
	{
		maxWidth: '80%'
	},
	desc:
	{
		marginTop: 10
	},
	shareBtn: {
		marginTop: 45,
	},
	bigBtn:
	{
		marginTop: 15,
	},
});
