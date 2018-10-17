
const registerForm = document.getElementById('register');
const password = document.getElementById('register-password');
const confirm = document.getElementById('register-confirm');

const mismatch = document.getElementById("mismatch");


registerForm.addEventListener('submit', (e) => {
  if (password.value !== confirm.value) {
    e.preventDefault();
    password.value = '';
    confirm.value = '';
    if(mismatch.classList.contains('hidden')) {
      mismatch.classList.remove('hidden');
    }
    mismatch.classList.remove('hidden');
    return false;
  } else {
    if(!mismatch.classList.contains('hidden')) {
      mismatch.classList.add('hidden');
    }
    return true;
  }
});

const passwordForm = document.getElementById('password-change');
const newPassword = document.getElementById('newpassword');
const newConfirm = document.getElementById('confirmpassword');

passwordForm.addEventListener('submit', (e) => {
  if (newPassword.value !== newConfirm.value) {
    e.preventDefault();
    newPassword.value = '';
    newConfirm.value = '';
    if(mismatch.classList.contains('hidden')) {
      mismatch.classList.remove('hidden');
    }
    mismatch.classList.remove('hidden');
    return false;
  } else {
    if(!mismatch.classList.contains('hidden')) {
      mismatch.classList.add('hidden');
    }
    return true;
  }
});
