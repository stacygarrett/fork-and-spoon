import axios from 'axios';

export default class Search {
	constructor(query) {
		this.query = query;
	}
	async getResults() {
		try {
			const res = await axios(`https://forkify-api.herokuapp.com/api/search?q=${this.query}`);
			this.result = res.data.recipes;
			// console.log(this.result);
		} catch (err) {
			alert(err);
		}
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
