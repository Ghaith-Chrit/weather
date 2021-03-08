(() => {
  let date = new Date();
  let hours = date.getHours();
  if (hours > 5 && hours < 17) {
    document.body.style.backgroundImage = "url('../public/img/day.png')";
  } else {
    document.body.style.backgroundImage = "url('../public/img/night.png')";
  }
})();
