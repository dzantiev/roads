import { StyleSheet } from 'react-native';

export default StyleSheet.create({
	container:
	{
		width: '100%',
		backgroundColor: '#F4F6F6',
		borderRadius: 10,
		overflow: 'hidden',
		flexDirection: 'row',
		height: 163,
	},
	wrapper:
	{
		paddingVertical: 8,
		paddingHorizontal: 10,
		flex: 1,
	},
	routeImageWrap:
	{
		height: '100%',
		width: 100,
	},
	routeImage:
	{
		height: '100%',
		width: '100%',
		resizeMode: 'cover',
	},
	row:
	{
		flexDirection: 'row',
		alignItems: 'center',
		overflow: 'hidden'
	},
	firstRow:
	{
		marginBottom: 5,
	},
	grayText:
	{
		fontSize: 10,
		lineHeight: 12,
		color: '#81858C',
	},
	grayTextUpper:
	{
		fontSize: 11,
		lineHeight: 13,
		color: '#81858C',
		textTransform: 'uppercase',
		fontFamily: 'Roboto-Medium',
	},
	title:
	{
		fontSize: 14,
		lineHeight: 16,
		marginBottom: 4,
		color: '#2E394B',
	},
	description:
	{
		fontSize: 10,
		lineHeight: 12,
		color: '#81858C',
		marginBottom: 6,
	},
	driverFace:
	{
		width: 14,
		height: 14,
		borderRadius: 7,
		marginRight: 5,
	},
	driverName:
	{
		fontSize: 10,
		lineHeight: 12,
		fontFamily: 'Roboto-Medium',
		color: '#2E394B',
		maxWidth: '90%'
	},
	footer:
	{
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'flex-end',
	},
	price:
	{
		fontSize: 12,
		lineHeight: 14,
		alignSelf: 'flex-end',
		color: '#2E394B',
	},
});
