const programContainer = document.getElementsByClassName('program-container')[0];

fetch('http://localhost:3000/programdata')
.then(response => {return response.json()})
.then(data => {
    data.forEach(element => {
        //console.log(data);
        var cardDiv = document.createElement('div');
        cardDiv.setAttribute("class", "program-card");
        cardDiv.innerHTML = `
        <img>
        <div class="card-container">
          <h4>${element.programname}</h4>
          <p>1 Month</p>
          <a href='/programs/${element.programname}'><button>Join</button></a>
        </div>`
        programContainer.appendChild(cardDiv); 
    })
})
.catch(err => console.log(err));