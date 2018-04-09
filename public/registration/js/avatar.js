const avatar_input = document.getElementsByClassName('hide-input-avatar')[0];
const avatar_button = document.getElementsByClassName('avatar-button')[0];
const avatar_text = document.getElementsByClassName('avatar-text')[0];

avatar_button.addEventListener('click', () => {
  avatar_input.click();
});

avatar_input.addEventListener('change', () => {
  avatar_text.innerHTML = avatar_input.value.split(/(\\|\/)/g).pop();
});