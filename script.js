"use strict";
// Selectors with type assertions to avoid possible null values
const searchBox = document.querySelector('.searchBox');
const searchBtn = document.querySelector('.searchBtn');
const recipeContainer = document.querySelector('.recipe-container');
const recipeDetailsContent = document.querySelector('.recipe-details-content');
const recipeCloseBtn = document.querySelector('.recipe-close-btn');
const frontContainer = document.querySelector('.front-container');
// Store the initial HTML content of frontContainer
const initialFrontContainerHTML = frontContainer.innerHTML;
// Function to get recipes
const fetchRecipes = async (query) => {
    recipeContainer.innerHTML = '<h2>Fetching Recipes...</h2>';
    frontContainer.innerHTML = '';
    try {
        const data = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`);
        const response = await data.json();
        recipeContainer.innerHTML = '';
        response.meals.forEach((meal) => {
            const recipeDiv = document.createElement('div');
            recipeDiv.classList.add('recipe');
            recipeDiv.innerHTML = `
                <img src='${meal.strMealThumb}' alt='${meal.strMeal}'>
                <h3>${meal.strMeal}</h3>
                <p><span>${meal.strArea}</span> Dish</p>
                <p>Belongs to <span>${meal.strCategory}</span> Category</p>
            `;
            const button = document.createElement('button');
            button.textContent = 'View Recipe';
            recipeDiv.appendChild(button);
            // Adding EventListener to recipe button
            button.addEventListener('click', () => {
                openRecipePopup(meal);
            });
            recipeContainer.appendChild(recipeDiv);
        });
    }
    catch (error) {
        recipeContainer.innerHTML = "<h2>Sorry! We don't have what you're looking for :(</h2>";
    }
};
// Function to fetch ingredients and measurements
const fetchIngredients = (meal) => {
    let ingredientsList = '';
    for (let i = 1; i <= 20; i++) {
        const ingredient = meal[`strIngredient${i}`];
        if (ingredient) {
            const measure = meal[`strMeasure${i}`];
            ingredientsList += `<li>${measure} ${ingredient}</li>`;
        }
        else {
            break;
        }
    }
    return ingredientsList;
};
// Function to open recipe popup
const openRecipePopup = (meal) => {
    recipeDetailsContent.innerHTML = `
        <h2 class='recipeName'>${meal.strMeal}</h2>
        <h3>Ingredients:</h3>
        <ul class='ingredientList'>${fetchIngredients(meal)}</ul>
        <div class='recipeInstructions'>
            <h3>Instructions:</h3>
            <p>${meal.strInstructions}</p>
        </div>
    `;
    recipeDetailsContent.parentElement.style.display = 'block';
};
// Add event listener to close the recipe popup
recipeCloseBtn.addEventListener('click', () => {
    recipeDetailsContent.parentElement.style.display = 'none';
});
// Add event listener to search button
searchBtn.addEventListener('click', (e) => {
    e.preventDefault(); // Cancels the event if it is cancelable
    const searchInput = searchBox.value.trim(); // Removes whitespace from both sides of a string
    if (!searchInput) {
        recipeContainer.innerHTML = `<h2>Type the meal in the search box.</h2>`;
        frontContainer.innerHTML = initialFrontContainerHTML; // Show the initial front container content when search input is empty
        return;
    }
    fetchRecipes(searchInput);
});
//# sourceMappingURL=script.js.map