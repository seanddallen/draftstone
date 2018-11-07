
const passwordForm = document.getElementById('password-change');
const newPassword = document.getElementById('newpassword');
const newConfirm = document.getElementById('confirmpassword');

const error = document.getElementById('error');
const success = document.getElementById('success');


passwordForm.addEventListener('submit', (e) => {
  if (error) {
    error.classList.add('hidden');
  }
  if (success) {
    success.classList.add('hidden');
  }

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
