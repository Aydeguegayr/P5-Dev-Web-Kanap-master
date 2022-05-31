//je récup le localstorage
function getStorage () {
    let getCart = localStorage.getItem('myArray');
    getCart = JSON.parse(getCart);
    return getCart;
  };
let storageList = getStorage();
//je récup la liste de produit de l'api
async function getProducts () {
    let array = [];  
    await fetch("http://localhost:3000/api/products")
      .then(function(res) {
          if (res.ok) {
              array = res.json();
          }
      })
      .catch(function(err) {
        //erreur
    });
    return array;
};

//je fais corrépondre les produits du localstorage avec ceux de l'api

async function getProductDetails () {
    let productList = [];
    let storage = await getStorage();
    let api = await getProducts();
    for (let product of storage ) {
      let found = api.find(apiProduct => product.id === apiProduct._id);
      let merged = {...product, ...found};
      productList.push(merged);
    }
    return productList;
};

//fonction de calcul des prix+quantité
async function calculTotal() {
  let productList = await getProductDetails();
  let totalQuantity = 0;
  let price = 0;
  let totalPrice = 0;
  
  for (let product of productList) {
    totalQuantity += product.number;
    price = product.price * product.number;
    totalPrice += price;
  }
  document.getElementById("totalQuantity").innerText = totalQuantity;
  document.getElementById("totalPrice").innerText = totalPrice;
};
calculTotal();

//fonctions modif delete
function modifQtt() {
  let qtt = document.querySelectorAll(".itemQuantity");
  for (let i=0; i < qtt.length; i++){
    qtt[i].addEventListener("change", (event) => {
      event.preventDefault();

      storageList[i].number = qtt[i].valueAsNumber;

      localStorage.setItem("myArray", JSON.stringify(storageList));
      calculTotal();
    });
  };
  
};

function deleteProduct(id, color, target) {
  storageList = storageList.filter( elt => !(elt.id == id && elt.colorChoice == color))
  localStorage.setItem('myArray', JSON.stringify(storageList));
  target.closest('section').innerHTML = '';
  alert('Votre article a bien été supprimé.');  
  if (storageList.length === 0) {
    localStorage.clear();
  };
  calculTotal();
};

//je créer mes produits dans la page panier
async function createHtml() {
  storageList = await getProductDetails();

  for (let i=0; i < storageList.length; i++) {

    let productArticle = document.createElement("article");
    document.querySelector("#cart__items").appendChild(productArticle);
    productArticle.className = "cart__item";
    productArticle.setAttribute("data-id", storageList[i].id);

    let productDivImg = document.createElement("div");
    productArticle.appendChild(productDivImg);
    productDivImg.className = "cart__item__img";

    let productImg = document.createElement("img");
    productDivImg.appendChild(productImg);
    productImg.src = storageList[i].imageUrl;
    productImg.alt = storageList[i].altTxt;
    
    let productItemContent = document.createElement("div");
    productArticle.appendChild(productItemContent);
    productItemContent.className = "cart__item__content";

    let productItemContentDescription = document.createElement("div");
    productItemContent.appendChild(productItemContentDescription);
    productItemContentDescription.className = "cart__item__content__description";
    
    let productTitle = document.createElement("h2");
    productItemContentDescription.appendChild(productTitle);
    productTitle.innerHTML = storageList[i].name;

    let productColor = document.createElement("p");
    productTitle.appendChild(productColor);
    productColor.innerHTML = storageList[i].colorChoice;
    productColor.style.fontSize = "20px";

    let productPrice = document.createElement("p");
    productItemContentDescription.appendChild(productPrice);
    productPrice.innerHTML = storageList[i].price + " €";

    let productItemContentSettings = document.createElement("div");
    productItemContent.appendChild(productItemContentSettings);
    productItemContentSettings.className = "cart__item__content__settings";

    let productItemContentSettingsQuantity = document.createElement("div");
    productItemContentSettings.appendChild(productItemContentSettingsQuantity);
    productItemContentSettingsQuantity.className = "cart__item__content__settings__quantity";
    
    let productQty = document.createElement("p");
    productItemContentSettingsQuantity.appendChild(productQty);
    productQty.innerHTML = "Qté : ";

    let productQuantity = document.createElement("input");
    productItemContentSettingsQuantity.appendChild(productQuantity);
    productQuantity.value = storageList[i].number;
    productQuantity.className = "itemQuantity";
    productQuantity.setAttribute("type", "number");
    productQuantity.setAttribute("min", "1");
    productQuantity.setAttribute("max", "100");
    productQuantity.setAttribute("name", "itemQuantity");

    let productItemContentSettingsDelete = document.createElement("div");
    productItemContentSettings.appendChild(productItemContentSettingsDelete);
    productItemContentSettingsDelete.className = "cart__item__content__settings__delete";

    let productSupprimer = document.createElement("p");
    productItemContentSettingsDelete.appendChild(productSupprimer);
    productSupprimer.className = "deleteItem";
    productSupprimer.innerHTML = "Supprimer";
    productSupprimer.addEventListener("click", (e) => {
      e.preventDefault;

      let id = storageList[i].id;
      let color = storageList[i].colorChoice;
      let target = productSupprimer;
      deleteProduct(id, color, target);   
      location.reload();   
    });
    
  }
  modifQtt();
};
createHtml();

