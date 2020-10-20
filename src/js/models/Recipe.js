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
		if (storage) this.ingredients = storage;
	}

	calcTime() {
		// Assuming that we need 15 min for each 3 ingredients
		const numIng = this.ingredients.length; // ingredients is an array
		const periods = Math.ceil(numIng / 3);
		this.time = periods * 15;
	}

	calcServings(url) {
		const proxyurl = 'https://cors-anywhere.herokuapp.com/';
		const urlCombined = `${proxyurl}${url}`;

		const servingsRequest = (urlCombined, calculate, request) => {
			request = new XMLHttpRequest();
			request.open('GET', urlCombined);
			request.onload = calculate;
			request.send();
		};

		const calculate = (e) => {
			const data = JSON.stringify(e.target.responseText);
			const recipeYieldIndex = data.search('recipeYield');
			const servingsIndex = data.search('servings');
			const servesIndex = data.search('Serves');

			if (recipeYieldIndex !== -1) {
				if (servingsIndex !== -1 && recipeYieldIndex - servingsIndex < 15) {
					const str = data.substr(recipeYieldIndex, servingsIndex);
					this.recipeServings = parseInt(str.match(/\d+/)[0]);
				} else if (servesIndex !== -1) {
					const secondVal = parseInt(`${servesIndex + 10}`);
					const str = data.slice(servesIndex, secondVal);
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

		// if there is a blank line, remove it
		this.ingredients.map((ing, i) => (ing.includes('&nbsp;') ? this.ingredients.splice(i, 1) : null));
		this.ingredients.map((ing, i) => (ing.includes('_____') ? this.ingredients.splice(i, 1) : null));

		const newIngredients = this.ingredients.map((el, index) => {
			// 1) Uniform units
			let ingredient = el.toLowerCase();
			unitsLong.forEach((unit, i) => {
				ingredient = ingredient.replace(unit, unitsShort[i]);
			});
			// 2) Remove parentheses
			ingredient = ingredient.replace(/ *\([^)]*\) */g, ' ');

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
				if (commaInd >= 10 && commaInd < 50) ingredient = ingredient.substring(0, ingredient.lastIndexOf(','));
			}
			if (ingredient.includes(' - ')) {
				const dashInd = ingredient.indexOf('-');
				if (dashInd > 20 && dashInd < 30) ingredient = ingredient.substring(0, ingredient.lastIndexOf('-'));
			}
			if (ingredient.includes('scant ')) {
				let newIngr = ingredient.split(' ');
				let scantInd = ingredient.indexOf('scant');
				if (scantInd === 0) ingredient = newIngr.splice(1).join(' ');
			}
			if (ingredient.includes('1 stick ')) {
				let newIngr = ingredient.split(' ');
				let stickInd = ingredient.indexOf('1 stick');
				if (stickInd === 0) ingredient = newIngr.splice(2).join(' ');
			}
			if (ingredient.includes(' heaped ')) {
				let newIngr = ingredient.split(' ');
				let heapInd = ingredient.indexOf('heaped');
				if (heapInd < 3) ingredient = newIngr.splice(1, 1).join(' ');
			}
			if (ingredient.includes(' to ')) {
				let newIngr = ingredient.split(' ');
				const toInd = ingredient.indexOf('to');
				if (toInd <= 2) ingredient = newIngr.splice(toInd).join(' ');
			}
			if (ingredient.includes(' or ')) {
				let newIngr = ingredient.split(' ');
				const orInd = ingredient.indexOf('or');
				if (orInd <= 2) ingredient = newIngr.splice(orInd).join(' ');
			}
			if (ingredient.includes('*') || ingredient.includes('**')) {
				const starInd = ingredient.indexOf('*');
				const doubleStarInd = ingredient.indexOf('**');
				if (starInd >= 10) ingredient = ingredient.substring(0, ingredient.lastIndexOf('*'));
				if (doubleStarInd >= 10) ingredient = ingredient.substring(0, ingredient.lastIndexOf('*'));
			}

			const arrIng = ingredient.split(' ');

			const firstIndex = (ing) => {
				let arr = ing[0].split('');
				let result = [];
				const letters = [];
				let num = '';
				// if the item is a fraction, then turn it back into a string
				if (arr.includes('/') || arr.includes('.')) {
					result = arr.join('');
				} else if (arr.includes('-')) {
					result = arr[0];
				} else {
					// if it's a string, put that in the SECOND position
					arr.forEach((el) => {
						if (isNaN(parseInt(el))) {
							letters.push(el);
							result[1] = letters.join('');
						} else {
							// if it's a number, put it in the FIRST position
							num = num.concat(`${el}`);
						}
						num.toString();
						result[0] = num;
					});
				}
				return result;
			};

			const replaceFirst = (item) => {
				item = arrIng[0];
				const firstFnc = firstIndex(arrIng);

				if (item.includes(' ') || item.includes('/')) {
					return item;
				} else {
					arrIng.splice(0, 1, ...firstFnc);
					return arrIng;
				}
			};
			replaceFirst(arrIng);

			function newArray() {
				let newArr;

				if (ingredient.length >= 1 && arrIng[0].length >= 1) {
					// the new array is the original array
					newArr = arrIng;
				} else {
					// if the ingredients are different lengths, then use the ReplaceFirst function
					newArr = replaceFirst(arrIng);
				}
				return newArr;
			}

			const newIngredientArr = newArray();
			let objIng;
			const unitIndex = arrIng.findIndex((el2) => {
				if (newIngredientArr[0] === undefined) {
				} else {
					return unitsShort.includes(el2);
				}
			});

			if (unitIndex > -1) {
				// There is a measurement unit
				// i.e. 4 1/2 cups, arrCount is [4, 1/2] --> eval("4+1/2") --> 4.5
				// i.e. 4 cups, arrCount is [4]

				const arrCount = newIngredientArr.slice(0, unitIndex);
				let count;
				if (arrCount.length === 1) {
					count = eval(newIngredientArr[0].replace('-', '+'));
				} else {
					count = eval(newIngredientArr.slice(0, unitIndex).join('+'));
				}
				objIng = {
					count,
					unit: newIngredientArr[unitIndex],
					ingredient: newIngredientArr.slice(unitIndex + 1).join(' ')
				};
			} else if (parseInt(newIngredientArr[0])) {
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
			}

			return objIng;
		});
		this.ingredients = newIngredients;
	}

	updateServings(type) {
		// type will be + or - button
		// Servings

		const quarter = this.recipeServings / 4;
		this.increment = Math.round(quarter * 2).toFixed() / 2;

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

		countArr.map((amount) => {
			amountArr.push(eval(amount / this.denom));
		});

		this.ingredients.forEach((ing, i) => {
			type === 'decrease' ? (ing.count -= amountArr[i]) : (ing.count += amountArr[i]);
		});
	}
}
