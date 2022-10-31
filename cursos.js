
var url_string = document.URL;
var url = new URL(url_string);
var categoria = url.searchParams.get("categoria");

console.log(categoria);