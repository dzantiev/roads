import React, {useState, useEffect, useRef, memo} from 'react';
import {
	View,
	Dimensions,
	Animated,
	Image,
	ScrollView,
	TouchableOpacity,
} from 'react-native';
import AppText from '../AppText';
import styles from './styles.js';

const PreviewSlider =  ({
	children,
	style,
	slides,
	onPress,
	isNumberPagination,
	scrollViewTestID = 'scrollView',
	paginationNumStyle
}) =>
{
	const [width, setWidth] = useState(250);
	const [activeSlide, setActiveSlide] = useState(() => 0);
	const scrollA = useRef(new Animated.Value(0)).current;
	// const scrollX = useRef(new Animated.Value(0)).current;
	const sliderRef = useRef();
	useEffect(() =>
	{
		setWidth(Dimensions.get('window').width);
		Dimensions.addEventListener('change', () =>
		{
			try
			{
				setWidth(Dimensions.get('window').width);
			}
			catch (e)
			{}
		});
	}, []);

	useEffect(() =>
	{
		setTimeout(() =>
		{
			goToSlide(activeSlide);
		}, 0);
	}, [width]);

	const PaginationDots = () =>
	{
		return (
			<View style={styles.paginationWr}>
				{slides.map((el, i) =>
				{
					return (
						<TouchableOpacity
							key={i}
							activeOpacity={0.7}
							style={
								+activeSlide === +i
									? styles.paginationItemActive
									: styles.paginationItem
							}
							onPress={() => goToSlide(i)}
						></TouchableOpacity>
					);
				})}
			</View>
		);
	};

	const PaginationNumber = () =>
	{
		const imgsLength = slides.length;
		return (
			<View style={{...styles.paginationNumberWr, ...paginationNumStyle}}>
				<AppText style={styles.paginationText}>
					{`${+activeSlide + 1}/${imgsLength}`}
				</AppText>
			</View>
		);
	};

	const Pagination = () => {
		return isNumberPagination
			? PaginationNumber()
			: PaginationDots();
	}

	const goToSlide = (slide) =>
	{
		sliderRef.current.scrollTo({x: slide * width});
	};

	const renderItem = (item, i) =>
	{
		return (
			<View style={styles.slide} key={i}>
				<TouchableOpacity
					testID={`slide${i}`}
					onPress={() => onPress && onPress(activeSlide)}
					activeOpacity={0.7}
					style={{...styles.slideWr, width: width}}>
					<Image source={{uri: item}} style={styles.slideImg} />
				</TouchableOpacity>
			</View>
		);
	};

	const changeActiveSlider = sX =>
	{
		setActiveSlide((Math.abs(sX / width) + 1).toFixed(0) - 1);
	};

	return (
		<Animated.ScrollView
			testID={scrollViewTestID}
			style={{...styles.stretchyHeader, ...style}}
			onScroll={Animated.event(
				[{nativeEvent:
					{contentOffset:
					{y: scrollA}}}],
				{useNativeDriver: true},
			)}
			scrollEventThrottle={16}>
			<Animated.View style={styles.stretchyHeaderTop(scrollA)}>
				{children.length > 1 && children[0]}
			</Animated.View>
			<View>
				<View style={styles.container}>

					<Animated.View style={styles.wr(scrollA)}>
						<ScrollView
							ref={sliderRef}
							onScroll={e =>
								changeActiveSlider(
									e.nativeEvent.contentOffset.x,
								)
							}
							contentContainerStyle={{
								width: `${100 * slides.length}%`,
							}}
							style={{width: width}}
							horizontal={true}
							showsHorizontalScrollIndicator={false}
							snapToInterval={width}
							decelerationRate={'fast'}
							scrollEventThrottle={5}>
							{slides.map((el, i) => renderItem(el, i))}
						</ScrollView>

						{slides.length > 1 && <Pagination />}
					</Animated.View>
				</View>
				<View>
					{children.length > 1
						? children[1]
						: children}
				</View>
			</View>
		</Animated.ScrollView>
	);
};

export default memo(PreviewSlider);
