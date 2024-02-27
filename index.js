const displayscreen = document.getElementById('displayscreen');
const questionform = document.getElementById('questionform');
const commentbox = document.getElementById('commentbox');
commentbox.style.display = 'none';
const addpostbtn = document.getElementById('addpost');
const newformbtn = document.getElementById('newform');

const commentbtn = document.getElementById('commentbtn');

const subject = document.getElementById('subject');
const question = document.getElementById('question');
const searchbox = document.getElementById('searchbox');
let selectedpostid;

//making postarray and retriving data into it from localstorage...
let postarray = [];
let objStr = localStorage.getItem('posts');
console.log(objStr);
if (objStr != null) {
    postarray = JSON.parse(objStr);
}
console.log(postarray);
DiplayPosts();


//DONE
//what will happen when we first time visit... 
newformbtn.onclick = () => {
    questionform.style.display = 'block';
    commentbox.style.display = 'none'
}

//DONE
//buliding a post card...
function createPostCard(post) {
    let newpost = document.createElement('div');
    newpost.id = post.postid;
    newpost.classList.add('card', 'my-3', 'mx-3');
    let statement =
        `<div class="bg-info-subtle card-body">
            <p class="posttime float-end"></p>
            <h4 class="card-title">${post.subject}</h4>
            <hr>
            <p class="card-text">${post.question}</p>
            <hr>`;

    if (post.isliked) {
        statement += `<i class="fa-solid fa-heart" onclick="dolike('${post.postid}')"></i>`;
    }
    else {
        statement += `<i class="fa-regular fa-heart" onclick="dolike('${post.postid}')"></i>`;
    }
    if (post.likes != 0) {
        statement += `<span>${post.likes}</span>`;
    } else {
        statement += `<span></span>`;
    }

    statement += `<button type="button" class="btn btn-link float-end" onclick = "showcommentbox(${post.postid})">Comments</button></div>`;


    newpost.innerHTML = statement;
    return newpost;
}

//DONE
//live search box implementation...
searchbox.addEventListener('input', (e) => {
    displayscreen.innerHTML = '';
    let val = e.target.value;
    console.log(val);
    let matchfound = false;
    postarray.forEach((post) => {
        if (post.subject.toLowerCase().includes(val.toLowerCase())) {
            console.log('inside if');
            matchfound = true;
            //building a post card...
            let newpost = createPostCard(post);

            //highlight code...for searching in 
            let instance = new Mark(newpost);
            instance.mark(val.toLowerCase());

            //appending new post in postbox..
            displayscreen.appendChild(newpost);
        }
    });
    if (!matchfound) {
        displayscreen.innerHTML = `<div class="alert alert-danger" role="alert">
                                    No match found!
                                </div>`
    }
});

//DONE
//creating post object...and returning it...
function createPostObject() {
    let mysubject = subject.value;
    let myquestion = question.value;
    if (myquestion == '' || mysubject == '') {
        alert('Enter value Correctly');
        subject.value = '';
        question.value = '';
        return;
    }
    let postid = Date.now();
    console.log(mysubject);
    console.log(myquestion);

    let post = {
        'subject': mysubject,
        'question': myquestion,
        'postid': postid,
        'isliked': false,
        'likes': 0,
    };
    subject.value = '';
    question.value = '';
    return post;
}

//DONE
//what to do when add post button is clicked...
addpostbtn.onclick = () => {
    console.log("Inside click function");

    //creating post object...
    let post = createPostObject();

    //creating card using post
    let newpost = createPostCard(post);

    displayscreen.appendChild(newpost);

    //adding new post into postarray...
    postarray.push(post);
    //saving posts into localstorage...
    SavePosts(postarray);
    console.log(postarray);
};

//DONE
//like heart functionality in posts...
function dolike(postid) {
    console.log(postid);
    //console.log(postarray.at(0).likes);
    let postlikes = 0;
    postarray = postarray.map((post) => {
        //console.log(post);
        if (post.postid == postid) {
            post.isliked = true;
            post.likes++;
            postlikes = post.likes;
        }
        return post;
    });
    let mypost = document.getElementById(postid);
    mypost.querySelector('i').classList.add('fa-solid', 'fa-heart');
    mypost.querySelector('span').innerHTML = postlikes;

    SavePosts(postarray);
    DiplayPosts();
}

//DONE
//save posts into localstorage...
function SavePosts(postarray) {
    let mypostarray = JSON.stringify(postarray);
    localStorage.setItem('posts', mypostarray);
    //DiplayPosts();
}

