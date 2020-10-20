import { elements } from './base';

export const renderTitle = (title) => {
	const markup = `
         <h4>${title}:</h4>
    `;
	elements.shopping.insertAdjacentHTML('beforeend', markup);
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

export const deleteBtn = () => {
	const markup = `
    <div class="delete__btn" onClick="location.reload(true)">
    <button class="btn-xsmall recipe__btn delete-all__btn">
        <span>Delete All</span>    
    </button>
</div>
    `;
	elements.shopping.insertAdjacentHTML('afterend', markup);
};

export const refreshShopping = (list) => {
	list = document.querySelectorAll('.shopping__item');
	const btn = document.querySelector('.delete-all__btn');
	list.forEach((item) => {
		console.log(item);
		if (item) item.parentElement.removeChild(item);
	});
	btn.parentElement.removeChild(btn);
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
