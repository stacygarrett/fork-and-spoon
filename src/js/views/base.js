export const elements = {
	container: document.querySelector('.container'),
	logo: document.querySelector('.header__logo'),
	catContainer: document.querySelector('.cat-container'),
	card: document.querySelector('.card'),
	searchForm: document.querySelector('.search'),
	searchBtn: document.querySelector('.search__btn'),
	searchInput: document.querySelector('.search__field'),
	searchRes: document.querySelector('.results'),
	searchResList: document.querySelector('.results__list'),
	searchResPages: document.querySelector('.results__pages'),
	recipe: document.querySelector('.recipe'),
	addToList: document.querySelector('.recipe__btn--add'),
	likesList: document.querySelector('.likes__list'),
	likesResPages: document.querySelector('.likes__pages'),
	likeBtn: document.querySelector('recipe__love use'),
	shopping: document.querySelector('.shopping__list'),
	deleteBtn: document.querySelector('.delete-all__btn'),
	listMenu: document.querySelector('.list__field'),
	itemsList: document.querySelector('.list__list'),
	dropdown: document.querySelector('.dropdown__menu'),
	dropdownItem: document.querySelector('.dropdown-item'),
	searchFaves: document.querySelector('.search-likes__field'),
	searchFavesBtn: document.querySelector('.search-likes__btn'),
	removeFaveBtn: document.querySelector('.filter-remove'),
	popUpWarning: document.querySelector('.try-again'),
	deleteFaves: document.querySelector('.delete-likes'),
	alertBox: document.querySelector('.alert__box'),
	yesBtn: document.querySelector('.alert-btn-yes'),
	noBtn: document.querySelector('.alert-btn-no'),
	okBtn: document.querySelector('.alert-btn-ok')
};

export const cats = [ 'proteins', 'dishes', 'fruits', 'veggies', 'sweets', 'misc' ];

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
