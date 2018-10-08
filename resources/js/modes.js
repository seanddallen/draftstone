let favorite = document.getElementById('favorite');
let vote = document.getElementById('vote');

//Toggle Favorite Icon
favorite.addEventListener('click', (e)=>{
  if (favorite.classList.contains("grey")) {
    favorite.classList.remove("grey");
    favorite.classList.add("green");
  } else {
    favorite.classList.remove("green");
    favorite.classList.add("grey");
  }
});


//Toggle Votes Icon
vote.addEventListener('click', (e)=>{
  if (vote.classList.contains("grey")) {
    vote.classList.remove("grey");
    vote.classList.add("green");
  } else {
    vote.classList.remove("green");
    vote.classList.add("grey");
  }
});
