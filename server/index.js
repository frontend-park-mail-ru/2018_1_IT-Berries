'use strict';

const fallback = require(`express-history-api-fallback`);
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


const root = path.resolve(__dirname, '..', 'public');

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
  'anastasia.puchnina@park.mail.ru': {
    username: 'Anastasia',
    email: 'anastasia.puchnina@park.mail.ru',
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

app.post('/registration', function (req, res) {

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
  if (users[email]) {
    logger('Пользователь уже существует');
    return res.status(400).json({error: 'Данный email уже зарегистрированн'});
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
  res.status(201).json({username: users[email].username, email: email, score: users[email].score, avatar: users[email].avatar});
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
  res.status(200).json({username: users[email].username, email: email, score: users[email].score, avatar: users[email].avatar});
});

app.get('/me', function (req, res) {
  const id = req.cookies['frontend'];
  const email = ids[id];

  if (!email || !users[email]) {
    return res.status(401).json({error: 'Пользователь не авторизован'});
  }

  users[email].score += 1;

  res.json({username: users[email].username, email: email, score: users[email].score, avatar: users[email].avatar});
});

app.get('/avatar', function (req, res) {

  logger('query:')
  logger(req.query);

  /*
  const id = req.cookies['frontend'];
  const email = ids[id];
  if (!email || !users[email]) {
    return res.status(401).end();
  }*/

  const avatar = req.query.avatar;

  res.sendFile(path.resolve(__dirname, 'avatars', avatar));
});

app.get('/users/scoreboard/', function (req, res) {
  logger(req.query);
  const listSize = Number(req.query.listSize);
  const listNumber = Number(req.query.listNumber);
  const startPosition = (listNumber - 1) * listSize;
  logger('startPosition=' + startPosition);
  logger('listSize=' + listSize);
  let scorelist = Object.values(users).sort((l, r) => r.score - l.score);
  const length = scorelist.length;
  scorelist = scorelist.map((user, index) => {
    return {
      id: index,
      username: user.username,
      email: user.email,
      score: user.score
    };
  }).slice(startPosition, startPosition + listSize);
  logger('scorelist: ' + scorelist);
  res.json({scorelist: scorelist, length: length});
});

app.get('/logout', function (req, res) {
  logger("Выход пользователя");
  let id = req.cookies['frontend'];
  const email = ids[id];
  if (!email || !users[email]) {
    logger('А он и не входил');
    return res.status(401).end();
  }
  logger("Пользователь вышел");
  ids[id] = '';
  id = uuid();
  ids[id] = email;
  res.status(202).end();
});

app.get('/runtime.js', function (req, res) {
  res.sendFile(path.resolve(__dirname, '..', 'node_modules', 'regenerator-runtime', 'runtime.js'));
});

app.put('/me', function (req, res) {

  const id = req.cookies['frontend'];
  const oldEmail = ids[id];
  const userData = users[oldEmail];

  logger('Old User:');
  logger(userData);


  if (!oldEmail || !users[oldEmail]) {
    return res.status(401).end();
  }
  logger('Body:');
  logger(req.body);
  const password = req.body.current_password;
  const newUsername = req.body.username;
  const newEmail = req.body.email;
  const newPassword = req.body.new_password;
  const newPasswordRepeat = req.body.new_password_repeat;

  if (
    (newEmail != '' && newEmail != oldEmail) ||
    (newUsername != '' && newUsername != userData.username) ||
    (newPassword != '' && newPassword != userData.password) ||
    (newPasswordRepeat != '' && newPasswordRepeat != userData.password)) {
    if (password != userData.password) {
      logger('Неверный пароль');
      return res.status(400).json({error: 'Неверный пароль'});
    }
    if (newEmail !== '') {
      if (!newEmail.match(/@/)) {
        logger('Не валидный email');
        return res.status(400).json({error: 'Не валидный email'});
      }
      if ( newEmail !== oldEmail && (newEmail in users)) {
        logger('Пользователь уже существует');
        return res.status(400).json({error: 'Пользователь уже существует'});
      }
      userData.email = newEmail;
    }

    if (newPassword !== '') {
      if (!newPassword.match(/^\S{4,}$/)) {
        logger('New password must be longer than 3 characters');
        return res.status(400).json({error: 'New password must be longer than 3 characters'});
      }
      if (newPassword !== newPasswordRepeat) {
        logger('New passwords do not match');
        return res.status(400).json({error: 'New passwords do not match'});
      }
      userData.password = newPassword;
    }

    if (newUsername !== '') {
      userData.username = newUsername;
    }
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
  userData.avatar = avatarName;
  delete users[oldEmail];
  ids[id] = userData.email;
  users[userData.email] = userData;

  logger('New user data:');
  logger(userData);

  res.cookie('frontend', id, {expires: new Date(Date.now() + 1000 * 60 * 10)});
  res.status(200).json(userData);

});

app.use(fallback('index.html', {root}));

const port = process.env.PORT || 8081;

app.listen(port, function () {
  logger(`Server listening port ${port}`);
});
