import { elements } from './base';
import { limitRecipeTitle } from './searchView';

export const toggleLikeBtn = (isLiked) => {
	const iconString = !isLiked ? 'icon-heart-outlined' : 'icon-heart';
	document.querySelector('.recipe__love use').setAttribute('href', `img/icons.svg#${iconString}`);
};

export const toggleMenu = (haveLikes) => {
	console.log(haveLikes);
	if (!haveLikes) elements.listMenu.classList.add('hide');
	else elements.listMenu.classList.remove('hide').add('show');
};

export const renderLike = (like) => {
	const markup = `
        <li>
        <a class="likes__link" href="#${like.id}">
            <figure class="likes__fig">
                <img src="${like.img}" alt="${like.title}">
            </figure>
            <div class="likes__data">
                <h4 class="likes__name">${limitRecipeTitle(like.title, 30, '')}</h4>
             </div>
          </a>
     </li>
	`;
	elements.likesList.insertAdjacentHTML('afterbegin', markup);
};

export const clearLikesList = () => {
	elements.likesList.innerText = '';
};

export const deleteLike = (id) => {
	const el = document.querySelector(`.likes__link[href*="${id}"]`).parentElement;
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

export const getInput = () => elements.searchFaves.value;

export const clearInput = () => {
	elements.searchFaves.value = '';
};

export const clearResults = () => {
	elements.likesList.innerText = '';
};

export const hideWindow = () => {
	elements.alertBox.style.zIndex = '-100';
};
