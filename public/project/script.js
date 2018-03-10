;
import ApiModule from './modules/api.js';
import ScoreboardComponent from './common.blocks/scoreboard/__container/scoreboard__container.js';
import ProfileComponent from './common.blocks/profile-data/profile-data.js';
import ProfileForm from './common.blocks/profile-form/profile-form.js';
import ScoreboardPaginator from './common.blocks/scoreboard/__paginator/scoreboard__paginator.js';

// Application modules

const apiModule = new ApiModule();

// Application common.blocks

const scoreboardComponent = new ScoreboardComponent('.scoreboard__container');
const scoreboardPaginator = new ScoreboardPaginator();
const profileComponent = new ProfileComponent('profile-data');
const profileFormComponent = new ProfileForm();

// Application sections

const application = document.getElementsByClassName('application')[0];
const menuSection = document.getElementsByClassName('menu')[0];
const signupSection = document.getElementsByClassName('signup')[0];
const signinSection = document.getElementsByClassName('signin')[0];
const profileSection = document.getElementsByClassName('profile')[0];
const gameSettingsSection = document.getElementsByClassName('game-settings')[0];
const scoreboardSection = document.getElementsByClassName('scoreboard')[0];
const aboutSection = document.getElementsByClassName('about')[0];

const sections = new Map([
  ['menu',  menuSection],
  ['signup', signupSection],
  ['signin', signinSection],
  ['profile', profileSection],
  ['gameSettings', gameSettingsSection],
  ['scoreboard', scoreboardSection],
  ['about', aboutSection],
]);


// Sections elements

const profileSubheaders = document.getElementsByClassName('menu__profile-subheader');
const signinForm = document.getElementsByClassName('signin-form')[0];
const signupForm = document.getElementsByClassName('signup-form')[0];
const profileForm = document.getElementsByClassName('profile-form')[0];
const quit = document.getElementsByClassName('quit-link')[0];

// Sections functions

function hideAllSections() {
  for(let section of sections.values()) {
    section.hidden = true;
  }
}

function openSections(sectionsNamesArr) {
  sectionsNamesArr.forEach( (sectionName, i, arr)  => {
    let section = sections.get(sectionName);
    if (section === undefined) {
      console.error(sectionName);
      return;
    }
    section.hidden = false;
    if (openFunctions[sectionName]) {
      openFunctions[sectionName]();
    }
  })
}

