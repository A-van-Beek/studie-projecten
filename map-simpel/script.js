/*
Deel 1:
- verwijder dubbele opdrachtregels
*/

const bigFive = document.getElementsByClassName("big-five-list-item");
const lion = bigFive[0];
const leopard = bigFive[1];
const elephant = bigFive[2];
const rhino = bigFive[3];
const buffalo = bigFive[4];

lion.addEventListener("click", clickLion);

function clickLion() {
  const newLi = document.createElement("li");
  const menuSpotted = document.getElementById("spotted-animals-list");
  menuSpotted.insertBefore(newLi, menuSpotted.getElementsByTagName("li")[0]);
  newLi.innerHTML = "Lion";
}

leopard.addEventListener("click", clickLeopard);

function clickLeopard() {
  const newLi = document.createElement("li");
  const menuSpotted = document.getElementById("spotted-animals-list");
  menuSpotted.insertBefore(newLi, menuSpotted.getElementsByTagName("li")[0]);
  newLi.innerHTML = "Leopard";
}

elephant.addEventListener("click", clickElephant);

function clickElephant() {
  const newLi = document.createElement("li");
  const menuSpotted = document.getElementById("spotted-animals-list");
  menuSpotted.insertBefore(newLi, menuSpotted.getElementsByTagName("li")[0]);
  newLi.innerHTML = "Elephant";
}

rhino.addEventListener("click", clickRhino);

function clickRhino() {
  const newLi = document.createElement("li");
  const menuSpotted = document.getElementById("spotted-animals-list");
  menuSpotted.insertBefore(newLi, menuSpotted.getElementsByTagName("li")[0]);
  newLi.innerHTML = "Rhino";
}

buffalo.addEventListener("click", clickBuffalo);

function clickBuffalo() {
  const newLi = document.createElement("li");
  const menuSpotted = document.getElementById("spotted-animals-list");
  menuSpotted.insertBefore(newLi, menuSpotted.getElementsByTagName("li")[0]);
  newLi.innerHTML = "Buffalo";
}

