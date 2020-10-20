import {
	descriptions,
	proteinsArr,
	dishesArr,
	fruitsArr,
	veggiesArr,
	sweetsArr,
	miscArr,
	proteins,
	dishes,
	fruits,
	veggies,
	sweets,
	misc,
	all,
	allArr
} from '../categories';
import { elements, cats } from './base';
// import { searchClick } from '../index';

export const createCatContainer = () => {
	const markup = `
    <div class="cat-container">
    </div>
    `;
	elements.recipe.insertAdjacentHTML('afterbegin', markup);
};

export const renderTitle = () => {
	const markup = `
        <h3 id="categories" class="choose-cat">Choose A Category:</h3>
       `;
	elements.recipe.insertAdjacentHTML('afterbegin', markup);
};
export const renderTitle2 = () => {
	const markup = `
       <h3 class="choose-cat">Select a Search Word</h3>
       `;
	elements.recipe.insertAdjacentHTML('afterbegin', markup);
};

export const renderCard = (category) => {
	descriptions.forEach((descr, i) => {
		category = cats[i];
		const markup = `
            <a class="card ${category}" style="width: 28rem;" >
                <img class="card-img-top ${category}-img" src="/img/invis.svg" alt="${category}">
                <div class="card-body">
                  <h5 class="card-title">${category}</h5>
                  <p class="card-text">${descr}</p>
                </div>
              </a>
          `;
		elements.catContainer.insertAdjacentHTML('beforeend', markup);
	});
};

export const randomImg = (category) => {
	let randNum = Math.floor(Math.random() * category.length + 1) - 1;
	return category[`${randNum}`];
};

export const getCategories = () => {
	cats.forEach((name) => {
		const cardImg = document.querySelector(`.${name}-img`);
		switch (name) {
			case 'proteins':
				cardImg.src = randomImg(proteins);
				break;
			case 'dishes':
				cardImg.src = randomImg(dishes);
				break;
			case 'fruits':
				cardImg.src = randomImg(fruits);
				break;
			case 'veggies':
				cardImg.src = randomImg(veggies);
				break;
			case 'sweets':
				cardImg.src = randomImg(sweets);
				break;
			case 'misc':
				cardImg.src = randomImg(misc);
				break;
		}
		return cardImg.src;
	});
};

export const clearMenu = () => {
	document.querySelector('.choose-cat').remove();
	document.querySelector('.cat-container').innerText = '';
	document.querySelector('.cat__all-wrapper').remove();
};
export const clearList = () => {
	document.querySelector('.choose-cat').remove();
	document.querySelector('.cat__list-wrapper').remove();
	document.querySelector('.back__btn').remove();
};

const renderCatList = (category) => {
	const markup = `
        <div class="cat__list-wrapper">
            <h3 class="cat__list-title">${category}</h3>
            <ul class="cat__list-list">

            </ul>
        </div>
    `;
	elements.recipe.insertAdjacentHTML('afterbegin', markup);
	if (category === 'all') {
		const allWrapper = document.querySelector('.cat__list-wrapper');
		allWrapper.classList.add('all');
		allWrapper.style.height = '1000px';
		allWrapper.style.overflow = 'scroll';
		clearMenu();
	}
};

const listName = (category) => {
	let name;
	switch (category) {
		case 'proteins':
			name = proteinsArr;
			break;
		case 'dishes':
			name = dishesArr;
			break;
		case 'fruits':
			name = fruitsArr;
			break;
		case 'veggies':
			name = veggiesArr;
			break;
		case 'sweets':
			name = sweetsArr;
			break;
		case 'misc':
			name = miscArr;
			break;
		case 'all':
			name = allArr;
			break;
	}
	return name;
};

const renderListItems = (category) => {
	const inputName = listName(category);
	inputName.sort((a, b) => (a < b ? -1 : 1)).forEach((item) => {
		const markup = `
        <li class="cat__list-name">${item}</li>
        `;
		document.querySelector('.cat__list-list').insertAdjacentHTML('beforeend', markup);
	});
};

const createBackBtn = () => {
	const markup = `
        <button class="btn-small btn back__btn">
        <svg class="back__icon">
            <use href="img/icons.svg#icon-triangle-left"></use>
        </svg>
        <span>Go Back</span>
        </button>
    `;
	elements.recipe.insertAdjacentHTML('beforeend', markup);
};

export const mainMenu = (category) => {
	renderCard(category);
	renderTitle();
	getCategories();
	renderAllBtn();
};

export const renderList = (category) => {
	renderCatList(category);
	renderListItems(category);
	createBackBtn();
};

export const renderAllBtn = () => {
	const markup = `
    </div>
    <div class="cat__all-wrapper">
        <h4 class="cat__all-text">Don't know where to start? </h4>
              <button class="btn all__btn">
                View All
                </button>
    </div>
    `;
	elements.catContainer.insertAdjacentHTML('afterend', markup);

	document.querySelector('.all__btn').addEventListener('click', (e) => {
		if (e.target.closest('.all__btn')) {
			renderList(all);
			renderTitle2();
		}
	});
};
