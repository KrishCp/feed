/* eslint-disable import/extensions */
import HomeScreen from "./screens/HomeScreen.js";
import DonationScreen from "./screens/DonationScreen.js";
import { parseRequestUrl }  from "./utils.js";
import Error404Screen from "./screens/Error404Screen.js";
import donationsScreen from "./screens/donationsScreen.js";
import AboutScreen from "./screens/AboutScreen.js";
import CreatorScreen from "./screens/CreatorScreen.js";


const routes = {
  "/": HomeScreen,
  "/donation/:id": DonationScreen,
  "/donations/:id": donationsScreen,
  "/donations": donationsScreen,
  "/about": AboutScreen,
  "/creator": CreatorScreen,
  
  
};
const router = async() => {
  const request = parseRequestUrl();
  const parseUrl = 
  (request.resource ? `/${request.resource}` : '/') +
  (request.id ? '/:id' : '') +
  (request.verb ? `/${request.verb}` : '');
console.log(request);
const screen = routes[parseUrl] ? routes[parseUrl] : Error404Screen;

  const main = document.getElementById('main-container');
  main.innerHTML = await screen.render();
  await screen.after_render(); 
};

window.addEventListener("load", router);
window.addEventListener("hashchange", router);