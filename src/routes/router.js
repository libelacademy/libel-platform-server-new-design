/** @format */

import { Router } from 'express';
import fs from 'fs';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const router = Router();

const routesPath = dirname(fileURLToPath(import.meta.url));
const routes = fs.readdirSync(routesPath);

routes.forEach((route) => {
	if (route !== 'router.js') {
		const routeName = route.split('.')[0];
		import(`./${route}`).then((module) => {
      console.log(`Route ${routeName} loaded`);
			router.use(`/${routeName}`, module.default);
		});
	}
});

export default router;
