const searchBtn = document.getElementById('search-btn');
const mealList = document.getElementById('meal');
const mealDetailsContent = document.querySelector('.meal-details-content');
const recipeCloseBtn = document.getElementById('recipe-close-btn');

// event listeners
searchBtn.addEventListener('click', getMealList);
mealList.addEventListener('click', getMealRecipe);
recipeCloseBtn.addEventListener('click', () => {
    mealDetailsContent.parentElement.classList.remove('showRecipe');
});

// Replace 'YOUR_SPOONACULAR_API_KEY' with your actual Spoonacular API key
const apiKey = '91fdc9e88999470780cac7019e93a900';

// get meal list that matches with the ingredients
function getMealList() {
    let searchInputTxt = document.getElementById('search-input').value.trim();
    fetch(`https://api.spoonacular.com/recipes/findByIngredients?ingredients=${searchInputTxt}&apiKey=${apiKey}`)
        .then(response => response.json())
        .then(data => {
            let html = "";
            if (data.length > 0) {
                data.forEach(meal => {
                    html += `
                        <div class="meal-item" data-id="${meal.id}">
                            <div class="meal-img">
                                <img src="${meal.image}" alt="food">
                            </div>
                            <div class="meal-name">
                                <h3>${meal.title}</h3>
                                <a href="#" class="recipe-btn">Get Recipe</a>
                            </div>
                        </div>
                    `;
                });
                mealList.classList.remove('notFound');
            } else {
                html = "Sorry, we didn't find any meal!";
                mealList.classList.add('notFound');
            }

            mealList.innerHTML = html;
        })
        .catch(error => {
            console.error("Error fetching data from Spoonacular API:", error);
        });
}

// get recipe of the meal
function getMealRecipe(e) {
    e.preventDefault();
    if (e.target.classList.contains('recipe-btn')) {
        let mealItem = e.target.parentElement.parentElement;
        fetch(`https://api.spoonacular.com/recipes/${mealItem.dataset.id}/information?apiKey=${apiKey}`)
            .then(response => response.json())
            .then(data => mealRecipeModal(data))
            .catch(error => {
                console.error("Error fetching recipe details from Spoonacular API:", error);
            });
    }
}

// create a modal
function mealRecipeModal(meal) {
    console.log(meal);
    let html = `
        <h2 class="recipe-title">${meal.title}</h2>
        <p class="recipe-category">${meal.dishTypes.join(', ')}</p>
        <div class="recipe-instruct">
            <h3>Instructions:</h3>
            <p>${meal.instructions || "No instructions available."}</p>
        </div>
        <div class="recipe-meal-img">
            <img src="${meal.image}" alt="">
        </div>
        <div class="recipe-link">
            <a href="${meal.sourceUrl}" target="_blank">Read More</a>
        </div>
    `;
    mealDetailsContent.innerHTML = html;
    mealDetailsContent.parentElement.classList.add('showRecipe');
}
