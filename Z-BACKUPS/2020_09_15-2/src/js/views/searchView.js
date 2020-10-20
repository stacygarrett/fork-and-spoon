import { elements } from './base';
// import Search from './models/Search';

export const getInput = () => elements.searchInput.value;

export const clearInput = () => {
	elements.searchInput.value = '';
};

export const clearResults = () => {
	elements.searchResList.innerText = '';
	elements.searchResPages.innerText = '';
};

export const clearSearchTitle = () => {
	document.querySelector('.search-title').remove();
};

export const searchResultsFor = (query) => {
	const markup = `
         <h5 class="search-title">SEARCH RESULTS FOR: <span  class="search-title-highlight">${query.toUpperCase()}</span></h5>
    `;
	elements.searchRes.insertAdjacentHTML('afterbegin', markup);
};

/* export const highlightSelected = (id) => {
	const resultsArr = Array.from(document.querySelectorAll('.results__link'));
	resultsArr.forEach((el) => {
		el.classList.remove('results__link--active');
	});
	// debugger;
	document.querySelector(`.results__link[href*="#${id}"]`).classList.add('results__link--active');
}; */

export const highlightSelected = (id) => {
	const resultArr = Array.from(document.querySelectorAll('.results__link'));
	const resultLink = document.querySelector(`.results__link[href*="#${id}"]`);
	resultArr.forEach((el) => {
		el.classList.remove('results__link--active');
	});

	if (resultLink) resultLink.classList.add('results__link--active');
};

// 'Pasta with tomato and spinach'
export const limitRecipeTitle = (title, limit = 18) => {
	const newTitle = [];
	// console.log('title length:', title.length);
	if (title.length > limit) {
		title.split(' ').reduce((acc, cur, index) => {
			// console.log('acc:', acc);
			// console.log('cur:', cur);
			// console.log('index:', index);
			if (acc + cur.length <= limit) {
				newTitle.push(cur);
				// return;
			} else if (index < 2 && acc + cur.length > limit && cur.includes('-')) {
				// console.log('acc, cur:', acc, cur);
				const splitTitle = cur.split('-', 1);
				// console.log('splitTitle:', splitTitle);
				newTitle.push(splitTitle);
			}
			return acc + cur.length;
		}, 0);
		return `${newTitle.join(' ')} ...`;
	}
	return title;
};

export const renderRecipe = (recipe) => {
	const markup = `
        <li>
        <a class="results__link" href="#${recipe.recipe_id}">
            <figure class="results__fig">
                <img src="${recipe.image_url}" alt="${recipe.title}">
            </figure>
            <div class="results__data">
                <h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
                <p class="results__author">${recipe.publisher}</p>
            </div>
        </a>
    </li>
    `;
	elements.searchResList.insertAdjacentHTML('beforeend', markup);
};

// type: 'prev' or 'next'
/* const createButton = (page, type) => `
		<button class="btn-inline ${type}" data-goto=${type === 'prev' ? page - 1 : page + 1}>
			<span>${type === 'prev' ? page - 1 : page + 1}</span>
		</button>
`; */

const createButton = (page, pages) => `
		<div class="pagination pagination-lg">
			<button class="btn-inline page-item prev ${page === 1 ? 'btn-opacity' : 'flex'}" data-goto=${page !== 1
	? page - 1
	: page} aria-label="Previous" type="button" ${page === 1 ? 'disabled' : ''}>
				<span aria-hidden="true">&laquo;</span>
				<span class="sr-only">Previous</span>
			</button>

			<button class="btn-inline page-item one ${page !== 1 ? 'pageNum' : ''} ${page === 1
	? 'active'
	: ''}" data-goto=${1}>1</button>
			<button class="btn-inline page-item pageNum two  ${pages < 2 ? 'btn-opacity' : 'show'} ${page === 2
	? 'active'
	: ''}" data-goto=${2}>2</button>
			<button class="btn-inline page-item pageNum three  ${pages < 3 ? 'btn-opacity' : 'show'} ${page === 3
	? 'active'
	: ''}" data-goto=${3}>3</button>

			<button class="btn-inline page-item next ${page === 3 ? 'btn-opacity' : 'flex'}" data-goto=${page !== 3
	? page + 1
	: page} aria-label="Next" ${page === 3 ? 'disabled' : ''}>
				<span aria-hidden="true">&raquo;</span>
				<span class="sr-only">Next</span>
			</button>
		</div>
`;

const renderButtons = (page, numResults, resPerPage) => {
	const pages = Math.ceil(numResults / resPerPage);
	let button;
	const resultsPages = document.querySelector('.results__pages').classList;

	localStorage.setItem('page', JSON.stringify.page);
	console.log('page:', page);
	console.log('pages:', pages);
	console.log('numResults:', numResults);

	if (pages > 1) {
		button = createButton(page, pages);
		resultsPages.remove('hide');
		resultsPages.add('show');
	} else if (numResults < 10 && pages === 1) {
		resultsPages.remove('show');
		resultsPages.add('hide');
	}

	elements.searchResPages.insertAdjacentHTML('afterbegin', button);
};

export const renderResults = (recipes, page = 1, resPerPage = 10) => {
	// render results of current page
	console.log('recipes:', recipes);
	const start = (page - 1) * resPerPage;
	const end = page * resPerPage;

	recipes.slice(start, end).forEach(renderRecipe);

	// render pagination buttons
	renderButtons(page, recipes.length, resPerPage);
};
