import { StyleSheet } from 'react-native';

const imgSize = 37;
const imgMargin = 3;

export default StyleSheet.create({
	container:
	{
		borderRadius: imgSize,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
	},
	imgFirst:
	{
		zIndex: 3,
		width: imgSize,
		height: imgSize,
		borderRadius: imgSize,
	},
	imgSecond:
	{
		zIndex: 2,
		marginLeft: (imgSize - imgMargin) * (-1),
		opacity: 0.5,
		width: imgSize,
		height: imgSize,
		borderRadius: imgSize,
	},
	imgThird:
	{
		zIndex: 1,
		marginLeft: (imgSize - imgMargin) * (-1),
		opacity: 0.5,
		width: imgSize,
		height: imgSize,
		borderRadius: imgSize,
	},
});
