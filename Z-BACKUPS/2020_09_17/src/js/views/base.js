export const elements = {
	searchForm: document.querySelector('.search'),
	searchBtn: document.querySelector('.search__btn'),
	searchInput: document.querySelector('.search__field'),
	searchRes: document.querySelector('.results'),
	searchResList: document.querySelector('.results__list'),
	searchResPages: document.querySelector('.results__pages'),
	recipe: document.querySelector('.recipe'),
	addToList: document.querySelector('.recipe__btn--add'),
	shopping: document.querySelector('.shopping__list'),
	deleteBtn: document.querySelector('.delete-all__btn'),
	listMenu: document.querySelector('.list__field'),
	itemsList: document.querySelector('.list__list')
};

export const elementStrings = {
	loader: 'loader'
};

export const renderLoader = (parent) => {
	const loader = `
        <div class=${elementStrings.loader}>
            <svg>
                <use href="img/icons.svg#icon-cw"></use>
            </svg>
        </div>        
    `;
	parent.insertAdjacentHTML('afterbegin', loader);
};

export const clearLoader = () => {
	const loader = document.querySelector(`.${elementStrings.loader}`);
	if (loader) loader.parentElement.removeChild(loader);
};
