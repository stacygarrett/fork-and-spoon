// Global app controller
import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import Likes from './models/Likes';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as likesView from './views/likesView';
import { elements, renderLoader, clearLoader } from './views/base';
// import { search } from 'core-js/fn/symbol';

/** Global state of app
 * - Search object
 * - Current recipe object
 * - Shopping list object
 * - Liked Recipes
 */
const state = {};
window.state = state;
// console.log(state.recipe.img);

/** SEARCH CONTROLLER **/
const controlSearch = async () => {
	// 1) Get query from view
	const query = searchView.getInput();
	console.log('query:', query);

	if (query) {
		// 2) New search object and add to state
		state.search = new Search(query);

		// elements.searchRes.innerHTML = '';
		// 3) Prepare UI for results
		searchView.clearInput();
		searchView.clearResults();
		renderLoader(elements.searchRes);
		// searchView.clearSearchTitle();
		// searchView.searchResults(query);

		try {
			// 4) Search for recipes
			await state.search.getResults();

			// 5) Render results on UI
			// console.log(state);
			clearLoader();
			console.log(state.search.result);
			searchView.renderResults(state.search.result);
			searchView.searchResultsFor(query);
		} catch (err) {
			alert('Something is wrong with the search...');
			clearLoader();
		}
	}
};

elements.searchForm.addEventListener('submit', (e) => {
	e.preventDefault();
	controlSearch();
	const searchTitle = document.querySelector('.search-title');
	if (searchTitle) searchTitle.remove();
});

// TESTING
/* window.addEventListener('load', (e) => {
	e.preventDefault();
	controlSearch();
}); */

/* elements.searchResPages.addEventListener('click', (e) => {
	const btn = e.target.closest('.btn-inline');
	if (btn) {
		const goToPage = parseInt(btn.dataset.goto, 10);
		searchView.clearResults();
		searchView.renderResults(state.search.result, goToPage);
	}
}); */

elements.searchResPages.addEventListener('click', (e) => {
	const btn = e.target.closest('.btn-inline');
	if (btn) {
		const goToPage = parseInt(btn.dataset.goto, 10);
		searchView.clearResults();
		searchView.renderResults(state.search.result, goToPage);

		// Highlight selected recipe if on the page containing it
		searchView.highlightSelected(state.recipe.id);
	}
});

/** RECIPE CONTROLLER **/
const controlRecipe = async () => {
	// Get ID from URL
	const id = window.location.hash.replace('#', '');
	// console.log(id);

	if (id) {
		// Prepare UI for changes
		recipeView.clearRecipe();
		renderLoader(elements.recipe);
		// Highlight selected search item
		if (state.search) searchView.highlightSelected(id);
		// Create new recipe object
		state.recipe = new Recipe(id);

		try {
			// Get recipe data
			await state.recipe.getRecipe();
			// console.log(state.recipe.img);
			// console.log(state.recipe.ingredients);
			state.recipe.parseIngredients();
			// Calculate servings and time
			state.recipe.calcTime();
			state.recipe.calcServings();
			// Render Recipe
			// console.log(state.recipe);
			clearLoader();
			recipeView.renderRecipe(state.recipe, state.likes.isLiked(id));
		} catch (err) {
			console.log(err);
			alert('Error processing recipe!');
		}
	}
};

// window.addEventListener('hashchange', controlRecipe);
// window.addEventListener('load', controlRecipe)

[ 'hashchange', 'load' ].forEach((event) => window.addEventListener(event, controlRecipe));

/** LIST CONTROLLER **/
const controlList = () => {
	// Create a new list IF there is none yet
	if (!state.list) state.list = new List();

	// Add each ingredient to the list and UI
	state.recipe.ingredients.forEach((el) => {
		const item = state.list.addItem(el.count, el.unit, el.ingredient);
		listView.renderItem(item);
	});
};

// Handle delete and update list item events
elements.shopping.addEventListener('click', (e) => {
	const id = e.target.closest('.shopping__item').dataset.itemid;
	// Handle the delete button
	if (e.target.matches('.shopping__delete, .shopping__delete *')) {
		// Delete from state
		state.list.deleteItem(id);
		// Delete from UI
		listView.deleteItem(id);

		// Handle the count update;
	} else if (e.target.matches('.shopping__count-value')) {
		const val = parseFloat(e.target.value);
		state.list.updateCount(id, val);
	}
});

/** LIKE CONTROLLER **/
const controlLike = () => {
	if (!state.likes) state.likes = new Likes();
	const { likes, recipe: { id: currentID, title, author, img } } = state;

	// User has NOT yet liked current recipe
	if (!likes.isLiked(currentID)) {
		// Add like to the state
		const newLike = likes.addLike(currentID, title, author, img);

		// Toggle the like button
		likesView.toggleLikeBtn(true);
		// Add like to UI list
		likesView.renderLike(newLike);
		// console.log(newLike);
		console.log(likes);
		// User has HAS liked current recipe
	} else {
		// Remove like from the state
		likes.deleteLike(currentID);

		// Toggle the like button
		likesView.toggleLikeBtn(false);
		// Remove like from UI list
		likesView.deleteLike(currentID);
		console.log(likes);
	}
	likesView.toggleLikeMenu(likes.getNumLikes());
};

// Restore liked recipes on page load
window.addEventListener('load', () => {
	state.likes = new Likes();
	// Restore likes
	state.likes.readStorage();
	// Toggle like menu button
	likesView.toggleLikeMenu(state.likes.getNumLikes());
	// Render the existing likes
	state.likes.likes.forEach((like) => likesView.renderLike(like));
});

// Handling recipe button clicks
elements.recipe.addEventListener('click', (e) => {
	if (e.target.matches('.btn-decrease, .btn-decrease *')) {
		// Decrease button is clicked
		if (state.recipe.servings > 1) {
			state.recipe.updateServings('decrease');
			recipeView.updateServingsIngredients(state.recipe);
		}
	} else if (e.target.matches('.btn-increase, .btn-increase *')) {
		// Increase button is clicked
		state.recipe.updateServings('increase');
		recipeView.updateServingsIngredients(state.recipe);
	} else if (e.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
		// Add ingredients to shopping list
		controlList();
	} else if (e.target.matches('.recipe__love, .recipe__love *')) {
		// Like controller
		controlLike();
	}
	// console.log(state.recipe);
});

// "dev": "webpack --mode development",
