// Importing reusable functions
import {
  fetchFavourites,
  checkFavourite,
  changeFavouriteStatus,
  ckeckForVeg,
  fetchById
} from "./modules.js";


// Nav-bar
const navBar = document.querySelector('#nav');

// Search Section
const searchContainer = document.querySelector('#search-container');
const searchInput = document.querySelector('#search input');
const searchSuggestion = document.querySelector('#search-suggestion');

// Search Results
const resultHead = document.querySelector('#result-head');
const searchResult = document.querySelector('#search-result');

// Category Section
const categories = document.querySelector('#categories');
const categoryContainer = document.querySelector('#category-container');

// Favourites Page
const favouritesPage = document.querySelector('#favourites-page');
const favouritesHeader = document.querySelector("#favourites-header");
const favouritesList = document.querySelector('#favourite-list');

// Meal Details Page
const mealDetails = document.querySelector('#detail-container');


// Variable to store searched-dish
let dish;




//  ********  Home Page   ********   //



// Function for showing all categories to DOM
(async function(){   
	let res = await fetch('https://www.themealdb.com/api/json/v1/1/categories.php');
	let json = await res.json();
		
	for (let i of json.categories) {
		let div = document.createElement("div");

		div.innerHTML = `<img src="${i.strCategoryThumb}"><p>${i.strCategory}</p>`;

		categories.append(div);
	}
})();



// Function for searching a dish
async function getMeal(){
	// Hiding search suggestion
	searchSuggestion.style.display = 'none';

	// Taking the value of the input for search
	dish = searchInput.value;

	if(dish != ''){

		// API request to search the dish from input
		let searchedDish = await fetchDish(dish);

		// Return the function if no dish is found
		if(searchedDish == false){
			alert('Sorry, This dish is not available');
			return;
		}

		// Showing results of search
		searchResult.classList.remove('hidden');
		resultHead.classList.remove('hidden');
		

		// Camel-casing the dish name
		let dishName = String(dish);
		dishName = dishName[0].toUpperCase() + dishName.substring(1).toLowerCase();

		// Setting header of the search results with dish name
		resultHead.innerText = dishName;
		

		// Smooth scroll to search results
		scroll();
	}
}



