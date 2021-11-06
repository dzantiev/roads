import React, {useState, useEffect, memo} from 'react';
import styles from './styles';
import {DotsSvg, PlusRegularSvg, XSvg} from '../../svg';
import {View, TouchableOpacity, TextInput, Dimensions} from 'react-native';
import AppText from '../../components/AppText/index.js';
import DraggableFlatList from 'react-native-draggable-flatlist';


const PointsInput = ({onPointsChange, pointsArray = [], style, error, setScrollEnabled}) => {
	const [points, setPoints] = useState(pointsArray);
	const width = Dimensions.get('window').width;

	useEffect(() => {
		typeof onPointsChange === 'function' && onPointsChange(points);
	}, [points]);

	const addPoint = () => {
		if (points[points.length - 1]?.value === '') return;
		const currentId =
			points.length - 1 < 0
				? 0
				: points.reduce((acc, el) => (acc > el.id ? acc : el.id), 0);
		setPoints([
			...points,
			{
				id: currentId + 1,
				value: '',
			},
		]);
	};

	const removePoint = id => {
		const idx = points.findIndex(el => el.id === id);
		const before = points.slice(0, idx);
		const after = points.slice(idx + 1);
		const newArray = [...before, ...after];
		setPoints(newArray);
	};

	const onPointInput = (val, id) => {
		const idx = points.findIndex(el => el.id === id);
		const oldItem = points[idx];
		const newItem = {...oldItem, value: val};
		const before = points.slice(0, idx);
		const after = points.slice(idx + 1);
		const newArray = [...before, newItem, ...after];
		setPoints(newArray);
	};

	const renderItem = ({ item, index, drag, isActive }) => {
		return (
			<View style={styles.pointsInputRow} key={`pointv${index}`}>
				<TouchableOpacity onLongPress={drag} style={styles.draxPoint}>
					<DotsSvg width={9} height={16} />
				</TouchableOpacity>
				<TextInput
					testID={`pointFialdTestID${index}`}
					style={{...styles.pointInput, ...(isActive && styles.pointInputActive)}}
					value={item.value}
					autoCorrect={false}
					autoFocus={item.value ? false : true}
					onChangeText={val => onPointInput(val, item.id)}
				/>
				<TouchableOpacity
					style={styles.removePointBtn}
					activeOpacity={0.7}
					onPress={() => removePoint(item.id)}>
					<XSvg width={16} height={16} />
				</TouchableOpacity>
			</View>
		);
	};

	return (
		<View
			style={{
				...styles.pointsInputWrapper,
				...(error ? {...style, ...styles.error} : style),
			}}>
			{error && <AppText style={styles.errorMsg}>{error}</AppText>}
			<DraggableFlatList
				scrollEnabled={false}
				dragItemOverflow={false}
				dragHitSlop={{
					right: -(width * 0.95 - 15),
				}}
				data={points}
				renderItem={renderItem}
				keyExtractor={(item, index) => `draggable-item-${index}`}
				onDragEnd={({ data }) => setPoints(data)}
			/>
			<TouchableOpacity
				testID={'addPointTestID'}
				style={styles.addPointBtn}
				onPress={addPoint}
				activeOpacity={0.7}>
				<AppText style={styles.addPointText}>Добавить точку</AppText>
				<PlusRegularSvg width={21} height={21} />
			</TouchableOpacity>
		</View>
	);
};

export default memo(PointsInput);
