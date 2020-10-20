export default class LikesSearch {
	constructor(search) {
		this.search = search;
		console.log('search:', search);
	}

	filterFaves() {
		const query = this.search;
		console.log(query);
		const likes = state.likes.likes;

		const result = likes.filter((like) => like.title.toLowerCase().includes(query.toLowerCase()));
		console.log('result', result);
		this.result = result;
		this.persistData();
	}

	persistData() {
		localStorage.setItem('search', JSON.stringify(this.search));
		localStorage.setItem('result', JSON.stringify(this.result));
	}
	readStorage() {
		let storage = JSON.parse(localStorage.getItem('search'));
		if (storage) this.search = storage;
		storage = JSON.parse(localStorage.getItem('result'));
		if (storage) this.result = storage;
	}
}
