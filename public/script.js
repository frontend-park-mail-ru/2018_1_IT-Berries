'use strict';

// Application sections

const application = document.getElementById('application');
const menuSection = document.getElementById('menu');
const signupSection = document.getElementById('signup');
const signinSection = document.getElementById('signin');
const profileSection = document.getElementById('profile');
const gameSettingsSection = document.getElementById('game-settings');
const scoreboardSection = document.getElementById('scoreboard');
const aboutSection = document.getElementById('about');

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

const profileSubheaders = document.getElementsByClassName('js-profile-subheader');
const signinForm = document.getElementsByClassName('js-signin-form')[0];
const signupForm = document.getElementsByClassName('js-signup-form')[0];
const profileForm = document.getElementsByClassName('js-profile-form')[0];
const gameSettingsContainer = document.getElementsByClassName('js-game-settings-container')[0];
const scoreboardContainer = document.getElementsByClassName('js-scoreboard-container')[0];
const aboutContainer = document.getElementsByClassName('js-about-table')[0];


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
    menu: function () {
    	console.log('in open function for menu');
	},
	signin: function () {
    	console.log('in open function for signin');
		signinForm.removeEventListener('submit', onSubmitSigninForm);
		signinForm.reset();
		signinForm.addEventListener('submit', onSubmitSigninForm);
	},
	signup: function () {
    	console.log('in open function for signup');
		signupForm.removeEventListener('submit', onSubmitSignupForm);
		signupForm.reset();
		signupForm.addEventListener('submit', onSubmitSignupForm);
	},
    profile: function () {
    	console.log('in open function for profile');
		signupForm.removeEventListener('submit', onSubmitProfileForm);
		signupForm.reset();
		signupForm.addEventListener('submit', onSubmitProfileForm);
	},
    gameSettings: function () {
    	console.log('in open function for game settings');
	},
	scoreboard: openScoreboard,
    about: function () {
    	console.log('in open function for about');
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

function openScoreboard() {
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

		table.style.fontSize = '18px'; // TODO: delete style from here
	});
}

function onSubmitSigninForm(evt) {
	evt.preventDefault();
	const fields = ['email', 'password'];

	const form = evt.currentTarget;
	const formElements = form.elements;

	const formdata = fields.reduce(function (allfields, fieldname) {
		allfields[fieldname] = formElements[fieldname].value;
		return allfields;
	}, {});

	console.log('Авторизация пользователя', formdata);

	signinUser(formdata, function (err, response) {
		if (err) {
			signupForm.reset();
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
	const fields = ['username', 'email', 'password', 'password_repeat'];

	const form = evt.currentTarget;
	const formElements = form.elements;

	const formdata = fields.reduce(function (allfields, fieldname) {
		allfields[fieldname] = formElements[fieldname].value;
		return allfields;
	}, {});

	validateProfileFormData(formdata, function(err) {
		const signupValidationField = document.getElementsByClassName('js-signup-validation')[0];
		signupValidationField.textContent = err;
	});

	console.info('Регистрация пользователя', formdata);

	signinUser(formdata, function (err, response) {
		if (err) {
			signupForm.reset();
			alert('Неверно!');
			return;
		}

		checkAuth();
		openSection('menu');
	}, false); // TODO: do request to change profile data. API method for profile?
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
		const profileValidationField = document.getElementsByClassName('js-profile-validation')[0];
		profileValidationField.textContent = err;
	});

	console.info('Регистрация пользователя', formdata);

	signinUser(formdata, function (err, response) {
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

// TODO: one function for loadAllUsers and loadMe. What about function and flag names?
function loadUsers(callback, isAllUsersLoad = true) {
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
}

// TODO: one function for signupUser and signinUser. What about function and flag names?
function signinUser(user, callback, isSignup = false) {
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
}

function checkAuth() {
	loadUsers(function (err, me) {
		// Fill textContent for array of profile subheaders: in menu and profile sections
		if (err) {
			Array.prototype.forEach.call(profileSubheaders, function(profileSubheader) {
				profileSubheader.textContent = 'Guest';
			});
			return;
		}

		console.dir('Проверка авторизации', me);
		Array.prototype.forEach.call(profileSubheaders, function(profileSubheader) {
			profileSubheader.textContent = '${me.username}!!!';
		});

	}, false);

}


// Initialize application

openSection("menu");
checkAuth();