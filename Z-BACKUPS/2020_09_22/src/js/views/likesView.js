import { elements } from './base';
import { limitRecipeTitle } from './searchView';

export const toggleLikeBtn = (isLiked) => {
	// debugger;
	const iconString = !isLiked ? 'icon-heart-outlined' : 'icon-heart';
	// console.log('isLiked:', isLiked);
	console.log('iconString:', iconString);
	// const heartIcon = document.querySelector('.recipe__love use');
	// debugger;
	// console.log('heart icon:', document.querySelector('.recipe__love use'));
	// debugger;
	console.log(document.querySelector('.recipe__love use'));
	document.querySelector('.recipe__love use').setAttribute('href', `img/icons.svg#${iconString}`);
	// debugger;
};

export const toggleMenu = (haveLikes) => {
	console.log(haveLikes);
	if (!haveLikes) elements.listMenu.classList.add('hide');
	else elements.listMenu.classList.remove('hide').add('show');
};

export const renderLike = (like) => {
	// console.log('like.title:', like.title);
	const markup = `
        <li>
        <a class="likes__link" href="#${like.id}">
            <figure class="likes__fig">
                <img src="${like.img}" alt="${like.title}">
            </figure>
            <div class="likes__data">
                <h4 class="likes__name">${limitRecipeTitle(like.title, 26, '')}</h4>
             </div>
          </a>
     </li>
    `;
	elements.likesList.insertAdjacentHTML('afterbegin', markup);
};

export const deleteLike = (id) => {
	const el = document.querySelector(`.likes__link[href*="${id}"]`).parentElement;
	// console.log('el from deleteLike():', el);
	if (el) el.parentElement.removeChild(el);
};

export const highlightSelected2 = (id) => {
	const selectedElement = document.querySelector(`a[href="#${id}"]`);

	if (selectedElement !== null) {
		const likesArr = Array.from(document.querySelectorAll('.likes__link'));
		const likeLink = document.querySelector(`.likes__link[href*="#${id}"]`);
		likesArr.forEach((el) => {
			el.classList.remove('likes__link--active');
		});

		if (likeLink) likeLink.classList.add('likes__link--active');
	}
};

/* const createButton = (page, pages) => `
		<div class="pagination pagination-lg">
			<button class="btn-inline page-item prev ${page === 1 ? 'btn-opacity' : 'flex'}" data-goto=${page !== 1
	? page - 1
	: page} aria-label="Previous" type="button" ${page === 1 ? 'disabled' : ''}>
				<span aria-hidden="true">&laquo;</span>
				<span class="sr-only">Previous</span>
			</button>

			<button class="btn-inline page-item ${page === 1 ? "active ''" : "pageNum ''"}" data-goto=${1}>1</button>
			<button class="btn-inline page-item pageNum ${pages < 2 ? 'hide-2' : 'show'} ${page === 2
	? 'active'
	: ''}" data-goto=${2}>2</button>
			<button class="btn-inline page-item pageNum ${pages < 3 ? 'hide-2' : 'show'} ${page === 3
	? 'active'
	: ''}" data-goto=${3}>3</button>

			<button class="btn-inline page-item next ${page === 3 || pages === 1 ? 'btn-opacity' : 'flex'}" data-goto=${page !==
3
	? page + 1
	: page} aria-label="Next" ${page === 3 ? 'disabled' : ''}>
				<span aria-hidden="true">&raquo;</span>
				<span class="sr-only">Next</span>
			</button>
		</div>
`; */

/* const createButton = (page, pages) => `
<div class="pagination pagination-lg">
	<button class="btn-inline page-item ${page === 1 ? "active ''" : "pageNum ''"}" data-goto=${1}>1</button>
	<button class="btn-inline page-item pageNum ${page === 2 ? 'active' : ''}" data-goto=${2}>2</button>
	</div>
`; */

/* const renderButtons = (page, numResults, resPerPage) => {
	const pages = Math.ceil(numResults / resPerPage);
	let button;
	const likesPages = document.querySelector('.likes__pages').classList;

	console.log('likes page:', page);
	console.log('likes pages:', pages);
	console.log('likes numResults:', numResults);

	// button = createButton(page, pages);
	if (pages > 1) {
		button = createButton(page, pages);
		likesPages.remove('hide');
		likesPages.add('show');
	} else if (numResults < 14 && pages === 1) {
		likesPages.remove('show');
		likesPages.add('hide');
	}

	elements.likesResPages.insertAdjacentHTML('afterbegin', button);
};

export const renderResults = (likes, page = 1, resPerPage = 14) => {
	// render results of current page
	console.log('likes:', likes.length);
	const start = (page - 1) * resPerPage;
	const end = page * resPerPage;

	console.log('start/end:', start, end);
	console.log('resPerPage likes:', resPerPage);
	console.log('likes.slice(start, end)', likes.slice(start, end));
	likes.slice(start, end).forEach(renderLike);

	// render pagination buttons
	renderButtons(page, likes.length, resPerPage);
}; */
