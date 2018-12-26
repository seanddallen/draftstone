// // When the user scrolls the page, execute myFunction
window.onscroll = function() {
  const navbar = document.getElementById("navbar");
  const draftstone = document.getElementById("draftstone");
  const username = document.getElementById("username");
  const accounticon = document.getElementById("account-icon");


  // Add the sticky class to the navbar on scroll. Remove "sticky" when you leave the scroll position
    if (window.pageYOffset > 50) {
      navbar.classList.add("sticky");
      draftstone.classList.remove("draftstone-text");
      draftstone.classList.add("draftstone-text-sticky");
      if (username) {
        username.classList.remove("darker");
        username.classList.add("light");
        accounticon.classList.remove("dark");
        accounticon.classList.add("brown");
      }
    } else {
      navbar.classList.remove("sticky");
      draftstone.classList.remove("draftstone-text-sticky");
      draftstone.classList.add("draftstone-text");
      if(username) {
        username.classList.remove("light");
        username.classList.add("darker");
        accounticon.classList.remove("brown");
        accounticon.classList.add("dark");
      }
    }
};
