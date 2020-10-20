export const request = new XMLHttpRequest();

request.addEventListener('load', () => {
	console.log('request worked!');
	const data = JSON.parse(this.responseText);
	console.log(data);
});

request.open('GET', 'https://www.allrecipes.com/recipe/11758/baked-ziti-i/');
request.send();
console.log('request sent!');
