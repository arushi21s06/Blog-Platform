const API_URL = "/api";


// ========================================
// AUTHENTICATION DATA
// ========================================

const token = localStorage.getItem("token");

let currentUser = null;

try {
    const savedUser = localStorage.getItem("user");

    if (savedUser) {
        currentUser = JSON.parse(savedUser);
    }

} catch (error) {

    console.error("Unable to read saved user:", error);

    localStorage.removeItem("user");
}


// ========================================
// DOM ELEMENTS
// ========================================

const themeToggle =
    document.getElementById("themeToggle");

const postForm =
    document.getElementById("postForm");

const postsContainer =
    document.getElementById("postsContainer");

const postMessage =
    document.getElementById("postMessage");

const userInfo =
    document.getElementById("userInfo");

const authSection =
    document.getElementById("authSection");


// ========================================
// THEME
// ========================================

function updateThemeButton() {

    if (!themeToggle) return;

    if (
        document.body.classList.contains("light-mode")
    ) {

        themeToggle.textContent = "🌙 Dark";

    } else {

        themeToggle.textContent = "☀️ Light";

    }
}


function loadSavedTheme() {

    const savedTheme =
        localStorage.getItem("blogifyTheme");

    if (savedTheme === "light") {

        document.body.classList.add("light-mode");

    } else {

        document.body.classList.remove("light-mode");

    }

    updateThemeButton();
}


if (themeToggle) {

    themeToggle.addEventListener("click", () => {

        document.body.classList.toggle("light-mode");

        const isLight =
            document.body.classList.contains("light-mode");

        localStorage.setItem(
            "blogifyTheme",
            isLight ? "light" : "dark"
        );

        updateThemeButton();

    });

}


loadSavedTheme();


// ========================================
// GET USER ID FROM TOKEN
// ========================================

function getUserIdFromToken() {

    if (!token) return null;

    try {

        const payload =
            JSON.parse(
                atob(token.split(".")[1])
            );

        return (
            payload.id ||
            payload._id ||
            payload.userId ||
            null
        );

    } catch (error) {

        console.error(
            "Invalid token:",
            error
        );

        return null;
    }
}


const currentUserId =
    currentUser?.id ||
    currentUser?._id ||
    getUserIdFromToken();


// ========================================
// AUTHENTICATION UI
// ========================================

function updateAuthenticationUI() {

    if (!authSection) return;


    // ====================================
    // LOGGED IN USER
    // ====================================

    if (token && currentUser) {

        const safeName =
            escapeHTML(
                currentUser.name || "User"
            );


        const safeEmail =
            escapeHTML(
                currentUser.email || ""
            );


        authSection.innerHTML = `

            <div class="user-profile">

                <strong>
                    👤 ${safeName}
                </strong>

                <span>
                    📧 ${safeEmail}
                </span>

            </div>


            <button
                id="logoutBtn"
                type="button"
            >
                Logout
            </button>

        `;


        const logoutBtn =
            document.getElementById("logoutBtn");


        if (logoutBtn) {

            logoutBtn.addEventListener(
                "click",
                logoutUser
            );

        }


    } else {

        // ====================================
        // NOT LOGGED IN
        // ====================================

        authSection.innerHTML = `

            <a href="/register.html">
                Register
            </a>

            <a href="/login.html">
                Login
            </a>

        `;

    }

}


// ========================================
// USER INFORMATION
// ========================================

function updateUserInfo() {

    if (!userInfo) return;


    if (token && currentUser) {

        userInfo.textContent =
            `✨ Welcome, ${currentUser.name}! Start sharing your story.`;

    } else {

        userInfo.textContent =
            "🔐 Login to create posts and join the conversation.";

    }

}


updateAuthenticationUI();

updateUserInfo();


// ========================================
// LOGOUT
// ========================================

function logoutUser() {

    const confirmed =
        confirm(
            "Are you sure you want to logout?"
        );


    if (!confirmed) return;


    localStorage.removeItem("token");

    localStorage.removeItem("user");


    window.location.href = "/";

}


// ========================================
// LOAD POSTS
// ========================================

