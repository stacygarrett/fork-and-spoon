import { proteins, dishes, fruits, veggies, sweets, misc } from '../categories';

/* proteins.forEach((cat) => console.log(cat.name, cat.image));
console.log(proteins); */

/* export const renderImage = (category) => {
	const markup = `
            <img class="card-img-top" src="${randomImg(category.image)}" alt="${category}">
    `;
	elements.card.insertAdjacentHTML('afterbegin', markup);
}; */

export const randomImg = (category) => {
	// console.log(category);
	console.log(category.length);
	let randNum = Math.floor(Math.random() * category.length + 1) - 1;
	console.log(randNum);
	console.log(category[`${randNum}`].image);
	return category[`${randNum}`].image;
};

// randomImg(proteins);
