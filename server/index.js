'use strict';

const path = require('path');
const express = require('express');
const body = require('body-parser');
const cookie = require('cookie-parser');
const morgan = require('morgan');
const debug = require('debug');
const uuid = require('uuid/v4');
const fileUpload = require('express-fileupload');

const logger = debug('mylogger');
logger('Starting app');
const app = express();

/*
* const fs = require('fs');
const pug = require('pug');
logger(path.resolve(__dirname, '/views/index.pug'));
const jsFunctionString = pug.compileFileClient(path.resolve(__dirname, '..', 'public/views/index.pug'), {name: "fancyTemplateFun"});
fs.writeFileSync("templates.js", jsFunctionString);
* */


app.use(morgan('dev'));
app.use(express.static(path.resolve(__dirname, '..', 'public')));
app.use(body.json());
app.use(cookie());
app.use(fileUpload());

const users = {
  'ivan.nemshilov@park.mail.ru': {
    username: 'Ivan',
    email: 'ivan.nemshilov@park.mail.ru',
    password: 'password',
    score: 72,
    avatar: 'Ivan.jpg'
  },
  'igor.drujinin@park.mail.ru': {
    username: 'Igor',
    email: 'igor.drujinin@park.mail.ru',
    password: 'password',
    score: 100500,
    avatar: 'Igor.jpg'
  },
	'anastasia.puchina@park.mail.ru': {
		username: 'Anastasia',
		email: 'anastasia.puchina@park.mail.ru',
		password: 'password',
		score: 72,
		avatar: 'Anastasia.jpg'
	},
	'elena.oshkina@park.mail.ru': {
		username: 'Elena',
		email: 'elena.oshkina@park.mail.ru',
		password: 'password',
		score: 72,
		avatar: 'Elena.jpg'
	}
};
const ids = {};

app.post('/signup', function (req, res) {

	logger('Body:');
	logger(req.body);
	logger('Files:');
	logger(req.files);

	const password = req.body.password;
	const email = req.body.email;
	const username = req.body.username;

	if (
		!username ||
		!password || !email ||
		!password.match(/^\S{4,}$/) ||
		!email.match(/@/)
	) {
    logger('Не валидные данные пользователя');
		return res.status(400).json({error: 'Не валидные данные пользователя'});
	}
	if (users[username]) {
    logger('Пользователь уже существует');
		return res.status(400).json({error: 'Пользователь уже существует'});
	}
	logger('Avatar saving');
  const avatar = req.files.avatar;
  let avatarName = '';
  try {
  	avatarName = avatar.name;
    avatar.mv('./server/avatars/' + avatar.name, function(err) {
      if (err)
        logger(err);
    });
	} catch(err) {
  	avatarName = 'noavatar.png';
	}
  logger('Добавление пользователя');
	const id = uuid();
	const user = {username: username, password: password, email: email, score: 0, avatar: avatarName};
	ids[id] = email;
	users[email] = user;

  res.cookie('frontend', id, {expires: new Date(Date.now() + 1000 * 60 * 10)});
	res.status(201).json({id});
});

app.post('/login', function (req, res) {
	logger(req.body);
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

app.get('/avatar', function (req, res) {
  const id = req.cookies['frontend'];
  const email = ids[id];
  if (!email || !users[email]) {
    return res.status(401).end();
  }

  const avatar = users[email].avatar;

  res.sendFile(path.resolve(__dirname, 'avatars', avatar));
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

app.get('/logout', function (req, res) {
	logger("Выход пользователя");
  let id = req.cookies['frontend'];
  const email = ids[id];
  if (!email || !users[email]) {
    return res.status(401).end();
  }
  logger("Пользователь вышел");
  ids[id] = '';
  id = uuid();
  ids[id] = email;
  res.status(202).end();
});

app.get('/profile-data', function (req, res) {
  const id = req.cookies['frontend'];
  const email = ids[id];
  if (!email || !users[email]) {
    return res.status(401).end();
  }

  res.json({username: users[email].username, email: email, score: users[email].score});
});

app.get('/runtime.js', function (req, res) {
  res.sendFile(path.resolve(__dirname, '..', 'node_modules', 'regenerator-runtime', 'runtime.js'));
});

app.post('/changeUserData', function (req, res) {

  const id = req.cookies['frontend'];
  const oldEmail = ids[id];

  if (!oldEmail || !users[oldEmail]) {
    return res.status(401).end();
  }

  const password = req.body.password;
  const username = req.body.username;
  const newEmail = req.body.email;

  if (
    !username ||
    !password || !newEmail ||
    !password.match(/^\S{4,}$/) ||
    !newEmail.match(/@/)
  ) {
    logger('Не валидные данные пользователя');
    return res.status(400).json({error: 'Не валидные данные пользователя'});
  }
  if (users[newEmail] && newEmail != oldEmail) {
    logger('Пользователь уже существует');
    return res.status(400).json({error: 'Пользователь уже существует'});
  }

  const avatar = req.files.avatar;
  let avatarName = '';
  try {
    avatarName = avatar.name;
    avatar.mv('./server/avatars/' + avatar.name, function(err) {
      if (err) {
        logger(err);
      }
    });
  } catch(err) {
    avatarName = users[oldEmail].avatar;
  }
  logger('Change User Data');
  const user = {username: username, password: password, email: newEmail, score: users[oldEmail].score, avatar: avatarName};
  delete users[oldEmail];
  ids[id] = newEmail;
  users[newEmail] = user;

  res.cookie('frontend', id, {expires: new Date(Date.now() + 1000 * 60 * 10)});
  res.status(201).json({id});

});

const port = process.env.PORT || 8080;

app.listen(port, function () {
	logger(`Server listening port ${port}`);
});
