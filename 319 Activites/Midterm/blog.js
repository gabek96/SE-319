let topics = JSON.parse(localStorage.getItem('topics')) || [];

function createTopic() {
    const title = document.getElementById('topic-title').value.trim();
    const content = document.getElementById('topic-content').value.trim();

    if (title && content) {
        const newTopic = {
            title: title,
            content: content,
            comments: []
        };

        topics.push(newTopic);
        localStorage.setItem('topics', JSON.stringify(topics));
        displayTopics();
        clearInputs();
    } else {
        alert('Please fill in both fields.');
    }
}

function clearInputs() {
    document.getElementById('topic-title').value = '';
    document.getElementById('topic-content').value = '';
}

function displayTopics() {
    const topicsList = document.getElementById('topics-list');
    topicsList.innerHTML = ''; // Clear previous topics

    topics.forEach((topic, index) => {
        const topicDiv = document.createElement('div');
        topicDiv.classList.add('topic');
        topicDiv.innerHTML = `
            <h3>${topic.title}</h3>
            <p>${topic.content}</p>
            <div class="comments">
                <h4>Comments</h4>
                <input type="text" id="comment-input-${index}" placeholder="Add a comment" class="form-control">
                <button class="btn btn-secondary mt-2" onclick="addComment(${index})">Comment</button>
                <div id="comments-list-${index}" class="mt-2"></div>
            </div>
        `;
        topicsList.appendChild(topicDiv);
        displayComments(topic.comments, index);
    });
}

function addComment(topicIndex) {
    const commentInput = document.getElementById(`comment-input-${topicIndex}`);
    const comment = commentInput.value.trim();

    if (comment) {
        topics[topicIndex].comments.push(comment);
        localStorage.setItem('topics', JSON.stringify(topics));
        displayComments(topics[topicIndex].comments, topicIndex);
        commentInput.value = ''; // Clear the input field
    } else {
        alert('Please enter a comment.');
    }
}

function displayComments(comments, topicIndex) {
    const commentsList = document.getElementById(`comments-list-${topicIndex}`);
    commentsList.innerHTML = ''; // Clear previous comments

    comments.forEach(comment => {
        const commentDiv = document.createElement('div');
        commentDiv.innerText = comment;
        commentsList.appendChild(commentDiv);
    });
}

// Load topics on page load
window.onload = displayTopics;
