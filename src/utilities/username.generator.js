/** @format */

import { generateFromEmail } from 'unique-username-generator';

export default function generateUsername(email) {
	return generateFromEmail(email, 3);
}
