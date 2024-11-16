// Selectors with type assertions to avoid possible null values
const searchBox = document.querySelector('.searchBox') as HTMLInputElement;
const searchBtn = document.querySelector('.searchBtn') as HTMLButtonElement;
const recipeContainer = document.querySelector('.recipe-container') as HTMLDivElement;
const recipeDetailsContent = document.querySelector('.recipe-details-content') as HTMLDivElement;
const recipeCloseBtn = document.querySelector('.recipe-close-btn') as HTMLButtonElement;
const frontContainer = document.querySelector('.front-container') as HTMLDivElement;

// Store the initial HTML content of frontContainer
const initialFrontContainerHTML = frontContainer.innerHTML;

// Define the structure of a meal object from API response
interface Meal {
    strMeal: string;
    strMealThumb: string;
    strArea: string;
    strCategory: string;
    strInstructions: string;
    [key: string]: string | null; // To handle dynamic keys for ingredients and measures
}

// Define the structure of the API response
interface ApiResponse {
    meals: Meal[];
}

// Function to get recipes
const fetchRecipes = async (query: string): Promise<void> => {
    recipeContainer.innerHTML = '<h2>Fetching Recipes...</h2>';
    frontContainer.innerHTML = '';

    try {
        const data = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`);
        const response: ApiResponse = await data.json();

        recipeContainer.innerHTML = '';
        response.meals.forEach((meal: Meal) => {
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
    } catch (error) {
        recipeContainer.innerHTML = "<h2>Sorry! We don't have what you're looking for :(</h2>";
    }
};

// Function to fetch ingredients and measurements
const fetchIngredients = (meal: Meal): string => {
    let ingredientsList = '';
    for (let i = 1; i <= 20; i++) {
        const ingredient = meal[`strIngredient${i}`];
        if (ingredient) {
            const measure = meal[`strMeasure${i}`];
            ingredientsList += `<li>${measure} ${ingredient}</li>`;
        } else {
            break;
        }
    }
    return ingredientsList;
};

// Function to open recipe popup
const openRecipePopup = (meal: Meal): void => {
    recipeDetailsContent.innerHTML = `
        <h2 class='recipeName'>${meal.strMeal}</h2>
        <h3>Ingredients:</h3>
        <ul class='ingredientList'>${fetchIngredients(meal)}</ul>
        <div class='recipeInstructions'>
            <h3>Instructions:</h3>
            <p>${meal.strInstructions}</p>
        </div>
    `;
    (recipeDetailsContent.parentElement as HTMLDivElement).style.display = 'block';
};

// Add event listener to close the recipe popup
recipeCloseBtn.addEventListener('click', () => {
    (recipeDetailsContent.parentElement as HTMLDivElement).style.display = 'none';
});

// Add event listener to search button
searchBtn.addEventListener('click', (e: Event) => {
    e.preventDefault(); // Cancels the event if it is cancelable
    const searchInput = searchBox.value.trim(); // Removes whitespace from both sides of a string
    if (!searchInput) {
        recipeContainer.innerHTML = `<h2>Type the meal in the search box.</h2>`;
        frontContainer.innerHTML = initialFrontContainerHTML; // Show the initial front container content when search input is empty
        return;
    }
    fetchRecipes(searchInput);
});
