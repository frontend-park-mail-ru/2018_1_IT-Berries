// Application modules

const httpModule = new window.HttpModule();

// Application components

const scoreboardComponent = new window.ScoreboardComponent('.js-scoreboard-container');
const profileComponent = new window.ProfileComponent('js-profile-container');

// Application sections

const application = document.getElementsByClassName('application')[0];
const menuSection = document.getElementsByClassName('menu')[0];
const signupSection = document.getElementsByClassName('signup')[0];
const signinSection = document.getElementsByClassName('signin')[0];
const profileSection = document.getElementsByClassName('profile')[0];
const gameSettingsSection = document.getElementsByClassName('game-settings')[0];
const scoreboardSection = document.getElementsByClassName('scoreboard')[0];
const aboutSection = document.getElementsByClassName('about')[0];

const sections = {
  menu: menuSection,
  signup: signupSection,
  signin: signinSection,
  profile: profileSection,
  gameSettings: gameSettingsSection,
  scoreboard: scoreboardSection,
  about: aboutSection
};


// Sections elements

const profileSubheaders = document.getElementsByClassName('menu__js-profile-subheader');
const signinForm = document.getElementsByClassName('js-signin-form')[0];
const signupForm = document.getElementsByClassName('js-signup-form')[0];
const quit = document.getElementsByClassName('quit-link')[0];

// Sections functions

function openSection(sectionName) {
  Object.keys(sections).forEach(function (key) {
    if (key === sectionName) {
      sections[key].hidden = false;
    } else {
      sections[key].hidden = true;
    }
  });

  if (openFunctions[sectionName]) {
    openFunctions[sectionName]();
  }
}

const openFunctions = {
  menu: openMenu,
  signin: function () {
    console.log('in open function for signin');
    signinForm.removeEventListener('submit', onSubmitSigninForm);
    signinForm.reset();
    signinForm.addEventListener('submit', onSubmitSigninForm);
  },
  profile: openProfile,
  signup: function () {
    console.log('in open function for signup');
    signupForm.removeEventListener('submit', onSubmitSignupForm);
    signupForm.reset();
    signupForm.addEventListener('submit', onSubmitSignupForm);
  },
  gameSettings: function () {
    console.log('in open function for game settings');
  },
  scoreboard: openScoreboard,
  about: function () {
    console.log('in open function for about');
  },
  out: function() {
    logOut(() => {
      checkAuth();
      openSection('menu');
    });
  }
};

application.addEventListener('click', function (evt) {
  const target = evt.target;
  if (target.tagName.toLowerCase() !== 'a') {
    return;
  }
  // Proccess click on link
  // Prevent default link behavior: do not go to target page
  evt.preventDefault();

  const section = target.getAttribute('data-section');
  console.log('Open section: ', section);
  openSection(section);
});

// TODO: check that all ok and delete this
/*function openScoreboard() {
  console.log('in open function for scoreboard');
  scoreboardContainer.innerHTML = '';

  loadUsers(function (err, users) {
    if (err) {
      // can not load users
      console.error(err);
      return;
    }

    console.dir(users);

    // add users to scoreboard

    const table = document.createElement('table');
    const tbody = document.createElement('tbody');
    table.appendChild(tbody);

    users.forEach(function (user) {
      const trow = document.createElement('tr');

      const tdUsername = document.createElement('td');
      tdUsername.textContent = user.username;

      const tdScore = document.createElement('td');
      tdScore.textContent = user.score;

      trow.appendChild(tdUsername);
      trow.appendChild(tdScore);

      tbody.appendChild(trow);
    });

    scoreboardContainer.appendChild(table);

    table.style.fontSize = '18px';
  });
}*/

function openMenu() {
  console.info('in open function for menu');
}

function openScoreboard() {

  scoreboardComponent.clear();

  loadUsers(function (err, users) {
    if (err) {
      console.error(err);
      return;
    }

    console.dir(users);
    scoreboardComponent.data = users;
    scoreboardComponent.renderTmpl();
  });
}

function openProfile() {
  profileComponent.clear();

  loadProfile(loadProfileCallback);
}


function onSubmitSigninForm(evt) {
  evt.preventDefault();

  const formData = new FormData(signinForm);

  console.log('Авторизация пользователя', formData);

  loginUser(formData, function (err) {
    if (err) {
      signinForm.reset();
      alert('Неверно!');
      return;
    }

    checkAuth();
    openSection('menu');
  });
}

function validateProfileFormData(formdata, callback) {

  // TODO: add validation of formdata
  // TODO: if validation error, do callback(err)

  return true;
}

// TODO: Is it duplication of submit functions?

function onSubmitSignupForm(evt) {
  evt.preventDefault();

  //const form = document.forms.namedItem("fileinfo");
  const formData = new FormData(signupForm);

  validateProfileFormData(formData, function(err) {
    const signupValidationField = document.getElementsByClassName('js-signup-form__validation')[0];
    signupValidationField.textContent = err;
  });

  console.info('Регистрация пользователя', formData);

  signupUser(formData, function (err) {
    if (err) {
      signupForm.reset();
      alert('Неверно!');
      return;
    }

    openSection('menu');
  }, true); // TODO: do request to change profile data. API method for profile?
}

