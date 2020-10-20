import { descriptions, proteinsArr } from '../categories';
import { elements, cats } from './base';

/* proteins.forEach((cat) => console.log(cat.name, cat.image));
console.log(proteins); */

export const renderTitle = () => {
	const markup = `
     <h3 id="categories" class="choose-cat">CHOOSE A CATEGORY:</h3>
    `;
	elements.recipe.insertAdjacentHTML('afterbegin', markup);
};

export const renderCard = (category) => {
	descriptions.forEach((descr, i) => {
		category = cats[i];
		const markup = `
            <a class="card ${category}" style="width: 28rem;" href="#${category}">
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

export const clearMiddle = () => {
	elements.recipe.innerText = '';
};

export const renderCatList = (category) => {
	const markup = `
        <h3 class="choose-cat">Select a Search Word</h3>
        <div class="cat__list-wrapper">
            <h3 class="cat__list-title">${category}</h3>
            <ul class="cat__list-list">
                <li class="cat__list-name">chicken</li>
                <li class="cat__list-name">pork</li>
                <li class="cat__list-name">seafood</li>
                <li class="cat__list-name">fish</li>
                <li class="cat__list-name">beef</li>
                <li class="cat__list-name">turkey</li>
                <li class="cat__list-name">bacon</li>
                <li class="cat__list-name">steak</li>
                <li class="cat__list-name">lentil</li>
                <li class="cat__list-name">lobster</li>
            </ul>
        </div>
    `;
	elements.recipe.insertAdjacentHTML('afterbegin', markup);
};

export const createBackBtn = () => {
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

console.log(proteinsArr);
