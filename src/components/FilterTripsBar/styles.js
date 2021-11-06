import {StyleSheet} from 'react-native';

export default StyleSheet.create({
	container:
	{
		borderRadius: 4,
		overflow: 'hidden',
	},
	activeItem:
	{
		maxWidth: 150,
		paddingVertical: 6,
		paddingHorizontal: 11,
		borderRadius: 32,
		backgroundColor: '#2E394B',
		borderWidth: 1,
		borderColor: '#2E394B',
		marginRight: 9,
	},
	inactiveItem:
	{
		maxWidth: 150,
		paddingVertical: 6,
		paddingHorizontal: 11,
		borderWidth: 1,
		borderColor: '#F4F6F6',
		borderRadius: 32,
		marginRight: 9,
	},
	clearBtn:
	{
		flexDirection: 'row',
		alignItems: 'center',
	},
	closeSvg:
	{
		marginRight: 3,
	},
	activeFilterText:
	{
		fontSize: 12,
		color: '#FFF',
	},
	inactiveFilterText:
	{
		fontSize: 12,
		color: '#81858C',
	},
	textStyle:
	{
		textAlign: 'center',
	},
	clickOutSide:
	{
		flex: 1,
		backgroundColor: 'rgba(0, 0, 0, 0.5)',
		justifyContent: 'center',
	},
});
