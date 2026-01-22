let searchBtn = document.querySelector('#searchRecipe');
let allRecipe;

searchBtn.addEventListener('click', () => {
  let input = document.querySelector('#inputRecipe');
  let recipe = input.value;
  searchBtn.innerText = '...';
  gettingAPI(recipe)
})

let gettingAPI = async (food) => {
  try {
    let res = await fetch(`https://forkify-api.herokuapp.com/api/v2/recipes?search=${food}`);
    let status = await res.json();

    let { data } = status;
    let { recipes } = data;

    if (recipes.length === 0) {
      searchBtn.innerHTML = `<i class="bi bi-search"></i>`;
      return alert(`${food} is not found!`);
    }

    allRecipe = recipes;
    recipeUI(allRecipe);
    searchBtn.innerHTML = `<i class="bi bi-search"></i>`;
  } catch (err) {
  }
}

async function foodHandler(e) {
  let foodDetails = allRecipe.find(food => {
    return food.id === e.id;
  })

  let { id } = foodDetails;
  let res = await fetch(`https://forkify-api.herokuapp.com/api/v2/recipes/${id}`);
  let result = await res.json();
  let { data } = result;
  let { recipe } = data;
  foodDetailUI(recipe);

  document.querySelector('.recipeData').style.display = 'block'
  document.querySelector('#cross').style.display = 'flex';
  document.querySelector('.totalRecipes').style.height = '250vh';
}

function recipeUI(recipes) {
  document.querySelector('.totalRecipes').innerHTML = null;
  document.querySelector('.recipeData').innerHTML = null;

  let recipeHTML = recipes.map((recipe) => {
    return `<div class="recipe" onclick="foodHandler(this)" id="${recipe.id}">
          <div class="recipeImg">
            <img src="${recipe.image_url}" alt="">
          </div>
          <div class="recipeDetail">
            <h3 class="recipeName pinkish">${recipe.title.length >= 15 ? recipe.title.slice(0, 15) + '...' : recipe.title}</h3>
            <p class="recipeDescription">${recipe.publisher.length >= 15 ? recipe.publisher.slice(0, 15) + '...' : recipe.publisher}</p>
          </div>
        </div>`
  })
  document.querySelector('.totalRecipes').innerHTML += recipeHTML.join(' ');
}

function foodDetailUI(food) {
  let { ingredients } = food;

  document.querySelector('.recipeData').innerHTML = ` 
        <div class="foodImg">
          <img src="${food.image_url}" alt="">
          <div class="foodName">${food.title}</div>
        </div>
        <div class="timeAndServings">
          <div class="timeDuration"><i class="bi bi-clock"></i> ${food.cooking_time} MINUTES</div>
          <div class="survings">
            <i class="bi bi-people"></i>
            <span id="servingVal">${food.servings}</span> SERVINGS
            <span class="survingsChoose">
              <i class="bi bi-plus-circle"></i>
              <i class="bi bi-dash-circle"></i>
            </span>
          </div>
          <span class="bookMark"><i class="bi bi-bookmark"></i></span>
        </div>
        <div class="recipeIngredients">
          <p class="ingredientsHeading pinkish">RECIPE INGREDIENTS</p>
          <ul class="ingredients">
            
          </ul>
        </div>
        <div class="howToCook">
          <p class="cookHeading pinkish">HOW TO COOK IT</p>
          <p>
            This recipe was carefully designed and tested by 101 Cookbooks. Please check out directions at their website.
          </p>
        </div>`

  let ingredientHTML = ingredients.map(ingredient => {
    return `<li><span class="tick">✓</span> <span>${ingredient.quantity} ${ingredient.unit} ${ingredient.description}</span></li>`
  })
  document.querySelector('.ingredients').innerHTML += ingredientHTML.join(' ');
}

function crossBtnHandler() {
  document.querySelector('.recipeData').style.display = 'none';
  document.querySelector('#cross').style.display = 'none';
  document.querySelector('.totalRecipes').style.height = '68vh';
}