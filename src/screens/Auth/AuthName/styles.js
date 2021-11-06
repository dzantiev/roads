import { StyleSheet } from 'react-native';


export default StyleSheet.create({
	areaWrapper:
	{
		flex: 1,
		justifyContent: 'center',
		backgroundColor: '#F4F6F6',
	},
	container:
	{
		flex: 1,
		paddingVertical: 20,
		paddingHorizontal: 26,
	},
	scrollContainer:
	{
		flexGrow: 1,
	},
	keyboardContainer:
	{
		flex: 1,
		flexDirection: 'column',
		justifyContent: 'center',
	},
	title:
	{
		marginTop: 35,
		marginBottom: 8,
		fontSize: 16,
	},
	input:
	{
		backgroundColor: '#FFFFFF',
		borderRadius: 10,
		padding: 17,
		fontFamily: 'Roboto-Regular',
		fontSize: 16,
		color: '#181818',
	},
	sendBtn:
	{
		marginTop: 35,
	},
});
