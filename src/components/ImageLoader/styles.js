import { StyleSheet } from 'react-native';

export default StyleSheet.create({
	loaderWrapper:
	{
		// zIndex: 1,
	},
	loadBtn:
	{
		width: '100%',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
	},
	btnText:
	{
		flex: 11,
		fontSize: 14,
		color: '#2E394B',
	},
	plusSvgWrapper:
	{
		marginVertical: 16,
		flex: 2,
		justifyContent: 'center',
		alignItems: 'center',
	},
	photoItem:
	{
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		borderBottomColor: '#DEDEDE',
		borderBottomWidth: 1,
	},
	loading:
	{
		flex: 1,
		paddingVertical: 15,
		borderBottomColor: '#DEDEDE',
		borderBottomWidth: 1,
	},
	photoWrapper:
	{
		flex: 11,
		marginVertical: 15,
		flexDirection: 'row',
		alignItems: 'center',
	},
	photo:
	{
		width: 18,
		height: 18,
		borderRadius: 2,
	},
	photoName:
	{
		marginLeft: 15,
		fontSize: 14,
		color: '#81858C',
	},
	removeBtn:
	{
		flex: 2,
		justifyContent: 'center',
		alignItems: 'center',
	},
	error:
	{
		borderBottomColor: '#FE693A',
		// borderBottomWidth: 1,
	},
	errorMsg:
	{
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
});
