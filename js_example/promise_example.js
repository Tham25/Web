//Promise

users = [
    {
        id: 1,
        name: 'Kien Dam'
    },
    {
        id: 2,
        name: 'Son Dang'
    },
    {
        id: 3,
        name: 'Dung Dam'
    }
];

comments = [
    {
        id: 1,
        user_id: 1,
        content: 'Anh Son chua ra video :('
    },
    {
        id: 2,
        user_id: 2,
        content: 'Vua ra xong em oi'
    }
];

//Lay comments
//2. Tu comment lay ra user_id
//3. Tu user_id lay ra user tuong ung

//fake API
function getComments() {
    return new Promise(function(resolve){
        setTimeout(function(){
            resolve(comments);
        }, 1000);
    });
}

function getUserByIds(userIds) {
    return new Promise(function(resolve){
        var result = users.filter(function(user){
            return userIds.includes(user.id);
        });
        
        setTimeout(function(){
            resolve(result);
        }, 1000);
    });
}

getComments()
    .then(function(comments){
        var userIds = comments.map(function(comment){
            return comment.user_id;
        });

        return getUserByIds(userIds)
            .then(function(users){
                return {
                    user: users,
                    comment: comments
                };
            });
    })

    .then(function(data){
        var commentBlock = document.getElementById('comment-block');

        var html = '';
        data.comment.forEach(function(comment){
            var user = data.user.find(function(user){
                return user.id === comment.user_id;
            });

            html += `<li>${user.name}: ${comment.content}</li>`
        });
        console.log(html);
        commentBlock.innerHTML = html;
    })

