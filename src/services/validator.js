export const saveFieldValue = (def, field, value) => {
	def({...field, value, status: false});

	if (!Array.isArray(value)) {
		field?.rules.every(rule => {
			const text = rule(value);
			if (typeof text === 'string') {
				def({...field, value, text, status: true});
				return false;
			}
			return true;
		});
	}
};

export const validator = fields => {
	const errors = [];
	fields.forEach(el => {
		el.field.rules.every(rule => {
			const text = rule(el.field.value);
			if (typeof text === 'string') {
				el.func({...el.field, status: true, text});
				errors.push(el);
				return false;
			}
			return true;
		});
	});
	// return !errors.length;
	return errors
};
