
var courseAPI = 'http://localhost:3000/courses';

function start() {
    getCourses(renderCourses);

    handleCreateForm();
}

//
start();

function getCourses(callback) {
    fetch(courseAPI)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            callback(data);
        })

}

function createCourse(data, callback) {
    var options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    };
    fetch(courseAPI, options)
        .then(function (response) {
            response.json();
        })
        .then(callback);
}

function handleDeleteCourse(idCourse) {
    var options = {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    };
    fetch(courseAPI + '/' + idCourse, options)
        .then(function (response) {
            response.json();
        })
        .then(function () {
            var courseItem = document.querySelector('.course-item-' + idCourse);
            if (courseItem) {
                courseItem.remove();
            }
        });
}


function handleChangeCourse(idCourse) {
    //changeview
    var creatBtn = document.querySelector('#create');
    creatBtn.setAttribute("class", "save");
    creatBtn.innerText = 'save';

    var nameCourse = document.querySelector(`.course-name-${idCourse}`).innerText;
    var descriptionCourse = document.querySelector(`.course-description-${idCourse}`).innerText;
    

    document.querySelector('input[name="name"]').value = nameCourse;
    document.querySelector('input[name="description"]').value = descriptionCourse;
    
    //xu ly -khi click nut save
    document.querySelector('.save').onclick = function() {
        var newName = document.querySelector('input[name="name"]').value;
        var newDescription = document.querySelector('input[name="description"]').value;
    
        var dataChange = {
            name: newName,
            description: newDescription
        };
    
        var options = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dataChange)
                
        };
    
        fetch (courseAPI + '/' + idCourse, options)
            .then (function(reponse) {
                reponse.json;
            })
            .then(function() {
                getCourses(renderCourses);
            });
        
        clearInputValue();
    }
    
}


function renderCourses(courses) {
    var listCoursesBlock = document.querySelector('#list-courses');

    var htmls = courses.map(function (course) {
        return `
            <li class="course-item-${course.id}">
                <h4 class="course-name-${course.id}">${course.name}</h4>
                <p class="course-description-${course.id}">${course.description}</p>
                <button onclick="handleDeleteCourse(${course.id})">Xóa</button>
                <button onclick="handleChangeCourse(${course.id})">Sửa</button>
            </li>
        `;
    });
    listCoursesBlock.innerHTML = htmls.join('');
}

function handleCreateForm() {
    var createBtn = document.querySelector('#create');
    createBtn.onclick = function () {
        var name = document.querySelector('input[name="name"]').value;
        var description = document.querySelector('input[name="description"]').value;
        var formData = {
            name: name,
            description: description
        }
        createCourse(formData, function () {
            getCourses(renderCourses);
        });
        clearInputValue();
    }
}

function clearInputValue() {
    document.querySelector('input[name="name"]').value = '';
    document.querySelector('input[name="description"]').value = '';
}