const openFunctions = {
  menu: () => {

  },
  signin: () => {
    resetForm(signinForm, 'signin-form__validation', onSubmitSigninForm);
  },
  profile: () => {
    resetForm(profileForm, 'profile-form__validation', onSubmitProfileForm);
    openProfile();
  },
  signup: () => {
    resetForm(signupForm, 'signup-form__validation', onSubmitSignupForm);
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
  if (target.tagName.toLowerCase() !== 'a' || target.name == 'paginator-link') {
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

  apiModule.loadUsers( (err, users) => {
    if (err) {
      console.error(err);
      return;
    }

    scoreboardComponent.data = users.scorelist;
    scoreboardComponent.renderTmpl();
    scoreboardPaginator.usersCount = users.length;
    scoreboardPaginator.renderTmpl(listSize, listNumber, openScoreboard);
  }, listSize, listNumber);
}

function openProfile() {
  profileComponent.clear();
  profileFormComponent.clear();

  apiModule.loadProfile(loadProfileCallback);
}


function onSubmitSigninForm(evt) {
  evt.preventDefault();

  const formData = new FormData(signinForm);

  apiModule.loginUser(formData, (err) => {
    if (err) {
      signinForm.reset();
      const signinValidationField = document.getElementsByClassName('signin-form__validation')[0];
      signinValidationField.textContent = 'Wrong email or password! Try again...';
      return;
    }

    checkAuth();
    hideAllSections();
    openSections(['menu']);
  });
}

function validateProfileFormData(formdata, callback) {

  let password = '';
  let rep_password = '';
  let email = '';

  Array.prototype.forEach.call(formdata.elements, function(element) {
    if (element.name == 'password') {
      password = element.value;
    }
    else if (element.name == 'password_repeat') {
      rep_password = element.value;
    }
    else if (element.name == 'email') {
      email = element.value;
    }
  });

  if (password != rep_password) {
    callback('Passwords do not match');
    return false;
  }

  if (!password.match(/^\S{4,}$/)) {
    callback('Password is invalid');
    return false;
  }

  if (email != '' && !email.match(/@/)) {
    callback('Email is invalid');
    return false;
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

function onSubmitSignupForm(evt) {
  evt.preventDefault();

  //const form = document.forms.namedItem("fileinfo");
  const formData = new FormData(signupForm);

  if (validateProfileFormData(signupForm, (err) => {
    const signupValidationField = document.getElementsByClassName('signup-form__validation')[0];
    signupValidationField.textContent = err;
    return;
  })) {
    apiModule.signupUser(formData, (err) => {
      if (err) {
        resetForm(signupForm, 'signup-form__validation', onSubmitSignupForm);
        const response = JSON.parse(err.responseText);
        const signupValidationField = document.getElementsByClassName('signup-form__validation')[0];
        signupValidationField.textContent = response.error;
        return;
      }

      hideAllSections();
      openSections(['menu']);
    }, true);
  }
}

function onSubmitProfileForm(evt) {
  evt.preventDefault();
  const formData = new FormData(profileForm);

  if (validateProfileFormData(profileForm, (err) => {
    const profileValidationField = document.getElementsByClassName('profile-form__validation')[0];
    profileValidationField.textContent = err;
    return;
  })) {
    apiModule.changeUserData(formData, (err) => {
      if (err) {
        resetForm(signupForm, 'profile-form__validation', onSubmitProfileForm);
        const response = JSON.parse(err.responseText);
        const profileValidationField = document.getElementsByClassName('profile-form__validation')[0];
        profileValidationField.textContent = response.error;
        return;
      }

      apiModule.loadProfile(loadProfileCallback);
    }, false);
  }
}

function loadProfileCallback(err, user) {
  if (err) {
    console.error(err);
    return;
  }

  profileComponent.data = user;
  profileFormComponent.data = user;
  profileComponent.renderTmpl();
  profileFormComponent.setOldValue();
}

function checkAuth() {
  apiModule.loadMe( (err, me) => {

    // Fill textContent for array of profile-data subheaders: in menu and profile-data sections
    const profileLinks = document.getElementsByClassName('menu__profile-link');
    const quitLinks = document.getElementsByClassName('menu__quit-link');
    const signinLinks = document.getElementsByClassName('menu__signin-link');
    const signupLinks = document.getElementsByClassName('menu__signup-link');
    if (err) {
      profileComponent.clear();
      Array.prototype.forEach.call(profileSubheaders, (profileSubheader) => {
        profileSubheader.textContent = 'Guest';
      });

      Array.prototype.forEach.call(profileLinks, (profileLink) => {
        profileLink.hidden = true;
      });

      Array.prototype.forEach.call(quitLinks, (quitLink) => {
        quitLink.hidden = true;
      });

      Array.prototype.forEach.call(signinLinks, (signinLink) => {
        signinLink.hidden = false;
      });

      Array.prototype.forEach.call(signupLinks, (signupLink) => {
        signupLink.hidden = false;
      });
      quit.hidden = true;
      return;
    }
    apiModule.loadProfile(loadProfileCallback);
    Array.prototype.forEach.call(profileSubheaders, (profileSubheader) => {
      profileSubheader.textContent = `Вы авторизованы как ${me.username}!!!`;
    });

    Array.prototype.forEach.call(profileLinks, (profileLink) => {
      profileLink.hidden = false;
    });

    Array.prototype.forEach.call(quitLinks, (quitLink) => {
      quitLink.hidden = false;
    });

    Array.prototype.forEach.call(signinLinks, (signinLink) => {
      signinLink.hidden = true;
    });

    Array.prototype.forEach.call(signupLinks, (signupLink) => {
      signupLink.hidden = true;
    });
    quit.hidden = false;
  }, false);
}

quit.addEventListener('click', (evt) => {
  evt.preventDefault();

  apiModule.logOut(() => {
    checkAuth();
    hideAllSections();
    openSections(['menu']);
  });
});

// Initialize application

// TODO: устранить дублирование этого везде, вынести в openMenu?
checkAuth();
hideAllSections();
openSections(['menu']);