// Import modules
import Router from './modules/router.js';
import eventBus from './modules/event-bus.js';

// Import views
import MenuView from './views/menu-view/menu-view.js';
import GameModeView from './views/game-mode-view/game-mode-view.js';
import LoginView from './views/login-view/login-view.js';
import SignupView from './views/signup-view/signup-view.js';
import ProfileView from './views/profile-view/profile-view.js';
import ScoreboardView from './views/scoreboard-view/scoreboard-view.js';
import SettingsView from './views/settings-view/settings-view.js';
import AboutView from './views/about-view/about-view.js';

// Import models
import UsersModel from './models/users-model.js';

import { addServiceWorker } from './modules/add-sw.js';

document.addEventListener('DOMContentLoaded', async function () {

  addServiceWorker();

  const application = document.getElementsByClassName('application')[0];

  const loadMeResponse = await UsersModel.loadMe();
  if (loadMeResponse.ok) {
    await new Router(application, '/login')
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

  eventBus.on('login', async function (userdata) {
    const response = await UsersModel.login(userdata);
    if (response.ok) {
      await new Router().open('/');
    } else {
      eventBus.emit('login-error', response.error);
    }
  });

  eventBus.on('logout', async function () {
    await UsersModel.logout();
    await new Router().open('/');
  });

  eventBus.on('signup', async function (userdata) {
    const response = await UsersModel.signup(userdata);
    if (response.ok) {
      await new Router().open('/');
    } else {
      eventBus.emit('signup-error', response.error);
    }
  });

  eventBus.on('change-profile', async function (profile) {
    const response = await UsersModel.changeProfile(profile);
    if (response.ok) {
      await new Router().open('/profile');
    } else {
      eventBus.emit('change-profile-error', response.error);
    }
  });

});