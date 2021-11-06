import { StyleSheet } from 'react-native';


export const styles = StyleSheet.create({
	areaWrapper:
	{
		flex: 1,
		backgroundColor: '#FFF',
	},
	header:
	{
		flexDirection: 'row',
		justifyContent: 'flex-end',
		alignItems: 'center',
		marginTop: 18,
		marginBottom: 25,
		paddingHorizontal: 16,
	},
	container:
	{
		flex: 1,
	},
	containerContent:
	{
		paddingHorizontal: 16,
		paddingBottom: 50,
	},
	driverCard:
	{
		marginBottom: 15,
		flexDirection: 'row',
		borderRadius: 10,
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingLeft: 15,
		paddingRight: 10,
		paddingVertical: 15,
		backgroundColor: '#F4F6F6',
	},
	driverCardContent:
	{
		borderRadius: 10,
		flexDirection: 'row',
		flex: 1
	},
	avatar:
	{
		width: 46,
		height: 46,
		borderRadius: 46,
	},
	information:
	{
		flex: 1,
		marginLeft: 10,
		flexDirection: 'column',
		justifyContent: 'center',
		overflow: 'hidden',
	},
	name:
	{
		color: '#2E394B',
		fontSize: 18,
	},
	price:
	{
		color: '#81858C',
		fontSize: 16,
		fontFamily: 'Roboto-Medium',
		marginTop: 4,
	},
});