//DONE
//display post first time when we visit the page...
function DiplayPosts() {
    postarray.sort((post1, post2) => {
        return post2.likes - post1.likes;
    });
    let statement = `<h4>Here we will se all posts.</h4>`;
    displayscreen.innerHTML = statement;
    if (postarray.length) {
        postarray.forEach((post) => {
            //creating postcard
            let postcard = createPostCard(post);
            //appending postcard to postbox...
            displayscreen.appendChild(postcard);
        });
    }
    else {
        displayscreen.innerHTML = '';
    }
}


// .......................................ALL WORK OF COMMENT SECTION IS HERE...................................................

//making commentarray and retriving data into it from localstorage...
let commentarray = [];
objStr = localStorage.getItem('comments');
if (objStr != null) {
    commentarray = JSON.parse(objStr);
}

//handling comments... in comment box...
function showcommentbox(postid) {
    questionform.style.display = 'none';
    commentbox.style.display = 'block';
    selectedpostid = postid;
    console.log(postid);
    let mypostsubject;
    postarray.forEach((post) => {
        if (postid == post.postid)
            mypostsubject = post.subject
    });
    let filterdcommentarray = commentarray.filter((post) => {
        if (post.postid == postid) {
            return post;
        }
    });

    console.log(mypostsubject);
    //removing all elements from commentbox except first elment i.e. comment-form 
    while (commentbox.childNodes.length > 2) {
        commentbox.removeChild(commentbox.lastChild);
    }

    let staredcommentarray = filterdcommentarray.filter((comment) => {
        if (comment.isstared) {
            return comment;
        }
    });
    staredcommentarray.sort((comment1, comment2) => {
        return comment2.likes - comment1.likes;
    });
    let nonstaredcommentarray = filterdcommentarray.filter((comment) => {
        if (!comment.isstared) {
            return comment;
        }
    });
    nonstaredcommentarray.sort((comment1, comment2) => {
        return comment2.likes - comment1.likes;
    });
    let isanycomment = false;
    let postowner = document.createElement('div');
    postowner.classList.add('row', 'mx-auto', 'text-center');
    postowner.innerHTML = `<h3>${mypostsubject} Comments</h3>`;
    commentbox.appendChild(postowner);

    staredcommentarray.forEach((comment) => {
        isanycomment = true;
        let commentdiv = createCommentCard(comment);
        commentbox.appendChild(commentdiv);
    });
    nonstaredcommentarray.forEach((comment) => {
        isanycomment = true;
        let commentdiv = createCommentCard(comment);
        commentbox.appendChild(commentdiv);
    });
    if (!isanycomment) {
        let nocommentwarning = createCommentWarningCard();
        commentbox.appendChild(nocommentwarning);
    }

}

//creating commentwarning card...
function createCommentWarningCard() {
    let nocommentwarning = document.createElement('div');
    nocommentwarning.id = 'anycommentwarning';
    nocommentwarning.classList.add('p-3', 'text-primary-emphasis', 'bg-primary-subtle', 'border', 'border-primary-subtle');
    nocommentwarning.innerHTML = `<p>No Comments till now!</p>`;
    return nocommentwarning;
    //console.log(nocommentwarning);
}
//DONE
//creating a comment object...
function createCommentObject() {
    let commenter = document.getElementById('commenter').value;
    let commentdata = document.getElementById('commentdata').value;
    if (commenter == '' || commentdata == '') {
        alert('Empty Fields not allowed!');
        return;
    }
    document.getElementById('commenter').value = '';
    document.getElementById('commentdata').value = '';
    let comment = {
        postid: selectedpostid,
        commenter: commenter,
        comment: commentdata,
        commentid: Date.now(),
        likes: 0,
        dislikes: 0,
        isstared: false
    };
    return comment;
}

//DONE
//how to handle commentbtn in commentbox...
commentbtn.onclick = () => {
    let nocommentwarning = document.getElementById('anycommentwarning');
    if (nocommentwarning) {
        commentbox.removeChild(nocommentwarning);
    }
    //creating comment object...
    let comment = createCommentObject();

    //creating a comment card...
    let commentdiv = createCommentCard(comment);
    commentbox.appendChild(commentdiv);

    console.log(comment);
    commentarray.push(comment);
    SaveComments(commentarray);
}

