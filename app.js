function showRegister() {
    document.getElementById("loginForm").classList.add("hidden");
    document.getElementById("registerForm").classList.remove("hidden");
}

function showLogin() {
    document.getElementById("loginForm").classList.remove("hidden");
    document.getElementById("registerForm").classList.add("hidden");
}

function register(event) {
    event.preventDefault();
    let newUsername = document.getElementById("newUsername").value;
    let newPassword = document.getElementById("newPassword").value;
    
    let users = JSON.parse(localStorage.getItem('users')) || {};
    if (users[newUsername]) {
        alert("このユーザー名は既に使用されています。");
        return;
    }

    users[newUsername] = newPassword;
    localStorage.setItem('users', JSON.stringify(users));
    alert("登録が完了しました。");
    showLogin();
}

function login(event) {
    event.preventDefault();
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;

    let users = JSON.parse(localStorage.getItem('users')) || {};
    if (users[username] && users[username] === password) {
        localStorage.setItem('currentUser', username);
        displayUserPage();
    } else {
        alert("ユーザー名またはパスワードが正しくありません。");
    }
}

function logout() {
    localStorage.removeItem('currentUser');
    displayLoginPage();
}

function displayLoginPage() {
    document.getElementById("loginPage").classList.remove("hidden");
    document.getElementById("userPage").classList.add("hidden");
}

function displayUserPage() {
    document.getElementById("loginPage").classList.add("hidden");
    document.getElementById("userPage").classList.remove("hidden");

    let currentUser = localStorage.getItem('currentUser');
    document.getElementById("userDisplayName").textContent = currentUser;

    updateGroupList();
}

function createGroup(event) {
    event.preventDefault();
    let groupName = document.getElementById("groupName").value;
    let groupPassword = document.getElementById("groupPasswordCreate").value;

    let groups = JSON.parse(localStorage.getItem('groups')) || {};
    if (groups[groupName]) {
        alert("このグループ名は既に使用されています。");
        return;
    }

    groups[groupName] = { password: groupPassword, members: [localStorage.getItem('currentUser')] };
    localStorage.setItem('groups', JSON.stringify(groups));
    alert(`グループ ${groupName} が作成されました。`);
    updateGroupList();
}

function joinGroup(event) {
    event.preventDefault();
    let groupName = document.getElementById("groupNameJoin").value;
    let groupPassword = document.getElementById("groupPasswordJoin").value;

    let groups = JSON.parse(localStorage.getItem('groups')) || {};
    if (groups[groupName] && groups[groupName].password === groupPassword) {
        groups[groupName].members.push(localStorage.getItem('currentUser'));
        localStorage.setItem('groups', JSON.stringify(groups));
        alert(`グループ ${groupName} に参加しました。`);
        updateGroupList();
    } else {
        alert("グループ名、またはパスワードが正しくありません。");
    }
}

function updateGroupList() {
    let currentUser = localStorage.getItem('currentUser');
    let groups = JSON.parse(localStorage.getItem('groups')) || {};
    let groupList = document.getElementById("groupList");
    groupList.innerHTML = '';

    Object.keys(groups).forEach(groupName => {
        if (groups[groupName].members.includes(currentUser)) {
            let listItem = document.createElement('li');
            listItem.textContent = `グループ名: ${groupName}`;
            groupList.appendChild(listItem);
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('currentUser')) {
        displayUserPage();
    } else {
        displayLoginPage();
    }
});
