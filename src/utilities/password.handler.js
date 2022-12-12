/** @format */

import bcrypt from 'bcrypt';

export default class HandlerPassworf {
	static async encryptPassword(password) {
		const salt = await bcrypt.genSalt(10);
		return await bcrypt.hash(password, salt);
	}

	static async comparePassword(password, hash) {
		return await bcrypt.compare(password, hash);
	}
}
