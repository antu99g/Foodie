// Fetching favourite dishes from local-storage

export function fetchFavourites() {
  let favourites = localStorage.getItem("favourites");

  if(favourites == null){
    favourites = [];
  }
  if (favourites.length > 0) {
    favourites = favourites.split(",");
  } else {
    favourites = [];
  }

  return favourites;
}



// Adding different heart-icons for favourite & not-favourite items

export function checkFavourite(id, text) {
  let favourites = fetchFavourites();
  
  if (favourites.includes(id)) {
    text += `<i class="fa-solid fa-heart" data-id=${id}></i>`;
  } else {
    text += `<i class="fa-regular fa-heart" data-id=${id}></i>`;
  }
  return text;
}



// Function for adding and removing favourite dishes
export function changeFavouriteStatus(target) {
  let favourites = fetchFavourites();

  // Adding dish to favourites
  if (target.classList.contains("fa-regular")) {
    target.classList.replace("fa-regular", "fa-solid");
    favourites.push(target.dataset.id);
  }

  // Removing dish from favourites
  else if (target.classList.contains("fa-solid")) {
    target.classList.replace("fa-solid", "fa-regular");

    favourites = favourites.filter((item) => item != target.dataset.id);
  }

  // Sending array of ids of favourite-dishes to local-storage
  localStorage.setItem("favourites", favourites);
}



// Setting different colors for veg and non-veg dishes
export function ckeckForVeg(category, div) {
  // Array of all veg-categories
  let vegCategory = ["Vegetarian", "Dessert", "Pasta", "Vegan"];
  
  // Array of all non-veg-categories
  let nonvegCategory = ["Beef", "Chicken", "Lamb", "Pork", "Seafood", "Egg"];
  
  // Array of all general-categories
  let general = ["Side", "Miscellaneous", "Starter"];

  if (vegCategory.includes(category)) {
    div.className = "green";
  } else if (nonvegCategory.includes(category)) {
    div.className = "red";
  } else if (general.includes(category)) {
    div.className = "orangered";
  } else {
    div.className = "orange";
  }
  return div;
}



// Fetching dishes by id
export async function fetchById(id) {
  let res = await fetch(
    `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
  );
  let json = await res.json();

  return json.meals[0];
}