import axios from 'axios';

export default class Search {
	constructor(query) {
		this.query = query;
		// this.savedQuery = query;
	}
	async getResults() {
		try {
			const res = await axios(`https://forkify-api.herokuapp.com/api/search?q=${this.query}`);
			this.result = res.data.recipes;
			// this.savedQuery.push(this.query);
			this.persistData();
			// console.log(this.result);
		} catch (err) {
			alert(err);
		}
	}
	persistData() {
		localStorage.setItem('query', JSON.stringify(this.query));
		localStorage.setItem('result', JSON.stringify(this.result));
	}
	readStorage() {
		let storage = JSON.parse(localStorage.getItem('query'));
		if (storage) this.query = storage;
		storage = JSON.parse(localStorage.getItem('result'));
		if (storage) this.result = storage;
	}
}

/* 
In the Search.js file (as soon as you get there), just replace:

const res = await axios(`${PROXY}http://food2fork.com/api/search?key=${KEY}&q=${this.query}`);
with this:

const res = await axios(`https://forkify-api.herokuapp.com/api/search?&q=${query}`);
const res = await axios(`https://forkify-api.herokuapp.com/api/search?&q=${this.query}`);


Then, in Recipe.js (as soon as you get there), please replace:

const res = await axios(`${PROXY}http://food2fork.com/api/get?key=${KEY}&rId=${this.id}`);
with this:

const res = await axios(`https://forkify-api.herokuapp.com/api/get?rId=${this.id}`); 
*/