function onSubmitProfileForm(evt) {
  evt.preventDefault();
  const fields = ['username', 'email', 'password', 'password_repeat'];

  const form = evt.currentTarget;
  const formElements = form.elements;

  const formdata = fields.reduce(function (allfields, fieldname) {
    allfields[fieldname] = formElements[fieldname].value;
    return allfields;
  }, {});

  validateProfileFormData(formdata, function(err) {
    const profileValidationField = document.getElementsByClassName('js-profile-form__validation')[0];
    profileValidationField.textContent = err;
  });

  console.info('Регистрация пользователя', formdata);

  loginUser(formdata, function (err) {
    if (err) {
      signupForm.reset();
      alert('Неверно!');
      return;
    }

    checkAuth();
    openSection('menu');
  }, false); // TODO: do request to change profile data. API method for profile?
}


// Authorization functions

// TODO: Delete this if all fine (the functional was divided between loadUsers and loadMe
/*function loadUsers(callback, isAllUsersLoad = true) {
  const xhr = new XMLHttpRequest();
  const apiPath = isAllUsersLoad ? '/users' : '/me';
  xhr.open('GET', apiPath, true);

  xhr.onreadystatechange = function () {
    if (xhr.readyState != 4) { // If not Done status of request
      return;
    }

    if (xhr.status === 200) {
      const responseText = xhr.responseText;
      const response = JSON.parse(responseText);
      callback(null, response);
    } else {
      callback(xhr);
    }
  };

  if (isAllUsersLoad == false) {
    xhr.withCredentials = true;
  }

  xhr.send();
}*/

function loadProfile(callback) {
  httpModule.doGet({
    url: '/profile',
    callback: callback
  });
}

function loadUsers(callback) {
  httpModule.doGet({
    url: '/users',
    callback
  });
}

function loadMe(callback) {
  httpModule.doGet({
    url: '/me',
    callback
  });
}


// TODO: one function for signupUser and signinUser. What about function and flag names?
/*function signinUser(user, callback, isSignup = false) {
  const xhr = new XMLHttpRequest();
  const apiPath = isSignup ? '/signup' : '/login';
  xhr.open('POST', apiPath, true);

  xhr.onreadystatechange = function () {
    if (xhr.readyState != 4) { // If not Done status of request
      return;
    }

    if (xhr.status < 300) {
      const responseText = xhr.responseText;
      const response = JSON.parse(responseText);
      callback(null, response);
    } else {
      callback(xhr);
    }
  };

  xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
  xhr.withCredentials = true;

  xhr.send(JSON.stringify(user));
}*/

function signupUser(user, callback) {
  httpModule.doPost({
    url: '/signup',
    callback: callback,
    formData: user
  });
}

function loginUser(user, callback) {
  httpModule.doPost({
    url: '/login',
    callback: callback,
    formData: user
  });
}

function logOut(callback) {
  httpModule.doGet({
    url: '/logout',
    callback: callback
  });
}

function loadProfileCallback(err, user) {
  if (err) {
    console.error(err);
    return;
  }

  console.dir(user);
  profileComponent.data = user;
  profileComponent.renderTmpl();
}

function checkAuth() {
  loadMe(function (err, me) {
    // Fill textContent for array of profile subheaders: in menu and profile sections
    const profileLinks = document.getElementsByClassName('menu__profile-link');
    const quitLinks = document.getElementsByClassName('menu__quit-link');
    const signinLinks = document.getElementsByClassName('menu__signin-link');
    const signupLinks = document.getElementsByClassName('menu__signup-link');
    if (err) {
      profileComponent.clear();
      Array.prototype.forEach.call(profileSubheaders, function(profileSubheader) {
        profileSubheader.textContent = 'Guest';
      });

      Array.prototype.forEach.call(profileLinks, function(profileLink) {
        profileLink.hidden = true;
      });

      Array.prototype.forEach.call(quitLinks, function(quitLink) {
        quitLink.hidden = true;
      });

      Array.prototype.forEach.call(signinLinks, function(signinLink) {
        signinLink.hidden = false;
      });

      Array.prototype.forEach.call(signupLinks, function(signupLink) {
        signupLink.hidden = false;
      });
      quit.hidden = true;
      return;
    }
    loadProfile(loadProfileCallback);
    console.dir('Проверка авторизации', me);
    Array.prototype.forEach.call(profileSubheaders, function(profileSubheader) {
      profileSubheader.textContent = `Вы авторизованы как ${me.username}!!!`;
    });

    Array.prototype.forEach.call(profileLinks, function(profileLink) {
      profileLink.hidden = false;
    });

    Array.prototype.forEach.call(quitLinks, function(quitLink) {
      quitLink.hidden = false;
    });

    Array.prototype.forEach.call(signinLinks, function(signinLink) {
      signinLink.hidden = true;
    });

    Array.prototype.forEach.call(signupLinks, function(signupLink) {
      signupLink.hidden = true;
    });
    quit.hidden = false;
  }, false);
}

quit.addEventListener('click', function() {

});

quit.addEventListener('click', function (evt) {
  evt.preventDefault();

  logOut(() => {
    checkAuth();
    openSection('menu');
  });
});

// Initialize application

openSection('menu');
checkAuth();