async function loadPosts() {

    if (!postsContainer) return;


    try {

        postsContainer.innerHTML =
            '<p class="loading">Loading posts...</p>';


        const response =
            await fetch(
                `${API_URL}/posts`
            );


        const data =
            await response.json();


        if (
            !response.ok ||
            !data.success
        ) {

            throw new Error(
                data.message ||
                "Failed to load posts"
            );

        }


        if (
            !data.posts ||
            data.posts.length === 0
        ) {

            postsContainer.innerHTML = `

                <div class="empty-state">

                    <div class="empty-icon">
                        📝
                    </div>

                    <h3>
                        No posts yet
                    </h3>

                    <p>
                        Be the first person to share a story!
                    </p>

                </div>

            `;

            return;
        }


        postsContainer.innerHTML = "";


        data.posts.forEach((post) => {

            const postElement =
                document.createElement("article");


            postElement.className =
                "post-card";


            const authorName =
                post.author?.name ||
                "Anonymous";


            const authorId =
                post.author?._id ||
                post.author?.id ||
                "";


            const date =
                post.createdAt
                    ? new Date(
                        post.createdAt
                    ).toLocaleDateString(
                        "en-IN",
                        {
                            day: "numeric",
                            month: "short",
                            year: "numeric"
                        }
                    )
                    : "";


            const isOwner =
                currentUserId &&
                authorId &&
                String(currentUserId) ===
                String(authorId);


            postElement.innerHTML = `

                <div class="post-header">

                    <div>

                        <h3>
                            ${escapeHTML(post.title)}
                        </h3>

                        <p class="post-meta">

                            ✍️ ${escapeHTML(authorName)}

                            ${
                                date
                                    ? ` • 📅 ${date}`
                                    : ""
                            }

                        </p>

                    </div>

                </div>


                <div class="post-content">

                    ${escapeHTML(
                        post.content
                    ).replace(
                        /\n/g,
                        "<br>"
                    )}

                </div>


                ${
                    isOwner
                        ? `

                            <div class="post-actions">

                                <button
                                    class="edit-btn"
                                    onclick="editPost('${post._id}')"
                                >
                                    ✏️ Edit
                                </button>


                                <button
                                    class="delete-btn"
                                    onclick="deletePost('${post._id}')"
                                >
                                    🗑️ Delete
                                </button>

                            </div>

                        `
                        : ""
                }


                <div class="comments-section">

                    <h4>
                        💬 Comments
                    </h4>


                    <div
                        id="comments-${post._id}"
                        class="comments-container"
                    >

                        <p class="loading">
                            Loading comments...
                        </p>

                    </div>


                    ${
                        token
                            ? `

                                <div class="comment-form">

                                    <textarea
                                        id="comment-input-${post._id}"
                                        placeholder="Write a comment..."
                                        rows="2"
                                    ></textarea>


                                    <button
                                        onclick="addComment('${post._id}')"
                                    >
                                        💬 Comment
                                    </button>

                                </div>

                            `
                            : `

                                <p class="login-comment-message">

                                    🔐 Login to leave a comment.

                                </p>

                            `
                    }

                </div>

            `;


            postsContainer.appendChild(
                postElement
            );


            loadComments(post._id);

        });


    } catch (error) {

        console.error(
            "Load posts error:",
            error
        );


        postsContainer.innerHTML = `

            <div class="error-state">

                <div>
                    ⚠️
                </div>

                <h3>
                    Unable to load posts
                </h3>

                <p>
                    ${escapeHTML(error.message)}
                </p>


                <button
                    onclick="loadPosts()"
                >
                    🔄 Try Again
                </button>

            </div>

        `;

    }

}


// ========================================
// LOAD COMMENTS
// ========================================

