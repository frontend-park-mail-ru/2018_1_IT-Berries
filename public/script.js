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

const signinForm = document.getElementsByClassName('js-signin-form')[0];
const signupForm = document.getElementsByClassName('js-signup-form')[0];
const profileForm = document.getElementsByClassName('js-profile-form')[0];
const gameSettingsContainer = document.getElementsByClassName('js-game-settings-container')[0];
const scoreboardContainer = document.getElementsByClassName('js-scoreboard-container')[0];
const aboutContainer = document.getElementsByClassName('js-about-table')[0];

// Display sections functions

function openSection(sectionName) {
	Object.keys(sections).forEach(function (key) {
		if (key === sectionName) {
			sections[key].hidden = false;
		} else {
			sections[key].hidden = true;
		}
	});

	if (openFunctions[name]) {
		openFunctions[name]();
	}
}

const openFunctions = {
    menu: function () {

	},
	signin: function () {

	},
	signup: function () {

	},
    profile: function () {

	},
    gameSettings: function () {

	},
	scoreboard: openScoreboard,
    about: function () {

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
	scoreboardContainer.innerHTML = '';

	loadAllUsers(function (err, users) {
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

// Authorization functions
// will be here

// Initialize application

openSection("menu");
checkAuth();