let openCreateForm = document.querySelector('.openCreateForm')
let createPostFormWrapper = document.querySelector('.createPostFormWrapper')

let postsContainer = document.querySelector('.postsContainer')

let createPostButton = document.querySelector('.createPostButton')
let titleInput = document.querySelector('#titleInput')
let contentInput = document.querySelector('#contentInput')

let modalWindow = document.querySelector('.modalWindow')
let modalBtn = document.querySelector('.modalBtn')

let modalTitle = document.querySelector('.modalTitle')
let modalText = document.querySelector('.modalText')

let editModalBtn = document.querySelector('.editModalBtn')
let deleteModalBtn = document.querySelector('.deleteModalBtn')

let commentsInput = document.querySelector('.commentsInput')
let addCommentBtn = document.querySelector('.addCommentBtn')
let comments = document.querySelector('.comments')

let openedElementId
let openedPostName

openCreateForm.addEventListener('click', () => {
    createPostFormWrapper.style.display = "block"
})


function showPosts() {
    fetch('http://localhost:3000/posts') 
    .then(response => response.json())
    .then(posts => {
        for (const i of posts) {
            postsContainer.innerHTML += `
            <div class="postInContainer" id="${i.id}">
                <h2 class="postTitle">${i.title}</h2>
                <p class="postContent">${i.content}</p>
            </div>
            `
            
        }
        console.log(postsContainer);
    })
}

showPosts()


async function createPostFunk() {
    let title = titleInput.value
    let content = contentInput.value

    await fetch('http://localhost:3000/posts')
    .then(resp => resp.json())
    .then(posts => {
        for (const i of posts) {
            if (title == i.title) {
                throw new Error('exists')
            }
        }

        let options = {
            method: "POST",
            body: JSON.stringify(
            {
                title: title,
                content: content
            }),
            headers: {
                "Content-Type": "application/json; charset=UTF-8",
            }
        }

        fetch('http://localhost:3000/posts', options)
        .then(resp => resp.json())
        .then(() => {
            postsContainer.textContent = ''
            createPostFormWrapper.style.display = "none"
            showPosts()
        })
    })
}

createPostButton.addEventListener('click', e=> {
    e.preventDefault()
    createPostFunk()
})

function showModalPost(e) {
    let posts = document.querySelectorAll('.postInContainer')

    let postElement = e.target.closest('.postInContainer');
    openedElementId = postElement.id
    console.log(openedElementId);

    modalWindow.classList.toggle('none')

    modalTitle.textContent = ''
    modalText.textContent = ''

    for (const i of posts) {
        if (i.id == postElement.id) {
            let postTitle = i.querySelector('.postTitle')
            let postContent = i.querySelector('.postContent')

            modalTitle.textContent = postTitle.textContent
            modalText.textContent = postContent.textContent
            break
        }
    }
    comments.textContent = ''
    showCommentsFunc()
}

postsContainer.addEventListener('click', e => {
    showModalPost(e)
})

modalBtn.addEventListener('click', () => {
    modalWindow.classList.toggle('none')
    postsContainer.textContent = ''
    showPosts()
})

async function editModalContentFunc() {
    let newPostTitle = prompt('title')
    let newPostContent = prompt('content')

    console.log(openedElementId);
    let options = {
        method: "PATCH",
        body: JSON.stringify({
            id: openedElementId,
            title: newPostTitle,
            content: newPostContent
        }),
        headers: {
          "Content-Type": "application/json; charset=UTF-8",
        },
    };

    await fetch(`http://localhost:3000/posts/${openedElementId}`, options)

    let resp = await fetch(`http://localhost:3000/comments`)
    let comment = await resp.json()

    let idCommentToChange
    let commentContent
    for (const i of comment) {
        if (i.title == openedPostName) {
            idCommentToChange = i.id
            commentContent = i.content
        }
    }
    let options2 = {
        method: "PATCH",
        body: JSON.stringify({
            id: idCommentToChange,
            title: newPostTitle,
            content: commentContent
        }),
        headers: {
            "Content-Type": "application/json; charset=UTF-8",
        },
    };
    await fetch(`http://localhost:3000/comments/${idCommentToChange}`, options2)
}

editModalBtn.addEventListener('click', () => {
    editModalContentFunc()
})

async function deletePostFunc() {
    await fetch(`http://localhost:3000/posts/${openedElementId}`, {
        method: "DELETE",
    });

    let resp = await fetch(`http://localhost:3000/comments`)
    let comments = await resp.json()

    let idCommentToDelete
    for (const i of comments) {
        if (i.title == openedPostName) {
            idCommentToDelete = i.id
        }
        break
    }

    await fetch(`http://localhost:3000/comments/${idCommentToDelete}`, {
        method: "DELETE",
    });

}

deleteModalBtn.addEventListener('click', () => {
    deletePostFunc()
})

async function addCommentsFunc() {
    let commentValue = commentsInput.value

    let resp = await fetch('http://localhost:3000/posts') 
    let posts = await resp.json()
    for (const i of posts) {
        if (openedElementId == i.id) {
            openedPostName = i.title
            
        }
    }
    console.log(openedPostName);

    const options = {
        method: "POST",
        body: JSON.stringify(
            {
                title: openedPostName,
                content: commentValue
            }),
        headers: {
          "Content-Type": "application/json; charset=UTF-8",
        },
    };

    await fetch('http://localhost:3000/comments', options)

    showCommentsFunc()
}


function showCommentsFunc() {
    comments.textContent = ''
    fetch('http://localhost:3000/posts')
        .then(resp => resp.json())
        .then(posts => {
            for (const post of posts) {
                if (post.id === openedElementId) {
                    openedPostName = post.title;

                    fetch('http://localhost:3000/comments')
                    .then(resp => resp.json())
                    .then(comment => {
                        
                        for (const i of comment) {
                            if (openedPostName == i.title) {
                                comments.innerHTML += `<li>${i.content}</li>`
                            }
                        }
                    })
                }
            }
        })            
}

addCommentBtn.addEventListener('click', () => {
    addCommentsFunc()
})

