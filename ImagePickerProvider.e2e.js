function launchImageLibrary(options, callback) {
	if (typeof options === 'function') {
		callback = options;
	}

	const path = 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%3Fid%3DOIP.kPoJSFzEHGULPIe4o5u2SQHaFj%26pid%3DApi&f=1'

	callback({"assets": [{"fileName": 'external-content.duckduckgo.com.jpeg', "type": "image/jpeg", "uri": path, }]});
}
export default launchImageLibrary;
