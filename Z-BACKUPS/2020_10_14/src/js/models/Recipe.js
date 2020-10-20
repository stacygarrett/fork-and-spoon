import axios from 'axios';

export default class Recipe {
	constructor(id) {
		this.id = id;
	}
	async getRecipe() {
		try {
			const res = await axios(`https://forkify-api.herokuapp.com/api/get?rId=${this.id}`);
			this.title = res.data.recipe.title;
			this.author = res.data.recipe.publisher;
			this.img = res.data.recipe.image_url;
			this.url = res.data.recipe.source_url;
			this.ingredients = res.data.recipe.ingredients;
			this.increment = 1;
			// console.log(this.ingredients);
			this.persistData();
		} catch (err) {
			console.log(err);
			alert('Something went wrong :(');
		}
	}
	persistData() {
		localStorage.setItem('ingredients', JSON.stringify(this.ingredients));
	}
	readStorage() {
		const storage = JSON.parse(localStorage.getItem('ingredients'));
		// Resoring ingredients from the local Storage
		if (storage) this.ingredients = storage;
	}
	calcTime() {
		// Assuming that we need 156 min for each 3 ingredients
		const numIng = this.ingredients.length; // ingredients is an array
		const periods = Math.ceil(numIng / 3);
		this.time = periods * 15;
	}
	/* 	setServings(servings) {
		this.servings = servings;
		console.log('this.servings:', this.servings);
	} */

	calcServings(url) {
		// this.servings = 4;
		// console.log('calcServings URL:', url);
		const proxyurl = 'https://cors-anywhere.herokuapp.com/';
		// let url = 'https://www.thepioneerwoman.com/food-cooking/recipes/a10205/pasta-with-pesto-cream-sauce/';
		const urlCombined = `${proxyurl}${url}`;

		const servingsRequest = (urlCombined, calculate, request) => {
			request = new XMLHttpRequest();
			request.open('GET', urlCombined);
			request.onload = calculate;
			request.send();
		};

		const calculate = (e) => {
			// console.log('request worked!');
			// this.servings = 4;
			const data = JSON.stringify(e.target.responseText);
			const recipeYieldIndex = data.search('recipeYield');
			const servingsIndex = data.search('servings');
			const servesIndex = data.search('Serves');
			console.log(recipeYieldIndex, servingsIndex, servesIndex);
			// if (recipeYieldIndex === -1) this.servings;

			if (recipeYieldIndex !== -1) {
				console.log(recipeYieldIndex - servingsIndex < 15);
				if (servingsIndex !== -1 && recipeYieldIndex - servingsIndex < 15) {
					const str = data.substr(recipeYieldIndex, servingsIndex);
					this.recipeServings = parseInt(str.match(/\d+/)[0]);
				} else if (servesIndex !== -1) {
					const secondVal = parseInt(`${servesIndex + 10}`);
					console.log(secondVal);
					const str = data.slice(servesIndex, secondVal);
					console.log(str);
					this.recipeServings = parseInt(str.match(/\d+/)[0]);
				} else {
					const str = data.slice(recipeYieldIndex, parseInt(`${recipeYieldIndex + 20}`));
					this.recipeServings = parseInt(str.match(/\d+/)[0]);
				}
			} else {
				this.recipeServings = 4;
			}
			this.servings = this.recipeServings;
			console.log('this.recipeServings:', this.recipeServings);
			return this.recipeServings;
		};
		servingsRequest(urlCombined, calculate);
		// this.persistData();
	}

