const computeImgsCounters = imgsList => {
	return imgsList.reduce(
		(acc, img) => {
			if (img.uri.startsWith('https')) {
				acc.upload += 1;
				return acc;
			}
			acc.local += 1;
			return acc;
		},
		{local: 0, upload: 0},
	);
};

export const imgDecrement = (imgsList, oldImages, newImages) => {
	const imgsCounter = computeImgsCounters(imgsList);
	const imgsNames = imgsList.map(el => el.name);
	let newOldImages = []
	let filteredImages = []

	if (imgsCounter.upload < oldImages.length) {
		newOldImages = oldImages.map(img => {
			if (!imgsNames.includes(img.upName)) {
				img.delete = true;
				img.noShow = true;
			}
			return img;
		});
	}
	if (imgsCounter.local < newImages.length) {
		filteredImages = newImages.filter(img =>
			imgsList.includes(img),
		);
	}
	return [newOldImages, filteredImages]
};

export const imgIncrement = (imgsList, images) => {
	return imgsList.filter(img => !images.includes(img));
};
