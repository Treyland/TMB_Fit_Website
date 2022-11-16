
const programName = document.getElementById('program_name');
const descriptionContainer = document.getElementsByClassName('description-container');
const purchase = document.getElementById('purchase');

//Purchase Route
function purchaseProgram () {
  fetch('http://localhost:3000/programdata')
  .then((response) => {return response.json()})
  .then(data => {
    //console.log(data);
    var result = data.find(element => element.programname === programName.textContent);
    let resultId = result.id; 
    let pgmPrice = result.stripe_price_key;
    return fetch('/create-checkout-session', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            items: [ 
                {id: resultId, quantity: 1, price: pgmPrice}
            ]
        })
    })})
      .then(res => {
        if(res.redirected){
            alert('Message: Please Login/Register to Purchase Programs');
        } else {
        if(res.ok) return res.json()
        return res.json().then(json => Promise.reject(json))
    }}).then(({ url }) => {
        window.location = url
    }).catch((error)  => {
        console.error(error)
    })
};

/* function viewProgram () {
   fetch('http://localhost:3000/protectedProgramdata')
  .then((response) => {
    if(response.redirected){
        alert('Message: Please Log in to view program!');
    } else {
    return response.json()}})
  .then(data => {
    //console.log(data);
    var result = data.find(element => element.programname = programName.textContent)
    //console.log(result.link);
    descriptionContainer[0].insertAdjacentHTML('afterend',
    `<div class="program-container">
        <h1>
            Program: Beginner - Learn Movement
        </h1>
        ${result.link}          
    </div>`);
}); 
  }; */
