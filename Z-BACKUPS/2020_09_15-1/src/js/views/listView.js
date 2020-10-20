import { elements } from './base';

const stepCount = (count) => {
	if (count <= 1) count;
	else if (count > 1) count = 1;
};

export const renderItem = (item) => {
	const markup = `
               <li class = "shopping__item" data-itemid=${item.id}>
        <div class = "shopping__count">
            <input type="number" value="${item.count}" min="0" step="${item.count <= 1
		? item.count
		: (item.count = 1)}" class="shopping__count-value">
                 <p>${item.unit}</p> 
        </div> 
             <p class ="shopping__description">${item.ingredient}</p> 
        <button class="shopping__delete btn-tiny">
            <svg>
                <use href="img/icons.svg#icon-circle-with-cross"> </use> 
            </svg> 
        </button> 
    </li>
    `;
	elements.shopping.insertAdjacentHTML('beforeend', markup);
};

export const deleteAll = (items) => {
	const markup2 = `
    <div class="delete__btn ${items ? show : hide}">
    <a class="btn-small recipe__btn delete-all__btn">
        <span>Delete List</span>
        <svg class="search__icon">
            <use href="img/icons.svg#icon-triangle-right"></use>
        </svg>

    </a>
</div>
    `;
	elements.shopping.insertAdjacentHTML('beforeend', markup2);
};

export const deleteItem = (id) => {
	const item = document.querySelector(`[data-itemid="${id}"]`);
	if (item) item.parentElement.removeChild(item);
};

export const updateItem = (id, count) => {
	const item = document.querySelector(`[data-itemid="${id}"]`);
	// console.log('item from listView.js:', item);
	if (item) {
		console.log(`value`, item.querySelector('.shopping__count-value').value);
		item.querySelector('.shopping__count-value').value = count;
	}
};
