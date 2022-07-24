let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });

  //grab toy collection div to manipulate
  const toyCollection = document.getElementById('toy-collection')

  //function to create divCard and append it to the collection
  const CreateCard = (element) => {
    let divCard = document.createElement('div')
    let h2 = document.createElement('h2')
    let img = document.createElement('img')
    let p = document.createElement('p')
    let button = document.createElement('button')

    divCard.className = 'card'

    h2.textContent = element.name

    img.src = element.image
    img.className = 'toy-avatar'

    p.textContent = `${element.likes} Likes`

    //create like button and attach event listener
    button.className = 'like-btn'
    button.id = element.id
    button.textContent = 'Like ❤️'
    button.addEventListener('click', (e) => likeFunc(e))

    divCard.append(h2, img, p, button)

    toyCollection.appendChild(divCard)
  }

  //grabs toy data from server and loads toys onto page
  fetch('http://localhost:3000/toys')
  .then(res => res.json())
  .then(data => {
    data.forEach(element => CreateCard(element));
  })

  //grab the toyForm where the new input information is contained
  const toyForm = document.querySelector('form')

  //on submit we will post to server and add the toys to the DOM
  toyForm.addEventListener('submit', (e) => {
    e.preventDefault()
    PostToServer(e)
  })

  //posting function
  const PostToServer = (e) => {
    let newToyName = e.target.name.value
    let newImg = e.target.image.value

    const fetchObj = {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify({
        "name": newToyName,
        "image": newImg,
        "likes": 0
      })
    }
    
    return fetch('http://localhost:3000/toys',fetchObj)
    .then(res => res.json())
    .then(data => CreateCard(data))
    .catch(error => alert(error))
  }

  //like function
  const likeFunc = (e) => {
    e.preventDefault()

    //grab elements to manipulate
    let targetid = e.target.id
    let targetP = e.target.parentNode.querySelector('p')

    //get the count
    let count = parseInt(targetP.textContent.split(" ")[0])

    //increment count
    count ++

    //create Patch object targetting like count
    const fetchObj = {
      method: 'PATCH',
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify({
        "likes":count
      })
    }

    //interpolate specific object to modify using targetID
    //pass fetchObj as argument
    fetch(`http://localhost:3000/toys/${targetid}`, fetchObj)
    .then(res => res.json())
    .then(data => {
      let newSentence = `${data.likes} likes`
      targetP.textContent = newSentence
    })
  }
});