async function loadComments(postId) {

    const commentsContainer =
        document.getElementById(
            `comments-${postId}`
        );


    if (!commentsContainer) return;


    try {

        const response =
            await fetch(
                `${API_URL}/comments/${postId}`
            );


        const data =
            await response.json();


        if (
            !response.ok ||
            !data.success
        ) {

            throw new Error(
                data.message ||
                "Failed to load comments"
            );

        }


        if (
            !data.comments ||
            data.comments.length === 0
        ) {

            commentsContainer.innerHTML = `

                <p class="no-comments">

                    No comments yet.
                    Be the first to comment! 💭

                </p>

            `;

            return;
        }


        commentsContainer.innerHTML = "";


        data.comments.forEach((comment) => {

            const commentElement =
                document.createElement("div");


            commentElement.className =
                "comment";


            const authorName =
                comment.author?.name ||
                "Anonymous";


            const authorId =
                comment.author?._id ||
                comment.author?.id ||
                "";


            const isOwner =
                currentUserId &&
                authorId &&
                String(currentUserId) ===
                String(authorId);


            const date =
                comment.createdAt
                    ? new Date(
                        comment.createdAt
                    ).toLocaleDateString(
                        "en-IN",
                        {
                            day: "numeric",
                            month: "short",
                            year: "numeric"
                        }
                    )
                    : "";


            commentElement.innerHTML = `

                <div class="comment-header">

                    <strong>
                        👤 ${escapeHTML(authorName)}
                    </strong>


                    <span>
                        ${date}
                    </span>

                </div>


                <p>
                    ${escapeHTML(
                        comment.content
                    )}
                </p>


                ${
                    isOwner
                        ? `

                            <button
                                class="comment-delete-btn"
                                onclick="deleteComment('${comment._id}', '${postId}')"
                            >
                                🗑️ Delete
                            </button>

                        `
                        : ""
                }

            `;


            commentsContainer.appendChild(
                commentElement
            );

        });


    } catch (error) {

        console.error(
            "Load comments error:",
            error
        );


        commentsContainer.innerHTML = `

            <p class="error-text">
                Unable to load comments.
            </p>

        `;

    }

}


// ========================================
// ADD COMMENT
// ========================================

async function addComment(postId) {

    if (!token) {

        alert(
            "Please login to comment."
        );

        return;
    }


    const input =
        document.getElementById(
            `comment-input-${postId}`
        );


    if (!input) return;


    const content =
        input.value.trim();


    if (!content) {

        alert(
            "Please write a comment."
        );

        return;
    }


    try {

        const response =
            await fetch(
                `${API_URL}/comments/${postId}`,
                {
                    method: "POST",

                    headers: {

                        "Content-Type":
                            "application/json",

                        Authorization:
                            `Bearer ${token}`

                    },

                    body: JSON.stringify({
                        content
                    })

                }
            );


        const data =
            await response.json();


        if (
            !response.ok ||
            !data.success
        ) {

            throw new Error(
                data.message ||
                "Failed to add comment"
            );

        }


        input.value = "";


        await loadComments(
            postId
        );


    } catch (error) {

        console.error(
            "Add comment error:",
            error
        );


        alert(
            error.message
        );

    }

}


// ========================================
// DELETE COMMENT
// ========================================

async function deleteComment(
    commentId,
    postId
) {

    if (!token) return;


    const confirmed =
        confirm(
            "Are you sure you want to delete this comment?"
        );


    if (!confirmed) return;


    try {

        const response =
            await fetch(
                `${API_URL}/comments/${commentId}`,
                {
                    method: "DELETE",

                    headers: {

                        Authorization:
                            `Bearer ${token}`

                    }

                }
            );


        const data =
            await response.json();


        if (
            !response.ok ||
            !data.success
        ) {

            throw new Error(
                data.message ||
                "Failed to delete comment"
            );

        }


        await loadComments(
            postId
        );


    } catch (error) {

        console.error(
            "Delete comment error:",
            error
        );


        alert(
            error.message
        );

    }

}


// ========================================
// CREATE POST
// ========================================

