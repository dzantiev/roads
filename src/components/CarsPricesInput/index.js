import React, { useState, useEffect } from 'react';
import styles from './styles';
import { MapSvg, PlusRegularSvg, XSvg } from '../../svg';
import { View, TouchableOpacity, TextInput } from 'react-native';
import AppText from '../../components/AppText/index.js';


const CarsPricesInput = ({ onPointsChange, pointsArray = [], title = 'Добавить тачку', style, error }) =>
{
	const [cars, setCars] = useState(pointsArray);

	useEffect(() =>
	{
		onPointsChange && onPointsChange(cars);
	}, [cars]);

	const addCar = () =>
	{
		if (cars[cars.length - 1]?.value === '')
			return;
		const currentId = cars.length - 1 < 0 ? 0 : cars[cars.length - 1].id;
		setCars([...cars, {
			id: currentId + 1,
			value: '',
		}]);
	};

	const removeCar = (id) =>
	{
		const idx = cars.findIndex((el) => el.id === id);
		const before = cars.slice(0, idx);
		const after = cars.slice(idx + 1);
		const newArray = [...before, ...after];
		setCars(newArray);
	};

	const onPointInput = (val, id) =>
	{
		const idx = cars.findIndex((el) => el.id === id);
		const oldItem = cars[idx];
		const newItem = {...oldItem, value: val};
		const before = cars.slice(0, idx);
		const after = cars.slice(idx + 1);
		const newArray = [...before, newItem, ...after];
		setCars(newArray);
	};

	const renderItem = (item, index) =>
	{
		return (
			<View style={styles.pointsInputRow} key={`point${index}`}>
				<MapSvg width={16} height={16}/>
				<TextInput
					style={styles.pointInput}
					value={item.value}
					autoCorrect={false}
					autoFocus={item.value ? false : true}
					onChangeText={(val) => onPointInput(val, item.id)}
				/>
				<TouchableOpacity
					style={styles.removePointBtn}
					onPress={() => removeCar(item.id)}
					activeOpacity={0.7}
				>
					<XSvg width={16} height={16}/>
				</TouchableOpacity>
			</View>
		);
	};

	return (
		<View style={{...styles.pointsInputWrapper, ...(error ? {...style, ...styles.error} : style)}}>
			{error && <AppText style={styles.errorMsg}>{error}</AppText>}
			{cars.map((item, index) => renderItem(item, index))}
			<TouchableOpacity
				style={styles.addPointBtn}
				onPress={addCar}
				activeOpacity={0.7}
			>
				<AppText style={styles.addPointText}>{title}</AppText>
				<PlusRegularSvg width={21} height={21}/>
			</TouchableOpacity>
		</View>
	);
};

export default CarsPricesInput;
