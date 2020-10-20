// Global app controller
import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import Likes from './models/Likes';
import LikesSearch from './models/LikesSearch';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView2 from './views/listView2';
// import * as listView from './views/listView';
import * as likesView from './views/likesView';
import * as main from './views/main';
import { proteins, dishes, fruits, veggies, sweets, misc } from './categories';
// import { proteinsArr, dishesArr, fruitsArr, veggiesArr, sweetsArr, miscArr } from './categories';
import { elements, cats, renderLoader, clearLoader } from './views/base';
// import { search } from 'core-js/fn/symbol';

/** Global state of app
 * - Search object
 * - Current recipe object
 * - Shopping list object
 * - Liked Recipes
 */

const state = {};
window.state = state;
// let num = 4;
// console.log('state:', state);
// window.localStorage.clear();
// console.log(state.recipe.img);

/* const request = new XMLHttpRequest();
const proxyurl = 'https://cors-anywhere.herokuapp.com/';
const url = 'https://www.allrecipes.com/recipe/11758/baked-ziti-i/'; // site that doesn’t send Access-Control-* */

// });
// main.renderImage('proteins');
// });

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
			// console.log(state.search.result);
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
	// console.log(id);

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
			console.log(state.recipe.img);
			setTimeout(() => {
				state.recipe.calcServings(state.recipe.url);
			}, 8000);
			// console.log('state.recipe:', state.recipe);
			state.recipe.parseIngredients();

			state.recipe.calcTime();
			// Render Recipe
			clearLoader();
			recipeView.renderRecipe(state.recipe, state.likes.isLiked(id));

			console.log('state.recipe:', state.recipe);

			setTimeout(() => {
				recipeView.updateDynamicServings(state.recipe.recipeServings);
			}, 9000);
			state.recipe.denominator();
			// console.log('state.recipe.denom:', state.recipe.denom);
		} catch (err) {
			console.log(err);
			alert('Error processing recipe!');
		}
	}
};

[ 'hashchange', 'load' ].forEach((event) => window.addEventListener(event, controlRecipe));

/* const request = new XMLHttpRequest();
const proxyurl = 'https://cors-anywhere.herokuapp.com/';
const url = 'https://www.allrecipes.com/recipe/11758/baked-ziti-i/'; // site that doesn’t send Access-Control-*

[ 'hashchange', 'load' ].forEach((event) =>
	request.addEventListener(event, () => {
		console.log('request worked!');
		const data = JSON.stringify(request.responseText);
		// console.log(data.search('recipeYield'));
		console.log(data.search('recipeYield'));
		const recipeYieldIndex = data.search('recipeYield');
		console.log(data.search('servings'));
		const servingsIndex = data.search('servings');
		// console.log(data.substr(data.search('recipeYield'), data.search('servings')));
		// console.log(data.substr(7720, 20));
		let str = data.substr(recipeYieldIndex, servingsIndex);
		let num = parseInt(str.match(/\d+/)[0]);
		console.log(num);
		return { num };
	})
);

// console.log('servings:', servings);
// request.addEventListener('load', findServings);
// console.log(num);
request.open('GET', `${proxyurl}${url}`);
request.send();
console.log('request sent!'); */

/* const findServings = () => {
	console.log('request worked!');
	const data = JSON.stringify(request.responseText);
	// console.log(data.search('recipeYield'));
	console.log(data.search('recipeYield'));
	const recipeYieldIndex = data.search('recipeYield');
	console.log(data.search('servings'));
	const servingsIndex = data.search('servings');
	// console.log(data.substr(data.search('recipeYield'), data.search('servings')));
	// console.log(data.substr(7720, 20));
	let str = data.substr(recipeYieldIndex, servingsIndex);
	let num = parseInt(str.match(/\d+/)[0]);
	console.log(num);
	return { num };
}; */
// console.log(num);

/** MAIN MENU */
/* const mainMenu = () => {
	main.renderCard();
	main.renderTitle();
	main.getCategories();
	main.renderAllBtn();
};

mainMenu(); */

/** CATEGORY LISTS **/

/* elements.logo.addEventListener('click', (e) => {
	if (e.target.matches('.header__logo')) {
		console.log('You clicked on the logo');
		recipeView.clearRecipe();
		main.renderTitle();
		main.renderCard();
		getCategories();
	}
}); */