if (postForm) {

    postForm.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();


            if (!token) {

                alert(
                    "Please login before creating a post."
                );

                return;
            }


            const title =
                document
                    .getElementById("title")
                    .value
                    .trim();


            const content =
                document
                    .getElementById("content")
                    .value
                    .trim();


            if (!title || !content) {

                alert(
                    "Please enter both title and content."
                );

                return;
            }


            const submitButton =
                postForm.querySelector(
                    "button[type='submit']"
                );


            try {

                submitButton.disabled = true;

                submitButton.textContent =
                    "Publishing...";


                if (postMessage) {

                    postMessage.textContent =
                        "";

                }


                const response =
                    await fetch(
                        `${API_URL}/posts`,
                        {
                            method: "POST",

                            headers: {

                                "Content-Type":
                                    "application/json",

                                Authorization:
                                    `Bearer ${token}`

                            },

                            body: JSON.stringify({

                                title,
                                content

                            })

                        }
                    );


                const data =
                    await response.json();


                if (
                    !response.ok ||
                    !data.success
                ) {

                    throw new Error(
                        data.message ||
                        "Failed to create post"
                    );

                }


                postForm.reset();


                if (postMessage) {

                    postMessage.textContent =
                        "✅ Post published successfully!";

                    postMessage.className =
                        "success-message";

                }


                await loadPosts();


            } catch (error) {

                console.error(
                    "Create post error:",
                    error
                );


                if (postMessage) {

                    postMessage.textContent =
                        `❌ ${error.message}`;

                    postMessage.className =
                        "error-message";

                } else {

                    alert(
                        error.message
                    );

                }


            } finally {

                submitButton.disabled =
                    false;

                submitButton.textContent =
                    "Publish Post";

            }

        }
    );

}


// ========================================
// EDIT POST
// ========================================

async function editPost(postId) {

    if (!token) {

        alert(
            "Please login first."
        );

        return;
    }


    try {

        const response =
            await fetch(
                `${API_URL}/posts/${postId}`
            );


        const data =
            await response.json();


        if (
            !response.ok ||
            !data.success
        ) {

            throw new Error(
                data.message ||
                "Failed to load post"
            );

        }


        const post =
            data.post;


        const newTitle =
            prompt(
                "Edit post title:",
                post.title
            );


        if (newTitle === null) return;


        const newContent =
            prompt(
                "Edit post content:",
                post.content
            );


        if (newContent === null) return;


        if (
            !newTitle.trim() ||
            !newContent.trim()
        ) {

            alert(
                "Title and content cannot be empty."
            );

            return;
        }


        const updateResponse =
            await fetch(
                `${API_URL}/posts/${postId}`,
                {
                    method: "PUT",

                    headers: {

                        "Content-Type":
                            "application/json",

                        Authorization:
                            `Bearer ${token}`

                    },

                    body: JSON.stringify({

                        title:
                            newTitle.trim(),

                        content:
                            newContent.trim()

                    })

                }
            );


        const updateData =
            await updateResponse.json();


        if (
            !updateResponse.ok ||
            !updateData.success
        ) {

            throw new Error(
                updateData.message ||
                "Failed to update post"
            );

        }


        await loadPosts();


    } catch (error) {

        console.error(
            "Edit post error:",
            error
        );


        alert(
            error.message
        );

    }

}


// ========================================
// DELETE POST
// ========================================

async function deletePost(postId) {

    if (!token) {

        alert(
            "Please login first."
        );

        return;
    }


    const confirmed =
        confirm(
            "Are you sure you want to delete this post?"
        );


    if (!confirmed) return;


    try {

        const response =
            await fetch(
                `${API_URL}/posts/${postId}`,
                {
                    method: "DELETE",

                    headers: {

                        Authorization:
                            `Bearer ${token}`

                    }

                }
            );


        const data =
            await response.json();


        if (
            !response.ok ||
            !data.success
        ) {

            throw new Error(
                data.message ||
                "Failed to delete post"
            );

        }


        await loadPosts();


    } catch (error) {

        console.error(
            "Delete post error:",
            error
        );


        alert(
            error.message
        );

    }

}


// ========================================
// HTML ESCAPE
// ========================================

function escapeHTML(value) {

    if (
        value === null ||
        value === undefined
    ) {

        return "";

    }


    return String(value)

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );

}


// ========================================
// GLOBAL FUNCTIONS
// ========================================

window.loadPosts =
    loadPosts;

window.loadComments =
    loadComments;

window.addComment =
    addComment;

window.deleteComment =
    deleteComment;

window.editPost =
    editPost;

window.deletePost =
    deletePost;


// ========================================
// INITIAL LOAD
// ========================================

loadPosts();