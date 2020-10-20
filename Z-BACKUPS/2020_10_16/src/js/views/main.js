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
	misc
} from '../categories';
import { elements, cats } from './base';

/* proteins.forEach((cat) => console.log(cat.name, cat.image));
console.log(proteins); */

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
	// document.querySelector('.cat__list-wrapper').insertAdjacentHTML('afterbegin', markup);
};

export const renderCard = (category) => {
	console.log(category);
	console.log('catContainer:', elements.catContainer);
	descriptions.forEach((descr, i) => {
		category = cats[i];
		console.log('category cats[i]:', category);
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
	// console.log(category);
	console.log('category.length:', category.length);
	let randNum = Math.floor(Math.random() * category.length + 1) - 1;
	console.log(randNum);
	console.log(category[`${randNum}`]);
	return category[`${randNum}`];
};

export const getCategories = () => {
	cats.forEach((name) => {
		console.log(name);
		const cardImg = document.querySelector(`.${name}-img`);
		console.log(cardImg);
		// let parent = document.querySelector(`.${name}`);

		// renderLoader(parent);
		// debugger;
		if (name === 'proteins') {
			cardImg.src = randomImg(proteins);
		}
		if (name === 'dishes') {
			cardImg.src = randomImg(dishes);
		}
		if (name === 'fruits') {
			cardImg.src = randomImg(fruits);
		}
		if (name === 'veggies') {
			cardImg.src = randomImg(veggies);
		}
		if (name === 'sweets') {
			cardImg.src = randomImg(sweets);
		}
		if (name === 'misc') {
			cardImg.src = randomImg(misc);
		}
		// clearLoader();
	});
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
	// document.querySelector('.cat__all-wrapper').innerText = '';
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
	}
	return name;
};
const renderListItems = (category) => {
	const inputName = listName(category);
	console.log('inputName:', inputName);
	inputName.sort((a, b) => (a < b ? -1 : 1)).forEach((item) => {
		console.log(item);
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
	// createCatContainer();
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
