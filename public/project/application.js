(function() {

  document.addEventListener('DOMContentLoaded', async function () {

    const UsersModel = require('UsersModel');
    const Router = require('Router');
    const bus = require('bus');

    const MenuView = require('MenuView');
    const GameModeView = require('GameModeView');
    const LoginView = require('LoginView');
    const SignupView = require('SignupView');
    const ProfileView = require('ProfileView');
    const ScoreboardView = require('ScoreboardView');
    const SettingsView = require('SettingsView');
    const AboutView = require('AboutView');

    const application = document.getElementsByClassName('application')[0];

    const loadMeResponse = await UsersModel.loadMe();
    if (loadMeResponse.ok) {
      await new Router(application)
        .add('/', MenuView)
        .add('/game-mode', GameModeView)
        .add('/login', LoginView)
        .add('/signup', SignupView)
        .add('/profile', ProfileView)
        .add('/scoreboard', ScoreboardView)
        .add('/settings', SettingsView)
        .add('/about', AboutView)
        .start();
    }
    else {
      console.log('Опа. Ошибочка: ', loadMeResponse.error);
    }

    bus.on('login', async function (userdata) {
      const response = await UsersModel.login(userdata);
      if (response.ok) {
        await new Router().open('/');
      } else {
        bus.emit('login-error', response.error);
      }
    });

    bus.on('logout', async function (userdata) {
      await UsersModel.logout();
      await new Router().open('/');
    });

    bus.on('signup', async function (userdata) {
      const response = await UsersModel.signup(userdata);
      if (response.ok) {
        await new Router().open('/');
      } else {
        bus.emit('signup-error', response.error);
      }
    });

    bus.on('change-profile', async function (profile) {
      const response = await UsersModel.changeProfile(profile);
      if (response.ok) {
        await new Router().open('/profile');
      } else {
        bus.emit('change-profile-error', response.error);
      }
    });

  });

})();