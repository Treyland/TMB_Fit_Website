let objPeople = [
    {
        username: "Trey",
        password: "Tbop15523"
    },
    {},
]

function getInfo() {
    let username = document.getElementById("username").value
    let password = document.getElementById("password").value
    console.log("You're username is " + username + " and your password is " + password)

    for(i = 0; i <objPeople.length; i++) {
        if(username == objPeople[i].username && password == objPeople[i].password) {
            console.log(username + "is logged in!")
            return 
        } else {
            console.log("incorrect username or password")
        }
    }

}