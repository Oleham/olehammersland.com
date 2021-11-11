
export function burger() {

  let burgerButton = document.getElementById("burger");

  let burgerIsOpen = false;

  let navMainMenu = document.getElementById("main-nav");

  burgerButton.addEventListener('click', function() {

    if (burgerIsOpen) {
      navMainMenu.classList.remove("open-burger");
      burgerButton.classList.remove("open-burger");
      burgerIsOpen = false;
    } else {
      navMainMenu.setAttribute("class", "open-burger");
      burgerButton.setAttribute("class", "open-burger");
      burgerIsOpen = true;
    }
  }, false)
}
    
    