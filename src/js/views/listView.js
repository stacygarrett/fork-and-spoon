import { elements } from './base';

export const shoppingListTitle = (length) => {
	const listPanel = document.querySelector('.list__panel');
	const markup = `
		<div>
			<div class="heading-2">
				<h2 class="${length > 0 ? 'show-2' : 'hide-2'}">My Shopping List</h2>
			</div>
			<div class="empty__list">
				<p class="${length === 0 ? 'show-2' : 'hide-2'}">There are currently no items in your shopping list.</p>
			</div>
			</div>
	`;
	elements.shopping.insertAdjacentHTML('beforebegin', markup);

	if (length === 0) listPanel.classList.add('list__panel-sm');
	else listPanel.classList.remove('list__panel-sm');
};

export const renderTitle = (title) => {
	const markup = `
         <h4>${title}:</h4>
    `;
	elements.itemsList.insertAdjacentHTML('beforeend', markup);
};

export const renderItem = (item) => {
	const markup = `
			   <li class="shopping__item" data-itemid=${item.id}>
			   <button class="shopping__delete btn-tiny">
			   <svg>
				   <use href="img/icons.svg#icon-circle-with-cross"> </use> 
			   </svg> 
		   </button> 
        <div class ="shopping__count">
            <input type="number" value="${item.count}" min="${item.count === 0
		? (item.count = '')
		: item.count}" step="${item.count <= 1 ? item.count : (item.count = 1)}" class="shopping__count-value">
               
		</div> 
		<div class="shopping__description shopping__unit" style="${item.unit === ''
			? 'display:none'
			: 'display:block'}">${item.unit}</div>
             <div class="shopping__description">${item.ingredient}</div> 
       
    </li>
    `;
	elements.shopping.insertAdjacentHTML('beforeend', markup);
};

export const deleteBtn = () => {
	const markup = `
		<div class="delete__btn">
			<button class="btn-xsmall recipe__btn delete-all__btn" onClick="location.reload(true)">
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