	parseIngredients() {
		const unitsLong = [
			'tablespoons',
			'tablespoon',
			'teaspoons',
			'teaspoon',
			'ounces',
			'ounce',
			'oz',
			'cups',
			'pounds',
			'kg',
			'g',
			'l'
		];
		const unitsShort = [ 'tbsp', 'tbsp', 'tsp', 'tsp', 'oz', 'oz', 'oz', 'cup', 'pound', 'kg', 'g', 'l' ];
		// const units = [ ...unitsShort, 'kg', 'g', 'l' ];

		// if there is a blank line, remove it
		this.ingredients.map((ing, i) => (ing.includes('&nbsp;') ? this.ingredients.splice(i, 1) : null));
		this.ingredients.map((ing, i) => (ing.includes('_____') ? this.ingredients.splice(i, 1) : null));

		const newIngredients = this.ingredients.map((el, index) => {
			// 1) Uniform units
			let ingredient = el.toLowerCase();
			// console.log('ingredient index:', ingredient, index);
			unitsLong.forEach((unit, i) => {
				ingredient = ingredient.replace(unit, unitsShort[i]);
			});
			// 2) Remove parentheses
			ingredient = ingredient.replace(/ *\([^)]*\) */g, ' ');
			// ingredient = ingredient.substring(0, ingredient.indexOf(','));
			// console.log('ingredient:', ingredient);

			// 3) Parse ingredients into count, unit, & ingredient
			if (ingredient.includes(';')) {
				ingredient = ingredient.substring(0, ingredient.lastIndexOf(';'));
			}
			if (ingredient.includes(':')) {
				const dashInd = ingredient.indexOf(':');
				if (dashInd > 15) ingredient = ingredient.substring(0, ingredient.lastIndexOf(':'));
			}
			if (ingredient.includes(',')) {
				const commaInd = ingredient.indexOf(',');
				// console.log('comma Index:', ingredient.lastIndexOf(','));
				// if (ingredient.length > 100) ingredient
				if (commaInd >= 10 && commaInd < 50) ingredient = ingredient.substring(0, ingredient.lastIndexOf(','));
			}
			if (ingredient.includes(' - ')) {
				const dashInd = ingredient.indexOf('-');
				// console.log('dash index:', dashInd);
				if (dashInd > 20 && dashInd < 30) ingredient = ingredient.substring(0, ingredient.lastIndexOf('-'));
			}
			if (ingredient.includes('scant ')) {
				let newIngr = ingredient.split(' ');
				let scantInd = ingredient.indexOf('scant');
				// console.log(scantInd);
				if (scantInd === 0) ingredient = newIngr.splice(1).join(' ');
				// console.log(ingredient);
			}
			if (ingredient.includes('1 stick ')) {
				let newIngr = ingredient.split(' ');
				let stickInd = ingredient.indexOf('1 stick');
				if (stickInd === 0) ingredient = newIngr.splice(2).join(' ');
				// console.log(ingredient);
			}
			if (ingredient.includes(' heaped ')) {
				let newIngr = ingredient.split(' ');
				let heapInd = ingredient.indexOf('heaped');
				// console.log(heapInd);
				if (heapInd < 3) ingredient = newIngr.splice(1, 1).join(' ');
				// console.log(ingredient);
			}
			if (ingredient.includes(' to ')) {
				let newIngr = ingredient.split(' ');
				// console.log(newIngr);
				const toInd = ingredient.indexOf('to');
				// console.log('to Index:', toInd);
				// console.log('new ingredient:', newIngr.splice(toInd));
				if (toInd <= 2) ingredient = newIngr.splice(toInd).join(' ');
			}
			if (ingredient.includes(' or ')) {
				let newIngr = ingredient.split(' ');
				// console.log(newIngr);
				const orInd = ingredient.indexOf('or');
				// console.log('or Index:', orInd);
				// console.log('new ingredient:', newIngr.splice(toInd));
				if (orInd <= 2) ingredient = newIngr.splice(orInd).join(' ');
			}
			if (ingredient.includes('*') || ingredient.includes('**')) {
				const starInd = ingredient.indexOf('*');
				const doubleStarInd = ingredient.indexOf('**');
				// console.log('comma Index:', ingredient.lastIndexOf('*'));
				if (starInd >= 10) ingredient = ingredient.substring(0, ingredient.lastIndexOf('*'));
				if (doubleStarInd >= 10) ingredient = ingredient.substring(0, ingredient.lastIndexOf('*'));
			}

			// console.log('ingredient:', ingredient);
			const arrIng = ingredient.split(' ');
			// console.log('array of Ingredients 1:', arrIng);

			const firstIndex = (ing) => {
				let arr = ing[0].split('');
				// console.log('arr of index[0]:', arr);
				let result = [];
				const letters = [];
				let num = '';
				// if the item is a fraction, then turn it back into a string
				if (arr.includes('/') || arr.includes('.')) {
					// console.log("arr.join('')", arr.join(''));
					result = arr.join('');
					// console.log('result 1:', result);
					// return result;
				} else if (arr.includes('-')) {
					result = arr[0];
				} else {
					// if it's a string, put that in the SECOND position
					arr.forEach((el) => {
						// console.log('el:', el);
						if (isNaN(parseInt(el))) {
							letters.push(el);
							// console.log('letters:', letters);
							result[1] = letters.join('');

							// console.log('result[1]:', result[1]);
						} else {
							// if it's a number, put it in the FIRST position
							num = num.concat(`${el}`);
							// console.log('num', num);
						}
						num.toString();
						result[0] = num;

						// num.toString();
					});
					// console.log('result 2:', result);
					// return result;
				}
				// console.log('result 3:', result);
				return result;
			};

			const replaceFirst = (item) => {
				item = arrIng[0];
				// console.log('ingredient inside replaceFirst():', ingredient[0]);
				// console.log('item:', item);
				const firstFnc = firstIndex(arrIng);
				// console.log('firstFnc:', firstFnc);
				// console.log('item length:', item.length);
				// console.log('firstFnc length:', firstFnc.length);
				/* if (item.length > 0) {
					// console.log('item.length:', item.length);
					return item;
				} */

				if (item.includes(' ') || item.includes('/')) {
					return item;
				} else {
					// console.log('item length is not first word length?', item.length !== firstFnc.length);
					// console.log('arrIng splice:', arrIng.splice(0, 1, ...firstFnc));

					arrIng.splice(0, 1, ...firstFnc);
					// console.log('item from replaceFirst():', item);
					return arrIng;
				}
			};
			// console.log('new Ingredient Array:', arrIng);

			// console.log('ingredient line 135:', ingredient);
			replaceFirst(arrIng);

			function newArray() {
				let newArr;

				if (ingredient.length >= 1 && arrIng[0].length >= 1) {
					// console.log(ingredient.length >= 1 && arrIng[0].length >= 1);
					// console.log('newArray ingredient length:', ingredient.length);
					// console.log('newArray arrIng[0] length:', arrIng[0].length);
					// the new array is the original array
					newArr = arrIng;
					// console.log(arrIng[0].includes(unitsShort));
					// console.log('newArr:', newArr);
				} else {
					// if the ingredients are different lengths, then use the ReplaceFirst function
					newArr = replaceFirst(arrIng);
				}
				return newArr;
			}

			const newIngredientArr = newArray();
			// const newIngredientArr = replaceFirst(arrIng);
			// console.log('array of Ingredients2:', newIngredientArr);
			let objIng;
			const unitIndex = arrIng.findIndex((el2) => {
				// console.log('arrIng:', arrIng);
				// console.log('el2', el2);
				// console.log('index of el2:', arrIng.indexOf(el2));
				if (newIngredientArr[0] === undefined) {
					// console.log('first item is undefined');
				} else {
					return unitsShort.includes(el2);
				}
			});
			// const unitIndex = 1;
			// console.log('unit index:', unitIndex);

			if (unitIndex > -1) {
				// There is a measurement unit
				// i.e. 4 1/2 cups, arrCount is [4, 1/2] --> eval("4+1/2") --> 4.5
				// i.e. 4 cups, arrCount is [4]
				// console.log('newIngredientArr[0]:', newIngredientArr[0]);
				const arrCount = newIngredientArr.slice(0, unitIndex);
				// console.log('array Count:', arrCount.length);
				let count;
				if (arrCount.length === 1) {
					// console.log('arr.length === 1', eval(newIngredientArr[0].replace('-', '+')));
					count = eval(newIngredientArr[0].replace('-', '+'));
					// console.log('count:', count);
				} else {
					// console.log('this arrCount does not equal 1');
					// console.log('ingredient array slice:', newIngredientArr[0], newIngredientArr[unitIndex]);
					// console.log('arr.length !== 1', eval(newIngredientArr.slice(0, unitIndex).join('+')));
					count = eval(newIngredientArr.slice(0, unitIndex).join('+'));
				}
				objIng = {
					count,
					unit: newIngredientArr[unitIndex],
					ingredient: newIngredientArr.slice(unitIndex + 1).join(' ')
				};
				/* 	} else if (unitIndex === 1 && !parseInt(newIngredientArr[0], 10)) {
				objIng = {
					count: undefined,
					unit: '',
					ingredient: newIngredientArr.slice(0, unitIndex + 1).join(' ')
				}; */
				/* } else if (!parseInt(newIngredientArr[0], 10)) {
				console.log('!parseInt(newIngredientArr[0], 10)', !parseInt(newIngredientArr[0], 10)); */
			} else if (parseInt(newIngredientArr[0])) {
				// console.log('newIngredientArr[0]', eval(newIngredientArr[0]));
				// There is NO unit, but 1st element is a number

				objIng = {
					count: eval(newIngredientArr[0]),
					unit: '',
					ingredient: newIngredientArr.slice(1).join(' ')
				};
			} else if (unitIndex === -1) {
				// There is NO unit
				objIng = {
					count: undefined,
					unit: '',
					ingredient
				};
				// }
			}

			return objIng;
			// };

			// finalRecipe(arrIng);
		});
		this.ingredients = newIngredients;
	}
	/* 	servings() {
		this.servings = this.recipeServings;
	} */
	updateServings(type) {
		// type will be + or - button
		// Servings

		const quarter = this.recipeServings / 4;
		this.increment = Math.round(quarter * 2).toFixed() / 2;
		console.log('increment:', this.increment);

		const newServings = type === 'decrease' ? (this.servings -= this.increment) : (this.servings += this.increment);

		this.servings = newServings;
	}

	denominator() {
		this.denom = 4;
	}
	incrementDenominator(type) {
		type === 'decrease' ? (this.denom -= 1) : (this.denom = this.denom + 1);
	}
	updateCount(type) {
		const countArr = [];
		const amountArr = [];

		this.ingredients.forEach((ing) => countArr.push(ing.count));

		console.log('count Arr:', countArr);
		countArr.map((amount) => {
			console.log('amount / this.denom:', eval(amount / this.denom));
			amountArr.push(eval(amount / this.denom));
		});

		// console.log('amount Array:', amountArr);

		this.ingredients.forEach((ing, i) => {
			type === 'decrease' ? (ing.count -= amountArr[i]) : (ing.count += amountArr[i]);
		});
	}
}

/* request.open('GET', `${proxyurl}${url}`);
request.send();
console.log('request sent!');
 */

/* const proxyurl = 'https://cors-anywhere.herokuapp.com/';
const url = 'https://www.thepioneerwoman.com/food-cooking/recipes/a10205/pasta-with-pesto-cream-sauce/';
const urlCombined = `${proxyurl}${url}`;

const servings = (urlCombined, calculate, request) => {
	request = new XMLHttpRequest();
	request.open('GET', urlCombined);
	request.onload = calculate;
	request.send();
};

const calculate = (e) => {
	console.log('request worked!');
	const data = JSON.stringify(e.target.responseText);
	const recipeYieldIndex = data.search('recipeYield');
	const servingsIndex = data.search('servings');

	const str = data.substr(recipeYieldIndex, servingsIndex);
	const num = parseInt(str.match(/\d+/)[0]);
	console.log('num:', num);
	this.servings = num;
	// console.log(e.target.responseText);
	console.log('this.servings (inside):', this.servings);
	this.servings;
};

servings(urlCombined, calculate);
console.log('this.servings (outside):', this.servings); */
