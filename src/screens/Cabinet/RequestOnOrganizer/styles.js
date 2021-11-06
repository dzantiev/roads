import {StyleSheet, Dimensions} from 'react-native';


export const styles = StyleSheet.create({
	container:
	{
		flex:1,
		backgroundColor: '#fff',
	},
	sectionWr:
	{
		borderBottomWidth: 1,
		borderColor: '#DEDEDE',
		backgroundColor: '#F4F6F6',
		paddingBottom: 10
	},
	info:
	{
		backgroundColor: '#F4F6F6',
		paddingBottom: 10
	},
	sectionTitle:
	{
		fontSize: 16,
		paddingHorizontal: 17,
		paddingTop: 30,
		color: '#81858C',
	},
	sectionSubtitle:
	{
		fontSize: 10,
		lineHeight: 12,
		paddingHorizontal: 17,
		marginTop: 7,
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
	wr:
	{
		backgroundColor: '#F4F6F6',
		flex: 1,
	},
	wrContent: {
		justifyContent: 'space-between',
		flex: 1
	},
	inputsWr:
	{
		backgroundColor: '#fff',
	},
	largeInputEndSection: {
		paddingLeft: 16,
		borderBottomWidth: 1,
		borderBottomColor: '#DEDEDE',
		zIndex: 1
	},
});
