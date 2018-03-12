window.onload = function() {
    let userName = document.getElementById("userName");
    let logoutButton = document.getElementById("logout-button");
    let loginButton = document.getElementById("login-button");

    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        userName.textContent = user.displayName ? user.displayName : user.email;
        logoutButton.style.display = "";
      } else {
        userName.textContent = "Log In";
        logoutButton.style.display = "none";
      }
    });

    logoutButton.addEventListener('click', () => {
        firebase.auth().signOut().then(function() {
            console.log("logged out;");
            Cookies.remove('auth');
            window.location.href = "/";
        })
    });

    loginButton.addEventListener('click', () => {
        window.location.href = "/login";
    })

};