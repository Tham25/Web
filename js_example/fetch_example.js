
//fetch
var courseAPI = 'http://localhost:3000/courses';

fetch(courseAPI)
    .then(function(reponse){
        return reponse.json();
        //Json.parse -> JS type
    })

    .then(function(courses){
        var htmls = courses.map(function(course) {
            return `<li> 
                <h2>${course.name}</h2>
                <p>${course.description}</p>
            </li>`;
        });
        
        var html = htmls.join('');
        document.getElementById('post-block').innerHTML = html;
    })

    .catch(function(error) {
        console.log(error);
    }) 