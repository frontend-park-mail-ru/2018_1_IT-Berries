'use strict';

const path = require('path');
const express = require('express');
const body = require('body-parser');
const cookie = require('cookie-parser');
const morgan = require('morgan');
const debug = require('debug');
const uuid = require('uuid/v4');

const logger = debug('mylogger');
logger('Starting app');
const app = express();


app.use(morgan('dev'));
app.use(express.static(path.resolve(__dirname, '..', 'public')));
app.use(body.json());
app.use(cookie());


const users = {
	'ivan.nemshilov@park.mail.ru': {
		username: 'Ivan',
		email: 'ivan.nemshilov@park.mail.ru',
		password: 'password',
		score: 72
	},
	'igor.drujinin@park.mail.ru': {
		username: 'Igor',
		email: 'igor.drujinin@park.mail.ru',
		password: 'password',
		score: 100500
	},
	'anastasia.puchina@park.mail.ru': {
		username: 'Anastasia',
		email: 'anastasia.puchina@park.mail.ru',
		password: 'password',
		score: 72
	},
	'elena.oshkina@park.mail.ru': {
		username: 'Elena',
		email: 'elena.oshkina@park.mail.ru',
		password: 'password',
		score: 72
	}
};
const ids = {};

app.post('/signup', function (req, res) {
	const password = req.body.password;
	const email = req.body.email;
	const username = req.body.username;
	if (
		!username ||
		!password || !email ||
		!password.match(/^\S{4,}$/) ||
		!email.match(/@/)
	) {
		return res.status(400).json({error: 'Не валидные данные пользователя'});
	}
	if (users[username]) {
		return res.status(400).json({error: 'Пользователь уже существует'});
	}

	const id = uuid();
	const user = {username, password, email, score: 0};
	ids[id] = email;
	users[email] = user;

	res.cookie('frontend', id, {expires: new Date(Date.now() + 1000 * 60 * 10)});
	res.status(201).json({id});
});

app.post('/login', function (req, res) {
	const password = req.body.password;
	const email = req.body.email;
	if (!password || !email) {
		return res.status(400).json({error: 'Не указан E-Mail или пароль'});
	}
	if (!users[email] || users[email].password !== password) {
		return res.status(400).json({error: 'Не верный E-Mail и/или пароль'});
	}

	const id = uuid();
	ids[id] = email;

	res.cookie('frontend', id, {expires: new Date(Date.now() + 1000 * 60 * 10)});
	res.status(201).json({id});
});

app.get('/me', function (req, res) {
	const id = req.cookies['frontend'];
	const email = ids[id];
	if (!email || !users[email]) {
		return res.status(401).end();
	}

	users[email].score += 1;

	res.json({username: users[email].username});
});

app.get('/users', function (req, res) {
	const scorelist = Object.values(users)
		.sort((l, r) => r.score - l.score)
		.map(user => {
			return {
				username: user.username,
				email: user.email,
				score: user.score
			};
		});

	res.json(scorelist);
});

const port = process.env.PORT || 8080;

app.listen(port, function () {
	logger(`Server listening port ${port}`);
});
