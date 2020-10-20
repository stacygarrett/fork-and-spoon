import axios from 'axios';

export default class Search {
	constructor(query) {
		this.query = query;
	}
	async getResults() {
		try {
			const res = await axios(`https://forkify-api.herokuapp.com/api/search?q=${this.query}`);
			this.result = res.data.recipes;
			this.persistData();
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