// Function for fetching the searched dish
async function fetchDish(dishName){
	let res = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${dishName}`);
	let json = await res.json();

	// Alert if no dish is found
	if(json.meals == null){
		return false;
	}else{
		
		// Clearing previously searched dishes
		searchResult.innerHTML = '';

		// Adding each meal to DOM
		for(let meal of json.meals){
			addMealToDom(meal);
		}
	}
}



// Function for adding searched dishes to DOM
function addMealToDom(jsonMeal){
	let div = document.createElement('div');
	let divText = `
		<div><img src="${jsonMeal.strMealThumb}"></div>
		<span><p class="dishUrl" id="${jsonMeal.idMeal}">${jsonMeal.strMeal}</p></span>
		<small>${jsonMeal.strCategory}</small>
	`;

	// Setting favourite icons for favourite dishes
	divText = checkFavourite(jsonMeal.idMeal, divText);

	div.innerHTML = divText;

	// Adding classes for different colors for veg and non-veg dishes
	ckeckForVeg(jsonMeal.strCategory, div); 
	
	// Append searched item to search-result-container
	searchResult.append(div);
}



// Function for smooth scroll to search-results
function scroll(){
	let interval = setInterval(function(){
		let targetPos = resultHead.getBoundingClientRect().top;
		if(targetPos <= 100){
			clearInterval(interval);
		}else{
			window.scrollBy(0, 10);
		}
	}, 20)
}



// Function for search-suggestion

async function getSearchSuggestion({target}){  
	if (target.value != "") {
		searchSuggestion.style.display = "flex";

		let res = await fetch(
			`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchInput.value}`
		);
		let json = await res.json();

		// Clearing previous search suggestions
		searchSuggestion.innerHTML = "";

		for (let i in json.meals) {
         // Maximum 7 search suggestions (index 0-6)
         if (i > 6) {
            return;
         }

         let p = document.createElement("p");
         p.innerHTML = json.meals[i].strMeal;

         // Added id and class to results (for eventListener)
         p.id = json.meals[i].idMeal;
         p.className = "dishUrl";

         searchSuggestion.append(p);
      }
   }
	// Hiding the suggestions if no value given
	else if (searchInput.value == "") {
    	searchSuggestion.style.display = "none";
   }
}









// ****** Favourite Meals Page ******  //



// Function for showing favourites-page

async function showFavourites(){
	let favourites = fetchFavourites();	

	favouritesHeader.innerHTML = "";
   favouritesList.innerHTML = "";
	
	if(favouritesPage.classList.contains('hidden')){
      // changing navbar style
      navBar.classList.replace("home-nav", "nav-solid");

      // Hiding every element from page and showing the favourites container
      let hide = [
         searchContainer,
         resultHead,
         searchResult,
         categoryContainer,
         mealDetails,
      ];
      hide.forEach((container) => {
         container.classList.add("hidden");
      });
      favouritesPage.classList.remove("hidden");
	}
		
	// Showing text if no dish marked as favourite
	if(favourites.length < 1){
		favouritesPage.classList.replace("favourites", "no-favourites");
		favouritesHeader.innerHTML = '<i class="fa-regular fa-circle-xmark"></i>';
		favouritesList.innerText = "Nothing here yet...";
	}
	// Showing all favourite dishes
	else{
      favouritesPage.classList.replace("no-favourites", "favourites");
		favouritesHeader.innerHTML = "Favourite Meals";		

      for (let id of favourites) {
         let json = await fetchById(id);
         addFavouriteToDom(json);
      }
   }
   	
}
	



// Adding each favourite dish list to DOM

function addFavouriteToDom(json){
   let div = document.createElement("div");
   let divText = `
		<div><img src="${json.strMealThumb}"></div>
		<span>
			<p class="dishUrl" id="${json.idMeal}">${json.strMeal}</p>
			<p>Category: <small>${json.strCategory}</small></p>
			<p>Origin: ${json.strArea}</p>
		</span>
	`;

   // Setting favourite icons for favourite dishes
   divText = checkFavourite(json.idMeal, divText);

   div.innerHTML = divText;

   // Adding classes for different colors for veg and non-veg dishes
   ckeckForVeg(json.strCategory, div);

   favouritesList.append(div);
}






//  ****** Single Meal Details Page ******  //


// Showing meal-details page

async function mealDetailsPage(id){
    
	if(mealDetails.classList.contains('hidden')){
		
		navBar.classList.replace('home-nav', 'nav-solid');
		
		// Hiding every element other than meal-details
		let hide = [searchContainer, resultHead, searchResult, categoryContainer, favouritesPage];
		hide.forEach((container) => {container.classList.add('hidden')});
		mealDetails.classList.remove('hidden');
	}

	
	// Clearing prevouslly searched meal details
	mealDetails.innerHTML = '';   

	let json = await fetchById(id);

	addMealDetailToDom(json);
}



// Adding details of meal to DOM in meal-details page

function addMealDetailToDom(json){
	let div = document.createElement('div');
	let divText = `
		<h1>${json.strMeal}</h1>
		<span class="details">
			<img src="${json.strMealThumb}" id="${json.idMeal}">
			<span>
					<p>Origin : ${json.strArea}</p>
					<p>Category : <small>${json.strCategory}</small></p>
					<p>Check Preperation : <a href="${json.strYoutube}">${json.strYoutube}</a></p>
			</span>
		</span>
		<h2>Instructions :</h2>
	`;

	div.className = 'meal-details';

	// Converting instructions (string -> array)
	let steps = json.strInstructions.split('\r\n');

	// Adding each instructin to unordered list
	let ul = document.createElement('ul');

	steps.forEach((step) => {if(step != ''){ul.innerHTML += `<li>${step}</li>`;}});

	// Setting favourite icons for favourite dishes
	divText = checkFavourite(json.idMeal, divText);

	div.innerHTML = divText;

	// Adding classes for different colors for veg and non-veg dishes
	ckeckForVeg(json.strCategory, div); 
	
	mealDetails.append(div);
	mealDetails.append(ul);
}







//  ****** Back to Home Page(from nav-bar-link) ****** //


function showHomePage(){
    
	if(searchResult.classList.contains('hidden')){
      // changing navbar style
      navBar.classList.replace("nav-solid", "home-nav");

		// Showing every element from home-page and hiding favourites-page
      let show = [searchContainer, resultHead, searchResult, categoryContainer];
      show.forEach((container) => {
         container.classList.remove("hidden");
      });

		// Hiding favourites-page and meal-detail page
      let hide = [favouritesPage, mealDetails];
      hide.forEach((container) => {
         container.classList.add("hidden");
      });
   }
	// Reloading the page for unexpected cases 
	else{
		location.reload();	// <-- will show the home-page by default
	}
}




// ---- All event listeners ---- //


// Keyboard event on search input (for search suggestion)
searchInput.addEventListener("keyup", getSearchSuggestion);

document.onclick = function(e){
  
	// Click event on search button
	if(e.target.id == 'searchBtn'){
		getMeal();
	}

	// Click event on favourite icon
	else if(e.target.classList.contains('fa-heart')){
		changeFavouriteStatus(e.target);
	}

	// Click event on searched dish (details)
	else if(e.target.classList.contains('dishUrl')){
		mealDetailsPage(e.target.id);
	}
	
	// Click event on Favourites-Page link
	else if(e.target.id == 'favouriteUrl'){
		showFavourites();				
	}
	
	// Click event on Home-Page link
	else if(e.target.id == 'homePageUrl'){
		showHomePage();
	}
}