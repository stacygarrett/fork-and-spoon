// Global app controller
import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import Likes from './models/Likes';
import LikesSearch from './models/LikesSearch';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as likesView from './views/likesView';
import * as main from './views/main';
import { elements, cats, renderLoader, clearLoader } from './views/base';
import { all, allArr } from './categories';

const state = {};
window.state = state;
// window.localStorage.clear();

/** SEARCH CONTROLLER **/
const controlSearch = async () => {
	// 1) Get query from view
	const query = searchView.getInput();
	console.log('query:', query);
	searchQuery(query);
};

const searchQuery = async (query) => {
	if (query) {
		// 2) New search object and add to state
		state.search = new Search(query);

		// 3) Prepare UI for results
		searchView.clearInput();
		searchView.clearResults();
		renderLoader(elements.searchRes);

		try {
			// 4) Search for recipes
			await state.search.getResults();

			// 5) Render results on UI
			clearLoader();
			searchView.renderResults(state.search.result);
			searchView.searchResultsFor(query);
			searchView.highlightSelected(state.recipe.id);
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

	if (id) {
		// Prepare UI for changes
		recipeView.clearRecipe();
		renderLoader(elements.recipe);
		// Highlight selected search item
		if (state.search) searchView.highlightSelected(id);
		if (state.likes) likesView.highlightSelected2(id);
		// Create new recipe object
		state.recipe = new Recipe(id);

		try {
			// Get recipe data
			await state.recipe.getRecipe();
			setTimeout(() => {
				state.recipe.calcServings(state.recipe.url);
			}, 8000);
			state.recipe.parseIngredients();

			state.recipe.calcTime();
			// Render Recipe
			clearLoader();
			recipeView.renderRecipe(state.recipe, state.likes.isLiked(id));

			setTimeout(() => {
				recipeView.updateDynamicServings(state.recipe.recipeServings);
			}, 10000);
			state.recipe.denominator();
		} catch (err) {
			console.log(err);
			alert('Error processing recipe!');
		}
	}
};

[ 'hashchange', 'load' ].forEach((event) => window.addEventListener(event, controlRecipe));

/** LIST CONTROLLER **/
const controlList = () => {
	// Create a new list IF there is none yet
	if (!state.list) {
		state.list = new List();
		const id = state.list.id;
		listView.shoppingListTitle(state.list.items.length);

		if (!state.list.isOnList(id)) {
			state.recipe.ingredients.forEach((el) => {
				const item = state.list.addItem(el.count, el.unit, el.ingredient, el.title);
				console.log('item:', item);

				listView.renderItem(item);
			});
		}
	} else {
		state.recipe.ingredients.forEach((el) => {
			// Check for duplicates
			const id = state.list.duplicateID(el.ingredient, el.unit);
			if (!id) {
				const item = state.list.addItem(el.count, el.unit, el.ingredient, el.title);
				listView.renderItem(item);
			} else {
				state.list.getCount(el.id);
			}
		});
	}

	listView.toggleListMenu(state.list.getNumList());
	const deleteBtn = document.querySelector('.delete-all__btn');
	if (!deleteBtn) {
		listView.deleteBtn();
	}
	if (deleteBtn) {
		deleteBtn.addEventListener('click', (e) => {
			if (e.target.closest('.delete-all__btn', '.delete-all__btn *')) {
				state.list.deleteAll(state.list);
				listView.refreshShopping(state.list.items);
			}
		});
	}
};

// Handle delete and update list item events
if (elements.shopping)
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
	likesView.highlightSelected2(currentID);

	// User has NOT yet liked current recipe
	if (!likes.isLiked(currentID)) {
		// Add like to the state(currentID));
		let timeStamp = new Date().getTime();
		const newLike = likes.addLike(currentID, title, author, img, timeStamp);

		// Toggle the like button
		// Add like to UI list
		likesView.renderLike(newLike);
		likesView.toggleLikeBtn(true);

		// User has HAS liked current recipe
	} else {
		// Remove like from the state
		likes.deleteLike(currentID);
		// Toggle the like button
		likesView.toggleLikeBtn(false);
		// Remove like from UI list
		likesView.deleteLike(currentID);
	}
};

const favoriteSearch = () => {
	const query = likesView.getInput();

	if (query) {
		state.likesQuery = new LikesSearch(query);
		state.likesQuery.filterFaves();
		const results = state.likesQuery.result;
		if (results.length > 0) {
			elements.removeFaveBtn.style.zIndex = '100';
			likesView.clearLikesList();
			likesView.clearInput();
			results.forEach((filteredLike) => likesView.renderLike(filteredLike));
			document.querySelector('.filter-remove').style.zIndex = '0';
		} else {
			elements.popUpWarning.style.zIndex = '101';
			elements.popUpWarning.style.opacity = '1';
			likesView.clearInput();
		}
	}
};

elements.searchFavesBtn.addEventListener('click', (e) => {
	e.preventDefault();
	favoriteSearch();
	elements.dropdown.style.visibility = 'hidden';
	elements.dropdown.style.opacity = '0';
});

elements.removeFaveBtn.addEventListener('click', () => {
	likesView.clearResults();
	document.querySelector('.filter-remove').style.zIndex = '-10';
	state.likes.likes.forEach((like) => likesView.renderLike(like));
});

const clearSearchWarning = () => {
	elements.popUpWarning.style.zIndex = '-100';
	elements.popUpWarning.style.opacity = '0';
};

window.addEventListener('keypress', (e) => {
	if (e.key === 'Enter' || e.code == '13') clearSearchWarning();
});

window.addEventListener('click', (e) => {
	if (e.target.matches('.alert-btn-ok, .alert-btn-ok *')) clearSearchWarning();
});

// Restore Search results column on page load
window.addEventListener('load', async () => {
	state.search = new Search();
	state.search.readStorage();
	if (state.search.query !== undefined) {
		await state.search.getResults();
		searchView.renderResults(state.search.result);
		searchView.searchResultsFor(state.search.query);
		searchView.highlightSelected(state.recipe.id);
	}
});

// Restore shopping List on page load
window.addEventListener('load', () => {
	if (!state.list) state.list = new List();

	state.list = new List();
	state.list.readStorage();
	listView.shoppingListTitle(state.list.items.length);

	state.list.items.forEach((el) => {
		listView.renderItem(el);
	});
	const length = state.list.items.length;
	const deleteBtn = document.querySelector('.delete-all__btn');
	if (!deleteBtn && length > 0) {
		listView.deleteBtn();
	}
	if (document.querySelector('.delete-all__btn')) {
		document.querySelector('.delete-all__btn').addEventListener('click', (e) => {
			if (e.target.closest('.delete-all__btn', '.delete-all__btn *')) {
				state.list.deleteAll(state.list);
				listView.refreshShopping(state.list.items);
			}
		});
	}
});

// Restore Liked recipes on page load
window.addEventListener('load', () => {
	if (!state.likes) state.likes = new Likes();
	if (!state.recipe) state.recipe = new Recipe();
	state.likes.readStorage();

	const { likes, recipe: { id: currentID } } = state;

	let order = '';
	if (order === '') {
		likes.likes.forEach((like) => {
			likesView.renderLike(like);
		});
	}

	likesView.highlightSelected2(currentID);
});

// dropdown Menu for favorites
document.querySelector('.dropdown').addEventListener('mouseenter', () => {
	if (elements.dropdown.style.visibility === 'hidden') elements.dropdown.style.visibility = 'visible';
	if (elements.dropdown.style.opacity === '0') elements.dropdown.style.opacity = '1';
});
elements.dropdown.addEventListener('mouseleave', () => {
	if (elements.dropdown.style.visibility === 'visible') elements.dropdown.style.visibility = 'hidden';
	if (elements.dropdown.style.opacity === '1') elements.dropdown.style.opacity = '0';
});

elements.dropdown.addEventListener('click', (e) => {
	let { likes } = state.likes;
	let order = '';
	if (e.target.matches('.descend')) {
		order = 'descend';
		likes.sort((a, b) => a.timeStamp - b.timeStamp);
		likesView.clearLikesList();
		likes.forEach((like) => {
			likesView.renderLike(like);
		});
	} else if (e.target.matches('.ascend')) {
		order = 'ascend';
		likes.sort((a, b) => b.timeStamp - a.timeStamp);
		likesView.clearLikesList();
		likes.forEach((like) => {
			likesView.renderLike(like);
		});
	} else if (e.target.matches('.alpha-forwards')) {
		order = 'alpha-forwards';
		likes.sort((a, b) => b.title.localeCompare(a.title));
		likesView.clearLikesList();
		likes.forEach((like) => {
			likesView.renderLike(like);
		});
	} else if (e.target.matches('.alpha-backwards')) {
		order = 'alpha-backwards';
		likesView.clearLikesList();
		likes.sort((a, b) => a.title.localeCompare(b.title));
		likes.forEach((like) => {
			likesView.renderLike(like);
		});
	}
	return { likes, order };
});

// Handling recipe button clicks
elements.recipe.addEventListener('click', (e) => {
	let recipe = state.recipe;
	if (e.target.matches('.btn-decrease, .btn-decrease *')) {
		// Decrease button is clicked

		if (recipe.servings > recipe.increment) {
			recipe.updateServings('decrease');
			recipe.updateCount('decrease');
			recipeView.updateServingsIngredients(recipe);
			recipe.incrementDenominator('decrease');
		}
	} else if (e.target.matches('.btn-increase, .btn-increase *')) {
		// Increase button is clicked
		recipe.updateServings('increase');
		recipe.updateCount('increase');
		recipeView.updateServingsIngredients(recipe);
		recipe.incrementDenominator('increase');
	} else if (e.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
		// Add ingredients to shopping list
		controlList();
	} else if (e.target.matches('.recipe__love, .recipe__love *')) {
		// Like controller
		controlLike();
	}
});

elements.deleteFaves.addEventListener('mouseover', () => {
	elements.deleteFaves.innerText = 'WARNING: CANNOT BE UNDONE';
});
elements.deleteFaves.addEventListener('mouseout', () => {
	elements.deleteFaves.innerText = 'DELETE ALL';
});
elements.deleteFaves.addEventListener('click', (e) => {
	if (e.target.matches('.delete-likes')) {
		// render alert pop-up window
		elements.alertBox.style.zIndex = '100';
	}
});

elements.yesBtn.addEventListener('click', (e) => {
	if (e.target.closest('.alert-btn-yes', '.alert-btn-yes *')) {
		likesView.clearLikesList();
		state.likes.deleteAllLikes();
		likesView.hideWindow();
	}
});

elements.noBtn.addEventListener('click', (e) => {
	if (e.target.closest('.alert-btn-no', '.alert-btn-no *')) {
		elements.alertBox.style.zIndex = '-100';
	}
});

main.mainMenu(cats);
const newCats = cats.concat(all);
// Event Listener for Category Cards
newCats.forEach((name) => {
	let cards = document.querySelectorAll('.card');
	cards.forEach((card) => {
		card.addEventListener('click', (e) => {
			if (e.target.closest(`.${name}`)) {
				main.clearMenu();
				main.renderList(name);
				main.renderTitle2();
				searchClick();
			}
		});
	});
});

function searchClick() {
	document.querySelectorAll('.cat__list-name').forEach((node) => {
		node.addEventListener('click', (e) => {
			searchQuery(e.target.innerText);
			const searchTitle = document.querySelector('.search-title');
			if (searchTitle) searchTitle.remove();
		});
	});
	document.querySelector('.back__btn').addEventListener('click', (e) => {
		if (e.target.closest('.back__btn')) {
			main.clearList();
			main.mainMenu(cats);
		}
	});
}

const cardClick = (e) => {
	if (e.target.matches('.card')) return;
	newCats.forEach((name) => {
		let cards = document.querySelectorAll('.card');
		cards.forEach((card) => {
			card.addEventListener('click', (e) => {
				if (e.target.closest(`.${name}`)) {
					main.clearMenu();
					main.renderList(name);
					main.renderTitle2();
					searchClick();
				}
			});
		});
	});
};

const allClick = (e) => {
	if (e.target.matches('.all')) return;
	if (document.querySelector('.all')) {
		allArr.forEach((name) => {
			if (e.target.innerText === name) {
				searchQuery(e.target.innerText);
				const searchTitle = document.querySelector('.search-title');
				if (searchTitle) searchTitle.remove();
				document.querySelector('.back__btn').addEventListener('click', (e) => {
					if (e.target.closest('.back__btn')) {
						main.clearList();
						main.mainMenu(cats);
					}
				});
			}
		});
	}
};

document.querySelector('.recipe').addEventListener('click', cardClick);
document.querySelector('.recipe').addEventListener('click', allClick);