/** LIST CONTROLLER **/
const controlList = () => {
	// Create a new list IF there is none yet
	// console.log('title:', state.recipe.title);
	// if (!state.recipe.title) listView2.renderTitle(state.recipe.title);
	/* const titles = { title: [], id: [] };
	const title = `${String(state.recipe.title)}`;
	const id = `${String(state.recipe.id)}`;
	titles.title.push(title);
	titles.id.push(id);
	console.log('titles:', titles); */

	// listView2.renderTitle(title.toUpperCase());
	if (!state.list) {
		state.list = new List();
		const id = state.list.id;
		console.log(id);
		listView2.shoppingListTitle(state.list.items.length);

		if (!state.list.isOnList(id)) {
			state.recipe.ingredients.forEach((el) => {
				const item = state.list.addItem(el.count, el.unit, el.ingredient, el.title);
				// console.log('el.id:', el.id);
				console.log('item:', item);

				listView2.renderItem(item);
			});
		}
	} else {
		state.recipe.ingredients.forEach((el) => {
			// Check for duplicates
			const id = state.list.duplicateID(el.ingredient, el.unit);
			// console.log(id);
			if (!id) {
				// Add ingredients to list if not duplicate
				const item = state.list.addItem(el.count, el.unit, el.ingredient, el.title);
				// listView2.renderTitle(el.title);
				listView2.renderItem(item);
			} else {
				state.list.getCount(el.id);
			}
		});
	}

	listView2.toggleListMenu(state.list.getNumList());
	const deleteBtn = document.querySelector('.delete-all__btn');
	if (!deleteBtn) {
		listView2.deleteBtn();
	}
	if (deleteBtn) {
		deleteBtn.addEventListener('click', (e) => {
			if (e.target.closest('.delete-all__btn', '.delete-all__btn *')) {
				state.list.deleteAll(state.list);
				listView2.refreshShopping(state.list.items);
				// window.reload();
			}
		});
	}
};

// Handle delete and update list item events
if (elements.shopping)
	elements.shopping.addEventListener('click', (e) => {
		const id = e.target.closest('.shopping__item').dataset.itemid;
		// Handle the delete button
		// console.log('id from index:', id);
		if (e.target.matches('.shopping__delete, .shopping__delete *')) {
			// Delete from state
			state.list.deleteItem(id);
			// Delete from UI
			listView2.deleteItem(id);

			// Handle the count update;
		} else if (e.target.matches('.shopping__count-value')) {
			const val = parseFloat(e.target.value);

			// listView2.updateItem(id, val);
			state.list.updateCount(id, val);
		}
	});

/** LIKE CONTROLLER **/
// state.likes = new Likes();
const controlLike = () => {
	// debugger;
	if (!state.likes) state.likes = new Likes();
	// console.log(state.likes);
	const { likes, recipe: { id: currentID, title, author, img } } = state;
	// console.log('currentID:', currentID);
	likesView.highlightSelected2(currentID);
	// User has NOT yet liked current recipe
	// console.log('likes:', likes);
	if (!likes.isLiked(currentID)) {
		// console.log('!likes:', !likes.isLiked(currentID));
		// Add like to the state(currentID));
		let timeStamp = new Date().getTime();
		const newLike = likes.addLike(currentID, title, author, img, timeStamp);
		// console.log(newLike);
		// Toggle the like button
		// Add like to UI list
		likesView.renderLike(newLike);
		likesView.toggleLikeBtn(true);
		// likesView.renderResults(likes.likes);
		// renderLoader(elements.likesList);
		// console.log(newLike);
		// console.log('likes from controlLike():', likes);
		// User has HAS liked current recipe
	} else {
		// clearLoader();
		// Remove like from the state
		likes.deleteLike(currentID);
		// Toggle the like button
		likesView.toggleLikeBtn(false);
		// Remove like from UI list
		likesView.deleteLike(currentID);
		// console.log(likes);
	}
};

const favoriteSearch = () => {
	const query = likesView.getInput();

	// console.log('query:', query);
	if (query) {
		state.likesQuery = new LikesSearch(query);
		state.likesQuery.filterFaves();
		const results = state.likesQuery.result;
		// console.log('result', state.likesQuery.filterFaves());
		if (results.length > 0) {
			elements.removeFaveBtn.style.zIndex = '100';
			likesView.clearLikesList();
			likesView.clearInput();
			results.forEach((filteredLike) => likesView.renderLike(filteredLike));
			// console.log(document.querySelector('.filter-remove'));
			document.querySelector('.filter-remove').style.zIndex = '0';
		} else {
			elements.popUpWarning.style.zIndex = '101';
			elements.popUpWarning.style.opacity = '1';
			// elements.popUpWarning.style.visibility = 'visible';
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
	/* 	elements.dropdown.style.visibility = 'visible';
	elements.dropdown.style.opacity = '1'; */
	// elements.popUpWarning.style.visibility = 'hidden';
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
	// listView2.renderTitle(state.recipe.title);

	state.list = new List();
	state.list.readStorage();
	// console.log('state.list:', state.list);
	listView2.shoppingListTitle(state.list.items.length);

	state.list.items.forEach((el) => {
		listView2.renderItem(el);
	});
	const length = state.list.items.length;
	const deleteBtn = document.querySelector('.delete-all__btn');
	if (!deleteBtn && length > 0) {
		listView2.deleteBtn();
	}
	if (document.querySelector('.delete-all__btn')) {
		document.querySelector('.delete-all__btn').addEventListener('click', (e) => {
			if (e.target.closest('.delete-all__btn', '.delete-all__btn *')) {
				state.list.deleteAll(state.list);
				listView2.refreshShopping(state.list.items);
				// window.reload();
			}
		});
	}
});

// Restore Liked recipes on page load
window.addEventListener('load', () => {
	if (!state.likes) state.likes = new Likes();
	if (!state.recipe) state.recipe = new Recipe();
	state.likes.readStorage();
	console.log('likes:', state.likes);
	// console.log(state.recipe);
	const { likes, recipe: { id: currentID } } = state;
	// console.log('likes from window load:', likes.likes);
	// console.log('order:', likes.order);
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
	// console.log('order/likes:', order, likes);
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
		console.log('YES was clicked');
		likesView.clearLikesList();
		state.likes.deleteAllLikes();
		likesView.hideWindow();
	}
});

