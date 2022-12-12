/** @format */

import transporter from '../config/nodemailer.js';
import config from '../config/config.js';
import path from 'path';

export default class Emailer {
	constructor() {
		this.transporter = transporter;
		this.imagesFolder = path.resolve('src', 'templates', 'images');
	}

	async welcomeEmail(to, name) {
		const mailOptions = {
			from: '"Libel Academy" <no-reply@libel.academy>',
			to,
			subject: 'Bienvenido a Libel Academy',
			text: `Hola ${name}, te damos la bienvenida a nuestra academia de entrenamiento 3D. Recuerda que con nosotros encontraras el camino para lograr ser especialista en la industria 3D con acompañamiento online en vivo o a tu ritmo.`,
			attachments: [
				{
					filename: 'logo-libel-acdemy.png',
					path: path.resolve(
						this.imagesFolder,
						'logo-libel-acdemy.png',
					),
					cid: 'logo-libel-acdemy',
				},
				{
					filename: 'welcome.jpeg',
					path: path.resolve(this.imagesFolder, 'welcome.jpeg'),
					cid: 'welcome',
				},
			],
			template: 'welcome',
			context: {
				name,
				client: config.client,
				year: new Date().getFullYear(),
			},
		};

		return this.transporter.sendMail(mailOptions);
	}

	async verificationEmail(to, name, token) {
		const mailOptions = {
			from: '"Libel Academy" <no-reply@libel.academy>',
			to,
			subject: 'Verificar Email',
			text: `Hola ${name} Estás casi listo para empezar a disfrutar de Libel Academy.
      Simplemente haga clic en el enalce ${config.client}/auth/verify?token=${token} para verificar su dirección de correo electrónico.`,
			template: 'verify',
			attachments: [
				{
					filename: 'logo-libel-acdemy.png',
					path: path.resolve(
						'./src/templates/images/logo-libel-acdemy.png',
					),
					cid: 'logo-libel-acdemy',
				},
			],
			context: {
				name,
				token,
				client: config.client,
				year: new Date().getFullYear(),
			},
		};
		return this.transporter.sendMail(mailOptions);
	}

	async forgotPasswordEmail(to, name, token) {
		const mailOptions = {
			from: '"Libel Academy" <no-reply@libel.academy>',
			to,
			subject: 'Restablecer Contraseña',
			text: `Hi ${name} Recientemente solicitó restablecer la
      contraseña de su cuenta Libel Academy.Haga clic en el enlace ${config.client}/auth/reset-password?token=${token} para continuar. Si no solicitó un restablecimiento de contraseña, ignore este correo electrónico o responda para informarnos. Este enlace de restablecimiento de contraseña solo es válido durante los próximos 30 minutos.`,
			template: 'forgot-password',
			attachments: [
				{
					filename: 'logo-libel-acdemy.png',
					path: path.resolve(
						'./src/templates/images/logo-libel-acdemy.png',
					),
					cid: 'logo-libel-acdemy',
				},
			],
			context: {
				name,
				token,
				client: config.client,
				year: new Date().getFullYear(),
			},
		};
		return this.transporter.sendMail(mailOptions);
	}

	async resetPasswordEmail(to, name, password) {
		const mailOptions = {
			from: '"Libel Academy" <no-reply@libel.academy>',
			to,
			subject: 'Restablecer Contraseña',
			text: `Hi ${name} Hemos restablecido la contraseña de su cuenta Libel Academy. PasswordÑ ${password}Le recomendamos hacer cambio de esta contraseña cuando vuelva a iniciar sesión en nuetra plataforma.`,
			template: 'reset-password',
			attachments: [
				{
					filename: 'logo-libel-acdemy.png',
					path: path.resolve(
						'./src/templates/images/logo-libel-acdemy.png',
					),
					cid: 'logo-libel-acdemy',
				},
			],
			context: {
				name,
				password,
				year: new Date().getFullYear(),
			},
		};
		return this.transporter.sendMail(mailOptions);
	}

	async deleteAccountEmail(to, name) {
		const mailOptions = {
			from: '"Libel Academy" <no-reply@libel.academy>',
			to,
			subject: 'Cuenta Eliminada',
			text: `Hi ${name} Gracias por ser parte de la comunidad Libel Academy. Tal como solicitó, su cuenta ha sido eliminada con éxito y ya no se guardarán sus datos en nuestras bases de datos. Nos encantaría conocer tu experiencia y cómo crees que podemos mejorar para otros miembros (¡y para ti, si decides volver!)`,
			template: 'delete',
			attachments: [
				{
					filename: 'logo-libel-acdemy.png',
					path: path.resolve(
						'./src/templates/images/logo-libel-acdemy.png',
					),
					cid: 'logo-libel-acdemy',
				},
			],
			context: {
				name,
				year: new Date().getFullYear(),
			},
		};
		return this.transporter.sendMail(mailOptions);
	}
}
