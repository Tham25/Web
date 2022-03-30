

//[first, ...rest], ...values
function highlight([first, ...rest], ...values) {
    html = values.reduce( function(result, value){
        return [...result, `<span>${value}</span>`, rest.shift()];
    } , [first])
    return html.join('');
}

var brand = 'F8';
var course = 'Javascript';


var html = highlight`Học lập trình ${course} tại ${brand}!`;

console.log(html);