export const expectToBeVisible = async (id, time) => {
	try {
		time
			? await waitFor(expect(element(by.id(id)))).toBeVisible().withTimeout(time)
			: await expect(element(by.id(id))).toBeVisible();
		return true;
	} catch (e) {
		return false;
	}
};

export const scroller = async (target, view, direction) => {
	await waitFor(element(by.id(target)))
		.toBeVisible()
		.whileElement(by.id(view))
		.scroll(50, direction);
}
