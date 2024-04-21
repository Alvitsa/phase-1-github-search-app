document.addEventListener("DOMContentLoaded", () => {
    const searchForm = document.querySelector('#search-form');
    const searchInput = document.querySelector('#search-input');
    const userList = document.querySelector('#user-list');
    const repoList = document.querySelector('#repo-list');

    // Event listener for form submission
    searchForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const searchTerm = searchInput.value.trim();
        if (searchTerm !== '') {
            try {
                const users = await searchUsers(searchTerm);
                displayUsers(users);
            } catch (error) {
                console.error('Error searching for users:', error);
            }
        }
    });

    // Event listener for clicking on user
    userList.addEventListener('click', async (event) => {
        if (event.target.tagName === 'A') {
            const username = event.target.dataset.username;
            try {
                const repos = await getUserRepos(username);
                displayRepos(repos);
            } catch (error) {
                console.error('Error fetching user repos:', error);
            }
        }
    });
});

// Function to search GitHub users
async function searchUsers(query) {
    const url = `https://api.github.com/search/users?q=${query}`;
    const response = await fetch(url, {
        headers: {
            'Accept': 'application/vnd.github.v3+json'
        }
    });
    if (!response.ok) {
        throw new Error('Failed to fetch users');
    }
    const data = await response.json();
    return data.items;
}

// Function to get user repositories
async function getUserRepos(username) {
    const url = `https://api.github.com/users/${username}/repos`;
    const response = await fetch(url, {
        headers: {
            'Accept': 'application/vnd.github.v3+json'
        }
    });
    if (!response.ok) {
        throw new Error('Failed to fetch user repos');
    }
    const data = await response.json();
    return data;
}

// Function to display search results
function displayUsers(users) {
    const userList = document.querySelector('#user-list');
    userList.innerHTML = '';
    users.forEach(user => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `
            <a href="#" data-username="${user.login}">
                <img src="${user.avatar_url}" alt="${user.login}" width="50" height="50">
                ${user.login}
            </a>
        `;
        userList.appendChild(listItem);
    });
}

// Function to display user repositories
function displayRepos(repos) {
    const repoList = document.querySelector('#repo-list');
    repoList.innerHTML = '';
    repos.forEach(repo => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `<a href="${repo.html_url}" target="_blank">${repo.name}</a>`;
        repoList.appendChild(listItem);
    });
}