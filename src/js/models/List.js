import uniqid from 'uniqid';

export default class List {
	constructor() {
		this.items = [];
	}
	addItem(count, unit, ingredient) {
		const item = {
			id: `${window.location.hash.replace('#', '')}-${ingredient}`,
			count: `${count === undefined ? 0 : count}`,
			unit,
			ingredient
		};
		this.items.push(item);
		this.persistData();
		return item;
	}
	deleteItem(id) {
		const index = this.items.findIndex((el) => {
			el.id === id;
		});
		this.items.splice(index, 1);
		this.persistData();
	}
	deleteAll() {
		this.items = [];
		this.persistData();
	}
	duplicateID(ingredient, unit) {
		const duplicate = this.items.find((el) => el.ingredient === ingredient && el.unit === unit);
		this.persistData();
		return duplicate ? duplicate.id : false;
	}
	getCount(id) {
		this.items.forEach((el) => el.id === id);
	}
	updateCount(id, newCount) {
		this.items.forEach((el) => {
			if (el.id.split(' ')[0] === id) el.count = newCount;

			this.persistData();
			return el.count;
		});
	}
	isOnList(id) {
		return this.items.findIndex((el) => el.id === id) !== -1;
	}
	getNumList() {
		return this.items.length;
	}
	persistData() {
		localStorage.setItem('items', JSON.stringify(this.items));
	}
	readStorage() {
		const storage = JSON.parse(localStorage.getItem('items'));
		if (storage) this.items = storage;
	}
	deleteStorage() {
		localStorage.removeItem('items', JSON.parse(this.items));
	}
}
