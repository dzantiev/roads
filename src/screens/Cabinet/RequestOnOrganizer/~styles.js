import {StyleSheet, Dimensions} from 'react-native';


export const styles = StyleSheet.create({
	container:
	{
		flex:1,
		backgroundColor: '#fff',
	},
	header:
	{
		backgroundColor: '#fff',
	},
	headerTitle:
	{
		fontStyle: 'normal',
		fontFamily: 'Roboto-Medium',
		fontSize: 15,
		color: '#2E394B',
		marginLeft: 'auto',
		marginRight: 'auto',
		maxWidth: '80%',
	},
	goBack:
	{
		position: 'absolute',
		left: 16,
	},
	sectionWr:
	{
		borderBottomWidth: 1,
		borderColor: '#DEDEDE',
		backgroundColor: '#F4F6F6',
	},
	endSection:
	{
		borderBottomWidth: 1,
		borderBottomColor: '#DEDEDE',
	},
	sectionTitle:
	{
		fontSize: 16,
		paddingHorizontal: 17,
		paddingTop: 30,
		paddingBottom: 10,
		color: '#81858C',
	},
	submit:
	{
		marginTop: 44,
		marginBottom: 60,
		marginLeft: 'auto',
		marginRight: 'auto',
		width: Math.round((Dimensions.get('window').width - 48)),
	},
	defaultInput:
	{
		marginLeft: 16,
		paddingRight: 16,
	},
	largeInput:
	{
		paddingLeft: 16,
	},
	textInputEnd:
	{
		borderBottomColor: '#DEDEDE',
		// borderBottomColor: 'red',
		borderBottomWidth: 1,
	},
	wr:
	{
		backgroundColor: '#F4F6F6',
		flex: 1,
	},
	inputsWr:
	{
		backgroundColor: '#fff',
	},
});
