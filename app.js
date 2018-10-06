




// importation du json en Objet JS
var request = new XMLHttpRequest();
request.open("GET", "restaurants.json", false);
request.send(null)
var objetJSON = JSON.parse(request.responseText); 

// importation google places ajout restaurant
/*
var apiPlace = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=48.866667,2.333333&radius=5000&type=restaurant&key=AIzaSyCNd35nwOHwihsaBPyuffJGLWgixK3JKy8"
var googlePlaces = new XMLHttpRequest();
googlePlaces.open("GET", apiPlace, false);
googlePlaces.setRequestHeader("Access-Control-Allow-Origin", "*");
googlePlaces.setRequestHeader("Access-Control-Allow-Methods", "GET");
googlePlaces.setRequestHeader("Access-Control-Allow-Headers", "X-Custom-Header");
googlePlaces.send();
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
*/
var paris = {lat : 48.866667, lng: 2.333333}
var restaurants = document.getElementById("restaurants");
var filtre = document.getElementById("filtre");
var ajoutCommentaire = document.getElementById("ajoutCommentaire");
var streetView = document.getElementById("streetView");
var bouton = document.getElementById("bouton");

// creation tableau regroupant les markers des restaurants
var markerTabJson = [];
var markerTabPlaces = [];

// Creation tableau pour stocker chaque objet restaurant
var tabRestaurantsPlaces = [];
var tabRestaurantsJson = [];

/**
 * Fonction qui sert a ajouter les marqueurs sur la map selon le tableau comprenant les instance de Restaurant
 * @param  tableauRestaurant 
 */
function creerMarqueur(tableauRestaurant, tableauMarqueur) {
    for (var i = 0; i < tableauRestaurant.length; i++) {
        
        var latitudeResto = tableauRestaurant[i].lat;
        var longitudeResto = tableauRestaurant[i].long;
        
        positionRestaurant = {lat : latitudeResto, lng: longitudeResto}
        // creation des marqueurs de la position des restaurants.
        marker = new google.maps.Marker({
            position: positionRestaurant,
            map: map,
            icon:iconeResto,
            title: tableauRestaurant[i].nom
        });
        
        //  ajout du marker dans le tableau markerTab
        tableauMarqueur.push(marker);

        //Ajout d'un evenement lors du click sur les markers 
        marker.addListener('click',function () {
            bouton.innerHTML="";
            streetView.innerHTML = "";
            ajoutCommentaire.innerHTML = "";
            for (let i = 0; i < tableauRestaurant.length; i++) {
                if ((tableauMarqueur[i].title === tableauRestaurant[i].nom) && ((this.getPosition().lat() === tableauRestaurant[i].lat) || (this.getPosition().lng() === tableauRestaurant[i].long))) {
                    var resto = tableauRestaurant[i]
                    resto.affichageAvis(ajoutCommentaire)
                    commentaireDiv(resto)
                    boutonAjoutCom(resto,ajoutCommentaire);
                    
                    // insertion image google street 
                    imgStreet = document.createElement("img");
                    latitude = this.getPosition().lat();
                    longitude = this.getPosition().lng();
                    var street = "https://maps.googleapis.com/maps/api/streetview?size=1600x500&location=" + latitude + "," + longitude + "&fov=90&pitch=10&key=AIzaSyCNd35nwOHwihsaBPyuffJGLWgixK3JKy8";

                    imgStreet.src= street;
                    streetView.appendChild(imgStreet);
                }
                
            }
           
        })
        
        
    }
}

/**
 * Affiche les commentaires des restaurants
 */
function commentaireDiv(resto) {
    // Creation div commentaire avec titre h3
    var divCommentaire = document.createElement("div");
    var commentaire = document.createTextNode("avis : ");
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

        // On efface la liste de restaurant visible a droite puis on les rajoute pour actualiser la note
        restaurants.innerHTML = '';
        for (let i = 0; i < restoVisible.length; i++) {
            restoVisible[i].affichageAvis(restaurants)
        }
        
    })
}