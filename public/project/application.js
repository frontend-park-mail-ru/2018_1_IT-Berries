// Import modules
import Router from './modules/router.js';
import eventBus from './modules/event-bus.js';

// Import views
import MenuView from './views/menu-view/menu-view.js';
import GameView from './views/game-view/game-view.js';
import LoginView from './views/login-view/login-view.js';
import SignupView from './views/signup-view/signup-view.js';
import ProfileView from './views/profile-view/profile-view.js';
import ScoreboardView from './views/scoreboard-view/scoreboard-view.js';
import SettingsView from './views/settings-view/settings-view.js';
import AboutView from './views/about-view/about-view.js';
import WinGameView from './views/win-game-view/win-game-view.js';
import LoseGameView from './views/lose-game-view/lose-game-view.js';
import GameModeView from './views/game-mode-view/game-mode-view.js';
import ChooseSideView from './views/choose-side-view/choose-side-view.js';
import NotFoundView from './views/not-found-view/not-found-view.js';

// Import models
import UsersModel from './models/users-model.js';

import { addServiceWorker } from './modules/add-sw.js';

async function startApplication() {

  addServiceWorker();

  const application = document.getElementsByClassName('application')[0];
  application.innerHTML = '';

  const loadMeResponse = await UsersModel.loadMe();
  if (loadMeResponse.ok) {
    await new Router(application, '/login')
      .add('/', MenuView)
      .add('/game/online-mode', GameView)
      .add('/game/offline-mode', GameView)
      .add('/login', LoginView)
      .add('/signup', SignupView)
      .add('/profile', ProfileView)
      .add('/scoreboard', ScoreboardView)
      .add('/settings', SettingsView)
      .add('/about', AboutView)
      .add('/win', WinGameView)
      .add('/lose', LoseGameView)
      .add('/mode', GameModeView)
      .add('/side/online-mode', ChooseSideView)
      .add('/404', NotFoundView)
      .start();
  }

  eventBus.on('login', async (userdata) => {
    const response = await UsersModel.login(userdata);
    if (response.ok) {
      await new Router().open('/');
    } else {
      eventBus.emit('login-error', response.error);
    }
  });

  eventBus.on('logout', async () => {
    await UsersModel.logout();
    await new Router().open('/');
  });

  eventBus.on('signup', async (userdata) => {
    const response = await UsersModel.signup(userdata);
    if (response.ok) {
      await new Router().open('/');
    } else {
      eventBus.emit('signup-error', response.error);
    }
  });

  eventBus.on('change-profile', async (profile) => {
    const response = await UsersModel.changeProfile(profile);
    if (response.ok) {
      await new Router().open('/profile');
    } else {
      eventBus.emit('change-profile-error', response.error);
    }
  });

  eventBus.on('win', async () => {
    await new Router().open('/win');
  });

  eventBus.on('lose', async () => {
    await new Router().open('/lose');
  });

  const imagesToLoad = [
    '../images/matrix.jpg',
    '../images/sky2.jpg',
    '../images/sky.jpg',
    '../images/rocket.png',
    '../images/ufo.png',
    '../images/rkn.png',
    '../images/telegram.png',
    '../images/star.png',
    '../images/dark-star.png',
    '../images/eng-game-board.png',
    '../images/howtoplay.png',
  ];

  for (let imageToLoad of imagesToLoad) {
    let img = new Image(), url = imageToLoad;
    img.src = url;
  }

}

startApplication();