elements.noBtn.addEventListener('click', (e) => {
	if (e.target.closest('.alert-btn-no', '.alert-btn-no *')) {
		console.log('NO was clicked');
		elements.alertBox.style.zIndex = '-100';
	}
});

console.log('cats:', cats);
main.mainMenu(cats);

cats.forEach((name) => {
	let cards = document.querySelectorAll('.card');
	cards.forEach((card) => {
		card.addEventListener('click', (e) => {
			if (e.target.closest(`.${name}`)) {
				console.log(`Go to ${name} list`);
				main.clearMenu();
				main.renderList(name);
				main.renderTitle2();
				// main.createCatContainer();
				// document.querySelector('.choose-cat').innerText = '';

				document.querySelectorAll('.cat__list-name').forEach((node) => {
					// console.log(node);
					node.addEventListener('click', (e) => {
						// console.log(e.target.innerText);
						searchQuery(e.target.innerText);
						const searchTitle = document.querySelector('.search-title');
						if (searchTitle) searchTitle.remove();
					});
				});
				// if (document.querySelector('.back__btn')) {
				document.querySelector('.back__btn').addEventListener('click', (e) => {
					if (e.target.closest('.back__btn')) {
						main.clearList();
						// main.createCatContainer();
						console.log(cats);
						main.mainMenu(cats);
						// main.renderCard();

						// main.renderTitle();
						// main.renderAllBtn();
					}
				});
				// }
			}
		});
	});
});
// const middleContainer = document.querySelector('.recipe');
document.querySelector('.recipe').addEventListener('click', cardClick);

function cardClick(event) {
	if (event.target.matches('.card')) return;
	console.log(event.target);
	cats.forEach((name) => {
		let cards = document.querySelectorAll('.card');
		cards.forEach((card) => {
			card.addEventListener('click', (e) => {
				if (e.target.closest(`.${name}`)) {
					console.log(`Go to ${name} list`);
					main.clearMenu();
					main.renderList(name);
					main.renderTitle2();
					// main.createCatContainer();
					// document.querySelector('.choose-cat').innerText = '';

					document.querySelectorAll('.cat__list-name').forEach((node) => {
						// console.log(node);
						node.addEventListener('click', (e) => {
							// console.log(e.target.innerText);
							searchQuery(e.target.innerText);
							const searchTitle = document.querySelector('.search-title');
							if (searchTitle) searchTitle.remove();
						});
					});
					// if (document.querySelector('.back__btn')) {
					document.querySelector('.back__btn').addEventListener('click', (e) => {
						if (e.target.closest('.back__btn')) {
							main.clearList();
							// main.createCatContainer();
							console.log(cats);
							main.mainMenu(cats);
							// main.renderCard();

							// main.renderTitle();
							// main.renderAllBtn();
						}
					});
					// }
				}
			});
		});
	});
	//We now have the correct input - we can manipulate the node here
}

/* document.querySelectorAll('.cat__list-name').forEach((node) => {
	console.log(node);
	node.addEventListener('click', (e) => {
		console.log(e.target.innerText);
		// const newQuery = e.target.innerText;
		searchQuery(e.target.innerText);
	});
}); */

/* 
const updateServings = () => {
	const proxyurl = 'https://cors-anywhere.herokuapp.com/';
	const url = 'https://www.thepioneerwoman.com/food-cooking/recipes/a10205/pasta-with-pesto-cream-sauce/';
	const urlCombined = `${proxyurl}${url}`;

	const servings = (urlCombined, calculate, request) => {
		request = new XMLHttpRequest();
		request.open('GET', urlCombined);
		request.onload = calculate;
		request.send();
	};

	const calculate = (e) => {
		console.log('request worked!');
		const data = JSON.stringify(e.target.responseText);
		const recipeYieldIndex = data.search('recipeYield');
		const servingsIndex = data.search('servings');

		const str = data.substr(recipeYieldIndex, servingsIndex);
		const num = parseInt(str.match(/\d+/)[0]);
		console.log('num:', num);
		this.servings = num;
		return this.servings;
	};
	servings(urlCombined, calculate);
}; */

// [ 'hashchange', 'load' ].forEach((event) => window.addEventListener(event, updateServings));

/* fetch(proxyurl + url) // https://cors-anywhere.herokuapp.com/https://example.com
	.then((response) => response.text())
	.then((contents) => console.log(contents))
	.catch(() => console.log('Can’t access ' + url + ' response. Blocked by browser?')); */

/* $.getJSON('http://m.somewebsite.com/data?callback=?', { format: 'json' }, function(data) {
	document.write(data);
}); */
