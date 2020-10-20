import { elements } from './base';
import { Fraction } from 'fractional';

export const clearRecipe = () => {
	elements.recipe.innerHTML = '';
};

const formatCount = (count) => {
	if (count) {
		count = Math.round((count + Number.EPSILON) * 100) / 100;
		// console.log('count from recipeView.js:', count);
		const [ int, dec ] = count.toString().split('.').map((el) => parseInt(el, 10));
		let frac;
		// console.log(dec);
		if (!dec) return count;

		if (dec >= 6 && dec <= 9) {
			frac = new Fraction(1, 16);
		} else if (dec === 125 || (dec >= 10 && dec <= 19)) {
			frac = new Fraction(1, 8);
		} else if (dec >= 20 && dec <= 29) {
			frac = new Fraction(1, 4);
		} else if (dec >= 30 && dec <= 45) {
			frac = new Fraction(1, 3);
		} else if (dec === 5 || (dec >= 46 && dec <= 58)) {
			frac = new Fraction(1, 2);
		} else if (dec === 625 || (dec >= 59 && dec <= 68)) {
			frac = new Fraction(2, 3);
		} else if (dec >= 69 && dec <= 78) {
			frac = new Fraction(3, 4);
		} else if (dec >= 79 && dec <= 86) {
			frac = new Fraction(5, 6);
		} else if (dec === 875 || (dec >= 87 && dec <= 94)) {
			frac = new Fraction(7, 8);
		} else if (dec >= 94) {
			frac = new Fraction(8, 8);
		}

		if (int >= 1) {
			return `${int} ${frac}`;
		} else {
			return frac;
		}
	}
	return '';
};

const titleName = (name) => {
	if (name === 'recipeTitle') name = 'recipe__title';
	else if (name === 'recipeDetail') name = 'recipe__details';
	return name;
};

const titleFunction = (name) => {
	let className = titleName(name);
	return function(length) {
		if (length >= 31 && length <= 54) {
			return `"${className} ${className}-med"`;
		} else if (length > 55) {
			return `"${className} ${className}-lg"`;
		} else {
			return `"${className}"`;
		}
	};
};

const createIngredient = (ingredient) => `
    <li class="recipe__item">
        <svg class="recipe__icon">
            <use href="img/icons.svg#icon-check"></use>
        </svg>
        <div class="recipe__count">${formatCount(ingredient.count)}</div>
        <div class="recipe__ingredient">
            <span class="recipe__unit">${ingredient.unit}</span>
            ${ingredient.ingredient}
        </div>
    </li>
`;

export const renderRecipe = (recipe, isLiked) => {
	const markup = `
        <figure class="recipe__fig">
            <img src="${recipe.img}" alt="${recipe.title}" class="recipe__img">
            <h1 class=${titleFunction(titleName('recipeTitle'))(recipe.title.length)}>
                <span>${recipe.title}</span>
            </h1>
        </figure>

        <div class=${titleFunction(titleName('recipeDetail'))(recipe.title.length)}>
            <div class="recipe__info">
                <svg class="recipe__info-icon">
                    <use href="img/icons.svg#icon-stopwatch"></use>
                </svg>
                <span class="recipe__info-data recipe__info-data--minutes">${recipe.time}</span>
                <span class="recipe__info-text"> minutes</span>
            </div>
            <div class="recipe__info">
                <svg class="recipe__info-icon">
                    <use href="img/icons.svg#icon-man"></use>
                </svg>
                <span class="recipe__info-data recipe__info-data--people">${recipe.servings}</span>
                <span class="recipe__info-text"> servings</span>

                <div class="recipe__info-buttons">
                    <button class="btn-tiny btn-decrease">
                        <svg>
                            <use href="img/icons.svg#icon-circle-with-minus"></use>
                        </svg>
                    </button>
                    <button class="btn-tiny btn-increase">
                        <svg>
                            <use href="img/icons.svg#icon-circle-with-plus"></use>
                        </svg>
                    </button>
                </div>

            </div>
            <button class="recipe__love">
                <svg class="header__likes">
                    <use href="img/icons.svg#icon-heart${isLiked ? '' : '-outlined'}"></use>
                </svg>
            </button>
        </div>

        <div class="recipe__ingredients">
            <ul class="recipe__ingredient-list">
                ${recipe.ingredients.map((el) => createIngredient(el)).join('')}

            
            </ul>

            <button class="btn-small recipe__btn recipe__btn--add">
                <svg class="search__icon">
                    <use href="img/icons.svg#icon-shopping-cart"></use>
                </svg>
                <span>Add to shopping list</span>
            </button>
        </div>

        <div class="recipe__directions">
            <h2 class="heading-2">How to cook it</h2>
            <p class="recipe__directions-text">
                This recipe was carefully designed and tested by
                <span class="recipe__by">${recipe.author}</span>. Please check out directions at their website.
            </p>
            <a class="btn-small recipe__btn" href="${recipe.url}" target="_blank">
                <span>Directions</span>
                <svg class="search__icon">
                    <use href="img/icons.svg#icon-triangle-right"></use>
                </svg>

            </a>
        </div>
    `;
	elements.recipe.insertAdjacentHTML('afterbegin', markup);
};

export const updateServingsIngredients = (recipe) => {
	// Update servings
	document.querySelector('.recipe__info-data--people').textContent = recipe.servings;
	// Update ingredients
	const countElements = Array.from(document.querySelectorAll('.recipe__count'));
	countElements.forEach((el, i) => {
		el.textContent = formatCount(recipe.ingredients[i].count);
	});
};
