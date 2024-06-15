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

    // 登録後にログインしてリダイレクト
    localStorage.setItem('currentUser', newUsername);
    window.location.href = "user.html";
}

function login(event) {
    event.preventDefault();
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;

    let users = JSON.parse(localStorage.getItem('users')) || {};
    if (users[username] && users[username] === password) {
        localStorage.setItem('currentUser', username);
        window.location.href = "user.html";  // ユーザーページにリダイレクト
    } else {
        alert("ユーザー名またはパスワードが正しくありません。");
    }
}

function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = "index.html";  // ログインページにリダイレクト
}

function goBack() {
    window.location.href = "index.html";  // ログインページにリダイレクト
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
        alert("グループ名またはパスワードが正しくありません。");
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
    if (window.location.pathname.endsWith("user.html")) {
        if (localStorage.getItem('currentUser')) {
            document.getElementById("userDisplayName").textContent = localStorage.getItem('currentUser');
            updateGroupList();
        } else {
            window.location.href = "index.html";  // ログインしていない場合はログインページにリダイレクト
        }
    }
});
