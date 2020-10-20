export default class Likes {
	constructor() {
		this.likes = [];
	}

	addLike(id, title, author, img, timeStamp) {
		const like = { id, title, author, img, timeStamp };
		// let timeStamp = new Date().getTime();
		this.likes.push(like);
		// this.order;
		// Persist data in localStorage
		this.persistData();
		return like;
	}
	deleteLike(id) {
		console.log('id in deleteLike:', id);
		const index = this.likes.findIndex((el) => el.id === id);
		this.likes.splice(index, 1);

		// Persist data in localStorage
		this.persistData();
	}
	deleteAllLikes() {
		const length = this.likes.length;
		this.likes.splice(0, length);

		// Persist data in localStorage
		this.persistData();
	}
	isLiked(id) {
		return this.likes.findIndex((el) => el.id === id) !== -1;
	}
	getNumLikes() {
		return this.likes.length;
	}
	/* 	filterFaves() {
		const res = this.likes.title.filter((title) => title.includes(this.query));
		console.log(res);
		this.persistData();
		console.log(search);
	} */

	persistData() {
		localStorage.setItem('likes', JSON.stringify(this.likes));
	}
	readStorage() {
		const storage = JSON.parse(localStorage.getItem('likes'));
		// Resoring likes from the local Storage
		if (storage) this.likes = storage;
	}
}
