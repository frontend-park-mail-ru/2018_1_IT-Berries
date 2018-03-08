// Application modules

const apiModule = new window.ApiModule();

// Application components

const scoreboardComponent = new window.ScoreboardComponent('.scoreboard-container');
const profileComponent = new window.ProfileComponent('profile-container');

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
const quit = document.getElementsByClassName('quit-link')[0];

// Sections functions

function hideAllSections() {
  for(let section of sections.values()) {
    section.hidden = true;
  }
}

function openSections(sectionsNamesArr) {
  sectionsNamesArr.forEach( (sectionName, i, arr)  => {
    sections.get(sectionName).hidden = false;
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
  profile: openProfile,
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
  if (target.tagName.toLowerCase() !== 'a') {
    return;
  }
  // Prevent default link behavior: do not go to target page
  evt.preventDefault();

  const section = target.getAttribute('data-section');
  hideAllSections();
  openSections([ section ]);
});

function openScoreboard() {

  scoreboardComponent.clear();

  apiModule.loadUsers( (err, users) => {
    if (err) {
      console.error(err);
      return;
    }

    scoreboardComponent.data = users;
    scoreboardComponent.renderTmpl();
  });
}

function openProfile() {
  profileComponent.clear();

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

  // TODO: add validation of formdata
  // TODO: if validation error, do callback(err)

  return true;
}

function resetForm(form, validationFieldSelector, onSubmitFormCallback) {
  form.removeEventListener('submit', onSubmitFormCallback);
  form.reset();
  const validationField = document.getElementsByClassName(validationFieldSelector)[0];
  validationField.textContent = '';
  form.addEventListener('submit', onSubmitFormCallback);
}

// TODO: Is it duplication of submit functions?

function onSubmitSignupForm(evt) {
  evt.preventDefault();

  //const form = document.forms.namedItem("fileinfo");
  const formData = new FormData(signupForm);

  validateProfileFormData(formData, (err) => {
    const signupValidationField = document.getElementsByClassName('signup-form__validation')[0];
    signupValidationField.textContent = err;
  });

  apiModule.signupUser(formData, (err) => {
    if (err) {
      resetForm(signupForm, 'signup-form__validation', onSubmitSignupForm);
      return;
    }

    hideAllSections();
    openSections(['menu']);
  }, true); // TODO: do request to change profile data. API method for profile?
}

function onSubmitProfileForm(evt) {
  evt.preventDefault();
  const fields = ['username', 'email', 'password', 'password_repeat'];

  const form = evt.currentTarget;
  const formElements = form.elements;

  const formdata = fields.reduce( (allfields, fieldname) => {
    allfields[fieldname] = formElements[fieldname].value;
    return allfields;
  }, {});

  validateProfileFormData(formdata, (err) => {
    const profileValidationField = document.getElementsByClassName('profile-form__errors')[0];
    profileValidationField.textContent = err;
  });

  apiModule.loginUser(formdata, (err) => {
    if (err) {
      resetForm(signupForm, 'signup-form__validation', onSubmitSignupForm());
      return;
    }

    checkAuth();
    hideAllSections();
    openSections(['menu']);
  }, false);
}

function loadProfileCallback(err, user) {
  if (err) {
    console.error(err);
    return;
  }

  profileComponent.data = user;
  profileComponent.renderTmpl();
}

function checkAuth() {
  apiModule.loadMe( (err, me) => {
    // Fill textContent for array of profile subheaders: in menu and profile sections
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

// TODO: спросить Ваню, зачем здесь это
quit.addEventListener('click', () => {

});

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