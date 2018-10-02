




// importation du json en Objet JS
var apiPlace = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=48.866667,2.333333&radius=5000&type=restaurant&key=AIzaSyCNd35nwOHwihsaBPyuffJGLWgixK3JKy8"
var request = new XMLHttpRequest();
request.open("GET", "restaurants.json", false);
request.send(null)
var objetJSON = JSON.parse(request.responseText); 

// importation google places ajout restaurant
var googlePlaces = new XMLHttpRequest();
googlePlaces.open("GET", apiPlace, false);
googlePlaces.send(null);
var googlePlacesJson = JSON.parse(googlePlaces.responseText);

//importation google places avis
function avisPlaces(placeId) {
    var apiPlaceAvis = "https://maps.googleapis.com/maps/api/place/details/json?placeid="+ placeId + "&fields=reviews&key=AIzaSyCNd35nwOHwihsaBPyuffJGLWgixK3JKy8"
    var googlePlacesAvis = new XMLHttpRequest();
    googlePlacesAvis.open("GET", apiPlaceAvis, false);
    googlePlacesAvis.send(null);
    var googlePlacesAvisJson = JSON.parse(googlePlacesAvis.responseText);
    return googlePlacesAvisJson;
}


var restaurants = document.getElementById("restaurants");
var filtre = document.getElementById("filtre");
var ajoutCommentaire = document.getElementById("ajoutCommentaire");
var streetView = document.getElementById("streetView");
var bouton = document.getElementById("bouton");

// creation tableau regroupant les markers des restaurants
var markerTab = [];

// Creation tableau pour stocker chaque objet restaurant
var tabRestaurants = [];



/**
 * Affiche les commentaires des restaurants
 */
function commentaireDiv(resto) {
    // Creation div commentaire avec titre h3
    var divCommentaire = document.createElement("div");
    var commentaire = document.createTextNode("commentaire : ");
    var h3Commentaire = document.createElement("h3");
    divCommentaire.appendChild(h3Commentaire);
    h3Commentaire.appendChild(commentaire);
    ajoutCommentaire.appendChild(divCommentaire);

    // Insertion de tous les commentaires du restaurant dans la div commentaire 
    for (let j = 0; j < resto.avis.length; j++) {
        var avisRestoClic = document.createTextNode(resto.avis[j]);
        var pCommentaire = document.createElement("p");
        divCommentaire.appendChild(pCommentaire);
        pCommentaire.appendChild(avisRestoClic);
    }
}


/**
 * fonction qui sert a ajouter le bouton pour ajouter un nouvel avis
 * @param  resto 
 * @param  ajoutCommentaire 
 */
function boutonAjoutCom(resto,ajoutCommentaire) {
    // Creation d'un bouton pour ajouter des commentaires
    var divBouton = document.createElement("div");
    divBouton.id= "newCommentaire";
    var nomLien = document.createTextNode("ajouter un commentaire");
    divBouton.appendChild(nomLien);
    bouton.appendChild(divBouton);
    // Gestion du clic sur le bouton
    var newCommentaire = document.getElementById("newCommentaire")
    newCommentaire.addEventListener("click", function () {
        var ajoutNote = parseInt(prompt("quel est votre note?"))
        var ajoutAvis = prompt("quel est votre commentaire?")
        resto.note.push(ajoutNote);
        resto.avis.push(ajoutAvis);
        ajoutCommentaire.innerHTML = "";
        moyenne = resto.moyenne();
        resto.affichageAvis(ajoutCommentaire)
        commentaireDiv(resto);
    })
}