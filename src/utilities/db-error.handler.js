/** @format */

export default class DbErrorHandler {
	static getErrorMessage(error) {
		const { code, keyPattern } = error;
		if (code === 11000) {
			const key = Object.keys(keyPattern)[0];
			return `${
				key.charAt(0).toUpperCase() + key.slice(1)
			} already exists`;
		}

		if (error.name === 'ValidationError') {
			console.log(error);
			const messages = Object.values(error.errors).map(
				(val) =>
					`${
						val.properties.path.charAt(0).toUpperCase() +
						val.properties.path.slice(1)
					} is required`,
			);
			return error.message.split(': ').pop();
		}

		if (error.name === 'CastError') {
			return 'User not found';
		}

		return error.message;
	}

	static getErrorStatusCode(error) {
		const { code } = error;
		if (code === 11000) {
			return 409;
		}

		if (error.name === 'ValidationError') {
			return 400;
		}

		if (error.name === 'CastError') {
			return 404;
		}

		return 500;
	}
}
