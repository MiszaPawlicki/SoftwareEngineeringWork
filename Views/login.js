//login functionality




var accounts = [
    {
        email: "foo",
        password: "bar"
    }
]

function loginUser() {
    var email = document.getElementById("email").value
    var password = document.getElementById("pwd").value


    for (i = 0; i < accounts.length; i++) {
        if (email == accounts[i].email && password == accounts[i].password) {//if username and password in objPeople, redirect to index.html
            console.log("you have logged in")
            window.location.href = "http://localhost:3000/index.html";
        } else {
            console.log("incorrect details")
        } ``
    }
}