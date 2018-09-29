// // When the user scrolls the page, execute myFunction
window.onscroll = function() {
  const navbar = document.getElementById("navbar");
  const draftstone = document.getElementById("draftstone");

  // Add the sticky class to the navbar on scroll. Remove "sticky" when you leave the scroll position
    if (window.pageYOffset > 50) {
      navbar.classList.add("sticky")
      draftstone.classList.remove("draftstone-text")
      draftstone.classList.add("draftstone-text-sticky")
    } else {
      navbar.classList.remove("sticky");
      draftstone.classList.remove("draftstone-text-sticky")
      draftstone.classList.add("draftstone-text")
    }
};
