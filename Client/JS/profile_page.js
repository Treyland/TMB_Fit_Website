let nameDisplay = document.getElementById('displayName');
let emailDisplay = document.getElementById('displayEmail');
let programList = document.getElementById('myList');


Promise.all([
  fetch('http://localhost:3000/protected'),
  fetch('http://localhost:3000/user_programs')
]).then(responses => {
    return Promise.all(responses.map(response => {
    return response.json();
  }))
}).then(data => {
   nameDisplay.innerHTML = `Name: ${data[0][0].name}`;
   emailDisplay.innerHTML = `Email: ${data[0][0].email}`;
   data[1].forEach(element => {
    let li = document.createElement('li');
    li.innerHTML = `${element.programname}`;
    programList.appendChild(li);
   })
   //console.log(data[1]);
}).catch(err =>
  console.log(err));



/* fetch('http://localhost:3000/protected')
.then(response => {return response.json()})
.then(data => {
    data.forEach(element => {
      nameDisplay.innerHTML = `Name: ${element.name}`;
      emailDisplay.innerHTML = `Email: ${element.email}`;
     console.log(element.name)
  })
})
.catch(err => console.log(err)); */

/*
fetch('http://localhost:3000/user_programs')
  .then(response => {return response.json()})
  .then(data => {
    data.forEach(element => {
      let li = document.createElement('li');
      li.innerText = element;
      programList.appendChild;
    })
  })
  .catch(err => console.log(err)); */