//fonction formulaire
/* function checkForm() { */
  
  const order = document.getElementById("order");

  const firstName = document.getElementById("firstName");
  const lastName = document.getElementById("lastName");
  const address = document.getElementById("address");
  const city = document.getElementById("city");
  const email = document.getElementById("email");

  //liste messages d'erreur
  const validError = {
    firstNameErrorMsg: "Veuillez entrer un prénom valide",
    lastNameErrorMsg: "Veuillez entrer un nom valide",
    addressErrorMsg: "Veuillez entrer une adresse valide",
    cityErrorMsg: "Veuillez entrer une ville valide",
    emailErrorMsg: "Veuillez entrer un email valide",
  }

  //regex
  let nameRegex = new RegExp("^[a-zA-Z ,.'-]+$");
  let emailRegex = new RegExp('^[a-zA-Z0-9.-_]+[@]{1}[a-zA-Z0-9.-_]+[.]{1}[a-z]{2,10}$');
  let addressRegex = new RegExp("^[0-9]{1,3}(?:(?:[,. ]){1}[-a-zA-Zàâäéèêëïîôöùûüç]+)+");

  
  order.addEventListener("click", (e) => {
    e.preventDefault();
    const form = document.querySelectorAll(".cart__order__form__question");

    for (i = 0; i < form.length; i++) {
      const formInput = form[i].getElementsByTagName("input").item(0);
      const textInput = formInput.value;

      let formErrorMsgP = form[i].getElementsByTagName("p").item(0);
      const cle = formErrorMsgP.attributes["id"].value;
      const inputType = formInput.attributes['type'].value;
      const inputName = formInput.attributes['name'].value;
      //check formulaire avec regex
      if (inputType == 'text') {
        if (inputName == "address") {
          if(!addressRegex.test(textInput)) {
            const message = validError[cle];
            formErrorMsgP.textContent = message;
          }
        }
        if (!nameRegex.test(textInput)) {
          const message = validError[cle];
          formErrorMsgP.textContent = message;
          /* return; */
        } else {
          formErrorMsgP.textContent = "";
        }
      } else if (inputType == "email" ) {
        if (!emailRegex.test(textInput)) {
          const message = validError[cle];
          formErrorMsgP.textContent = message;
          /* return; */
        } else {
          formErrorMsgP.textContent = "";
        }
      }
    }
    //création de l'object à envoyer dans l'API
    if (nameRegex.test(textInput) && emailRegex.test(textInput) && addressRegex.test(textInput)) {
      if(storageList) {
        const order = {
          contact: {
            firstName: firstName.value,
            lastName: lastName.value,
            address: address.value,
            city: city.value,
            email: email.value,
          },
          products: storageList.map(ele => ele.id),
        };
        postForm(order);
      } else {
        alert("panier vide");
      };
    }
    
    
  })
/* }; */


//envoie du formulaire
function postForm(order) {

    const sendForm = {
      method: 'POST',
      body: JSON.stringify(order),
      headers: {
        'content-type': 'application/json',
      }
    };

    fetch("http://localhost:3000/api/products/order", sendForm)
      .then(res => res.json())
      .then(data => {
        localStorage.setItem('orderId', data.orderId);
        document.location.href = 'confirmation.html?id='+ data.orderId;
      });
};