//DONE
//creating comment card and returning...
function createCommentCard(comment) {
    let commentdiv = document.createElement('div');
    commentdiv.classList.add('card', 'my-2','bg-info-subtle','mx-2');
    commentdiv.id = comment.commentid;
    let statement = '';
    statement = `<div class="card-body">
                <h6 class="card-subtitle mb-2 text-body-secondary">${comment.commenter}</h6>
                <p class="card-text">${comment.comment}</p>
                <i class="fa-solid fa-thumbs-up" style="color:green" onclick="thumbsup(${comment.commentid})">`
    if (comment.likes > 0) {
        statement += `${comment.likes}`;
    }
    statement += `</i>
                <i class="fa-solid fa-thumbs-down" style="color:red" onclick="thumbsdown(${comment.commentid})">`
    if (comment.dislikes > 0) {
        statement += `${comment.dislikes}`;
    }
    if (comment.isstared) {
        statement += `</i><i class="fa-solid fa-star" onclick="dostar(${comment.commentid})"></i>
            </div>`
    }
    else {
        statement += `</i><i class="fa-regular fa-star" onclick="dostar(${comment.commentid})"></i>
            </div>`
    }
    commentdiv.innerHTML = statement;
    return commentdiv;
}

//DONE
//function for handling thumbs up in comments...
function thumbsup(commentid) {
    console.log('thumbs up working');
    let likes = 0;
    commentarray = commentarray.map((comment) => {
        if (comment.commentid == commentid) {
            likes = ++comment.likes;
        }
        return comment;
    });
    console.log(likes);

    document.getElementById(commentid).querySelector('.fa-thumbs-up').innerHTML = likes;
    SaveComments(commentarray);
    showcommentbox(selectedpostid);
}

//DONE
//function for handling thumbs down in comments...
function thumbsdown(commentid) {
    console.log('thumbs down working');
    let dislikes = 0;
    commentarray = commentarray.map((comment) => {
        if (comment.commentid == commentid) {
            dislikes = ++comment.dislikes;
        }
        return comment;
    });
    console.log(dislikes);

    document.getElementById(commentid).querySelector('.fa-thumbs-down').innerHTML = dislikes;
    SaveComments(commentarray);
}

//DONE
//function for handling star facility in comments...
function dostar(commentid) {
    console.log('inside do star');
    let isstared = false;
    commentarray = commentarray.map((comment) => {
        if (comment.commentid == commentid) {
            if (comment.isstared) isstared = true;
            comment.isstared = !comment.isstared;
        }
        return comment;
    });
    let mycomment = document.getElementById(commentid);
    if (isstared) {
        let mystar = mycomment.querySelector('.fa-solid.fa-star');
        mystar.classList.remove('fa-solid');
        mystar.classList.add('fa-regular');
    } else {
        let mystar = mycomment.querySelector('.fa-regular.fa-star');
        mystar.classList.remove('fa-regular');
        mystar.classList.add('fa-solid');
    }

    SaveComments(commentarray);
    showcommentbox(selectedpostid);
}

//DONE
//function for saving comments in local storage...
function SaveComments(commentarray) {
    let commentarraystr = JSON.stringify(commentarray);
    localStorage.setItem('comments', commentarraystr);
}

//function for time updation everytime...
updatePostTime();
setInterval(updatePostTime, 60000);
function updatePostTime() {
    let timers = document.querySelectorAll('.posttime');
    timers.forEach(element => {
        let grandparent = element.parentElement.parentElement;
        let grandparentPostid = grandparent.id;
        console.log(grandparentPostid);
        let timetoshow;
        let time = 'seconds ago...';
        let millis = Date.now() - grandparentPostid;
        timetoshow = Math.floor(millis / 1000);

        if (timetoshow >= 12 * 30 * 24 * 3600) {
            // years
            timetoshow = Math.floor(timetoshow / (12 * 30 * 24 * 3600));
            time = 'year ago...';
        } else if (timetoshow >= 30 * 24 * 3600) {
            // months
            timetoshow = Math.floor(timetoshow / (30 * 24 * 3600));
            time = 'month ago...';
        } else if (timetoshow >= 24 * 3600) {
            // days
            timetoshow = Math.floor(timetoshow / (24 * 3600));
            time = 'day ago...';
        } else if (timetoshow >= 3600) {
            // hours
            timetoshow = Math.floor(timetoshow / 3600);
            time = 'hour ago...';
        } else if (timetoshow >= 60) {
            // minutes
            timetoshow = Math.floor(timetoshow / 60);
            time = 'minute ago...';
        } else {
            time = 'just now';
        }


        element.innerHTML = `Posted: ${timetoshow} ${time}`;
    });
}

// function millisToMinutesAndSeconds(millis) {
//     var minutes = Math.floor(millis / 60000);
//     var seconds = ((millis % 60000) / 1000).toFixed(0);
//     return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
//   }
