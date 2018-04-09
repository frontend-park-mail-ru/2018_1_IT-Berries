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
      new Router(application)
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
      console.log('userdata for login: ', userdata);
      const response = await UsersModel.login(userdata);
      if (response.ok) {
        new Router().open('/');
      } else {
        bus.emit('login-error', response.error);
      }
    });

    bus.on('logout', async function (userdata) {
      await UsersModel.logout();
      new Router().open('/');
    });

    bus.on('signup', async function (userdata) {
      console.log('userdata for signup: ', userdata);
      const response = await UsersModel.signup(userdata);
      if (response.ok) {
        new Router().open('/');
      } else {
        bus.emit('signup-error', response.error);
      }
    });

    bus.on('change-profile', async function (profile) {
      console.log('userdata for change profile: ', profile);
      const response = await UsersModel.changeProfile(profile);
      if (response.ok) {
        new Router().open('/profile');
      } else {
        bus.emit('change-profile-error', response.error);
      }
    });

  });

})();


/*
// Import modules
import ApiModule from './modules/api.js';
import HttpModule from './modules/http.js';

// Import components and blocks
import ScoreboardComponent from './common.blocks/scoreboard/__table/scoreboard__table.js';
import ScoreboardPaginator from './common.blocks/scoreboard/__paginator/scoreboard__paginator.js';
import ProfileComponent from './common.blocks/profile-data/profile-data.js';
import ProfileForm from './common.blocks/profile-form/profile-form.js';

// Initialize application modules
const httpModule = new HttpModule();
const apiModule = new ApiModule(httpModule);

// Initialize application components and blocks
const scoreboardComponent = new ScoreboardComponent('.scoreboard__container');
const scoreboardPaginator = new ScoreboardPaginator();
const profileComponent = new ProfileComponent('profile-data');
const profileFormComponent = new ProfileForm();

// Application sections

const application = document.getElementsByClassName('application')[0];
const menuSection = document.getElementsByClassName('menu')[0];
const registrationSection = document.getElementsByClassName('registration')[0];
const loginSection = document.getElementsByClassName('login')[0];
const profileSection = document.getElementsByClassName('profile')[0];
const gameSettingsSection = document.getElementsByClassName('game-settings')[0];
const scoreboardSection = document.getElementsByClassName('scoreboard')[0];
const aboutSection = document.getElementsByClassName('about')[0];

const sections = new Map([
  ['menu',  menuSection],
  ['registration', registrationSection],
  ['login', loginSection],
  ['profile', profileSection],
  ['gameSettings', gameSettingsSection],
  ['scoreboard', scoreboardSection],
  ['about', aboutSection],
]);


// Sections elements

const profileSubheader = document.getElementsByClassName('menu__profile-subheader')[0];
const loginForm = document.getElementsByClassName('login-form')[0];
const registrationForm = document.getElementsByClassName('registration-form')[0];
const profileForm = document.getElementsByClassName('profile-form')[0];
const quit = document.getElementsByClassName('quit-link')[0];

// Sections functions

function hideAllSections() {
  for(let section of sections.values()) {
    section.hidden = true;
  }
}

function openSections(sectionsNamesArr) {
  sectionsNamesArr.forEach( (sectionName)  => {
    let section = sections.get(sectionName);
    if (section) {
      section.hidden = false;
      if (openFunctions[sectionName]) {
        openFunctions[sectionName]();
      }
      return;
    }
  });
}

const openFunctions = {
  menu: () => {

  },
  login: () => {
    resetForm(loginForm, 'login-form__validation', onSubmitLoginForm);
  },
  profile: () => {
    resetForm(profileForm, 'profile-form__validation', onSubmitProfileForm);
    openProfile();
  },
  registration: () => {
    resetForm(registrationForm, 'registration-form__validation', onSubmitRegistrationForm);
  },
  gameSettings: () => {

  },
  scoreboard: openScoreboard,
  about: () => {

  }
};

// Proccess click on page link (for SPA)
application.addEventListener('click', (evt) => {
  const target = evt.target;
  if (target.tagName.toLowerCase() !== 'a' || target.name === 'paginator-link') {
    return;
  }

  // Prevent default link behavior: do not go to target page
  evt.preventDefault();

  const section = target.getAttribute('data-section');
  hideAllSections();
  openSections([ section ]);
});

function openScoreboard(listSize = 1, listNumber = 1) {

  scoreboardComponent.clear();
  scoreboardPaginator.clear();

  apiModule.loadUsers(listSize, listNumber)
    .then(users => {
      scoreboardComponent.data = users.scorelist;
      scoreboardComponent.renderTmpl();
      scoreboardPaginator.usersCount = users.length;
      scoreboardPaginator.renderTmpl(listSize, listNumber, openScoreboard);
    })
    .catch(() => {
    });
}

function openProfile() {
  profileComponent.clear();
  profileFormComponent.clear();

  updateProfile();
}

function validateLoginFormData(formdata, callback) {

  let password = '';
  let email = '';

  [...formdata.elements].forEach((element) => {
    if (element.name === 'password') {
      password = element.value;
    } else if (element.name === 'email') {
      email = element.value;
    }
  });

  if (email === '') {
    callback('Email is invalid');
    return false;
  }

  if (!password.match(/^\S{4,}$/)) {
    callback('Password must be longer than 3 characters');
    return false;
  }

  return true;
}

function onSubmitLoginForm(evt) {
  evt.preventDefault();

  const formData = new FormData(loginForm);

  if (validateLoginFormData(loginForm, (err) => {
    const loginValidationField = document.getElementsByClassName('login-form__validation')[0];
    loginValidationField.textContent = err;
  })) {

    apiModule.loginUser(formData)
      .then(() => checkAuth())
      .then(() => {
        hideAllSections();
        openSections(['menu']);
      })
      .catch(() => {
        loginForm.reset();
        const loginValidationField = document.getElementsByClassName('login-form__validation')[0];
        loginValidationField.textContent = 'Wrong email or password! Try again...';
      });
  }
}

function validateRegistrationFormData(formdata, callback) {

  let password = '';
  let rep_password = '';
  let email = '';
  let username = '';

  [...formdata.elements].forEach((element) => {
    if (element.name === 'password') {
      password = element.value;
    } else if (element.name === 'password_repeat') {
      rep_password = element.value;
    } else if (element.name === 'email') {
      email = element.value;
    } else if (element.name === 'username') {
      username = element.value;
    }
  });

  if (username === '') {
    callback('Username is invalid');
    return false;
  }

  if (email === '') {
    callback('Email is invalid');
    return false;
  }

  if (password !== rep_password) {
    callback('Passwords do not match');
    return false;
  }

  if (!password.match(/^\S{4,}$/)) {
    callback('Password must be longer than 3 characters');
    return false;
  }

  return true;
}

function validateProfileFormData(formdata, callback) {

  let password = document.getElementsByClassName('profile-form__current-password')[0];
  let newPassword = '';
  let newPasswordRepeat = '';
  let email = '';

  [...formdata.].forEach((element) => {
    if (element.name === 'new_password') {
      newPassword = element.value;
    } else if (element.name === 'new_password_repeat') {
      newPasswordRepeat = element.value;
    } else if (element.name === 'email') {
      email = element.value;
    }
  });

  if (email !== '' && !email.match(/@/)) {
    callback('Email is invalid');
    return false;
  }

  if (newPassword !== '' && !newPassword.match(/^\S{4,}$/)) {
    callback('New password must be longer than 3 characters');
    return false;
  }

  if (newPassword !== newPasswordRepeat) {
    callback('New passwords do not match');
    return false;
  }

  if (password.hidden === false) {
    if (!password.value.match(/^\S{4,}$/)) {
      callback('Current password must be longer than 3 characters');
      return false;
    }
  }

  return true;
}

function resetForm(form, validationFieldSelector, onSubmitFormCallback) {
  form.removeEventListener('submit', onSubmitFormCallback);
  form.reset();
  const validationField = document.getElementsByClassName(validationFieldSelector)[0];
  validationField.textContent = '';
  form.addEventListener('submit', onSubmitFormCallback);
}

function onSubmitRegistrationForm(evt) {
  evt.preventDefault();

  //const form = document.forms.namedItem("fileinfo");
  const formData = new FormData(registrationForm);

  if (validateRegistrationFormData(registrationForm, (err) => {
    const registrationValidationField = document.getElementsByClassName('registration-form__validation')[0];
    registrationValidationField.textContent = err;
  })) {
    apiModule.registrationUser(formData)
      .then(() => checkAuth())
      .then(() => {
        hideAllSections();
        openSections(['menu']);
      })
      .catch(err => {
        resetForm(registrationForm, 'registration-form__validation', onSubmitRegistrationForm);
        err.response.json().then(function(json) {
          const registrationValidationField = document.getElementsByClassName('registration-form__validation')[0];
          registrationValidationField.textContent = json.error;
        });
      });
  }
}

function onSubmitProfileForm(evt) {
  evt.preventDefault();
  const formData = new FormData(profileForm);

  if (validateProfileFormData(profileForm, (err) => {
    const profileValidationField = document.getElementsByClassName('profile-form__validation')[0];
    profileValidationField.textContent = err;
  })) {
    apiModule.changeUserData(formData)
      .then(() => {
        const profileValidationField = document.getElementsByClassName('profile-form__validation')[0];
        profileValidationField.textContent = '';
      })
      .then(() => updateProfile())
      .catch(err => {
        resetForm(profileForm, 'profile-form__validation', onSubmitProfileForm);
        profileFormComponent.setOldValue();
        err.response.json().then(function(json) {
          const profileValidationField = document.getElementsByClassName('profile-form__validation')[0];
          profileValidationField.textContent = json.error;
        });
      });
  }
}

function updateProfile() {
  return apiModule.loadProfile()
    .then(user => {
      profileComponent.data = user;
      profileFormComponent.clear();
      profileFormComponent.data = user;
      profileComponent.renderTmpl();
      profileFormComponent.setOldValue();
    })
    .catch(() => {
    });
}

function checkAuth() {

  // Fill textContent for array of profile-data subheaders: in menu and profile-data sections
  const unAuth = document.getElementsByClassName('unAuth');
  const auth = document.getElementsByClassName('auth');

  return apiModule.loadMe()
    .then(me => {
      profileSubheader.textContent = `Вы авторизованы как ${me.username}!!!`;

      [...unAuth].forEach((unAuthObject) => {
        unAuthObject.hidden = true;
      });

      [...auth].forEach((authObject) => {
        authObject.hidden = false;
      });
    })
    .then(() => updateProfile())
    .catch(() => {
      profileComponent.clear();

      profileSubheader.textContent = 'Guest';

      [...unAuth].forEach((unAuthObject) => {
        unAuthObject.hidden = false;
      });

      [...auth].forEach((authObject) => {
        authObject.hidden = true;
      });
    });
}

quit.addEventListener('click', (evt) => {
  evt.preventDefault();

  apiModule.logOut()
    .then(() => checkAuth())
    .then(() => {
      hideAllSections();
      openSections(['menu']);
    });
});

// Initialize application

checkAuth()
  .then(() => {
    hideAllSections();
    openSections(['menu']);
  });
  */