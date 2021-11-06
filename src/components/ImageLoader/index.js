import React, {useState, useEffect, memo} from 'react';
import {TouchableOpacity, View, Image} from 'react-native';
import AppText from '../AppText';
import styles from './styles';
import {PlusRegularSvg, XSvg} from '../../svg';
// import {launchImageLibrary} from 'react-native-image-picker';
import launchImageLibrary from '../../../ImagePickerProvider';
// import launchImageLibrary from '../../../ImagePickerProvider.e2e';

const ImageLoader = ({
	filesArray = [],
	caption = 'Загрузить фото',
	maxImages = 5,
	style,
	onChangeFiles,
	prop,
	error,
	quality = 0.8,
	maxWidth = 1280,
	maxHeight = 1280,
	testID
}) => {
	const [files, setFiles] = useState(filesArray);

	useEffect(() => {
		onChangeFiles && onChangeFiles(files, prop);
	}, [files]);

	const addFiles = photosList => {
		const currentPhotosList = photosList.map((photo, i) => {
			return {
				id: files.length + i + 1,
				name: photo.fileName,
				uri: photo.uri,
			};
		});
		setFiles([...files, ...currentPhotosList]);
	};

	const removeFile = id => {
		const idx = files.findIndex(el => el.id === id);
		const before = files.slice(0, idx);
		const after = files.slice(idx + 1);
		const newArray = [...before, ...after];
		setFiles(newArray);
	};

	const renderItem = (item, index) => {
		return (
			<View key={index} style={styles.photoItem}>
				<View style={styles.photoWrapper}>
					<Image style={styles.photo} source={{uri: item.uri}} />
					<AppText
						ellipsizeMode={'middle'}
						numberOfLines={1}
						style={styles.photoName}>
						{item.name}
					</AppText>
				</View>
				<TouchableOpacity
					style={styles.removeBtn}
					onPress={() => removeFile(item.id)}
					activeOpacity={0.7}>
					<XSvg height={16} width={16} />
				</TouchableOpacity>
			</View>
		);
	};

	const imagePickerOptions = {
		mediaType: 'photo',
		selectionLimit: maxImages,
		quality,
		maxWidth,
		maxHeight,
	}

	return (
		<View
			style={{
				...styles.loaderWrapper,
				...(error ? {...style, ...styles.error} : style),
			}}
		>
			{error && <AppText style={styles.errorMsg}>{error}</AppText>}
			{files.map((item, index) => renderItem(item, index))}
			<TouchableOpacity
				testID={testID}
				disabled={maxImages > files.length ? false : true}
				style={styles.loadBtn}
				activeOpacity={0.7}
				onPress={() => {
					launchImageLibrary(imagePickerOptions, response => {
						console.log('response', response)
						if (response.didCancel) return;
						addFiles(
							response.assets.slice(
								0,
								maxImages - files.length,
							),
						);
					});
				}}>
				<AppText style={styles.btnText}>{caption}</AppText>
				<View style={styles.plusSvgWrapper}>
					<PlusRegularSvg height={21} width={21} />
				</View>
			</TouchableOpacity>
		</View>
	);
};

export default memo(ImageLoader);
