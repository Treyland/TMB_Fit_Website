nameDisplay = document.getElementById('displayName');
emailDisplay = document.getElementById('displayEmail');

fetch('http://localhost:3000/protected')
.then(response => {return response.json()})
.then(data => {
    data.forEach(element => {
      nameDisplay.innerHTML = `Name: ${element.name}`;
      emailDisplay.innerHTML = `Email: ${element.email}`;
    //console.log(element.name)
  })
})
.catch(err => console.log(err));

