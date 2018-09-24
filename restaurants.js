// importation du json en Objet JS
var request = new XMLHttpRequest();
request.open("GET", "restaurants.json", false);
request.send(null)
var objetJSON = JSON.parse(request.responseText); 


var restaurants = document.getElementById("restaurants");
var filtre = document.getElementById("filtre");
var ajoutCommentaire = document.getElementById("ajoutCommentaire");
var streetView = document.getElementById("streetView");
var bouton = document.getElementById("bouton");

function boutonAjoutCom(tableau,nomResto,ajoutCommentaire) {
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
        tableau.note.push(ajoutNote);
        tableau.avis.push(ajoutAvis);
        ajoutCommentaire.innerHTML = "";
        moyenne = tableau.moyenne();
        affichageAvis(moyenne,nomResto,ajoutCommentaire);
        commentaireDiv(tableau);
    })
}
/**
 * Affiche les commentaire des restaurants
 */
function commentaireDiv(tableau) {
    // Creation div commentaire avec titre h3
    var divCommentaire = document.createElement("div");
    var commentaire = document.createTextNode("commentaire : ");
    var h3Commentaire = document.createElement("h3");
    divCommentaire.appendChild(h3Commentaire);
    h3Commentaire.appendChild(commentaire);
    ajoutCommentaire.appendChild(divCommentaire);

    // Insertion de tous les commentaires du restaurant dans la div commentaire 
    for (let j = 0; j < tableau.avis.length; j++) {
        var avisRestoClic = document.createTextNode(tableau.avis[j]);
        var pCommentaire = document.createElement("p");
        divCommentaire.appendChild(pCommentaire);
        pCommentaire.appendChild(avisRestoClic);
    }
}
/**
 * Affiche le nombre d'etoile selon la moyenne
 *@param moyenne moyenne des avis du restaurant
 *@param pElt paragraphe ou l'on ajoute les étoiles
 */
function affichageEtoile (moyenne, pElt){
    var apresVirgule = moyenne - (Math.floor(moyenne))
    var resteMoyenne = 5 - (Math.floor(moyenne))
    for (let i = 1; i <= moyenne; i++) {
        var etoilePleine = document.createElement("i");
        etoilePleine.classList = "fas fa-star"
        pElt.appendChild(etoilePleine)
    }
    if (apresVirgule !== 0 ) {
        var etoileDemi = document.createElement("i");
        etoileDemi.classList = "fas fa-star-half-alt";
        pElt.appendChild(etoileDemi);
        resteMoyenne = resteMoyenne - 1
    }
    for (let j = 1; j <= resteMoyenne; j++) {
        var etoileVide = document.createElement("i");
        etoileVide.classList = "far fa-star"
        pElt.appendChild(etoileVide)
    }
}

/**
 * @param moyenne moyenne des notes
 * @param nomDuResto nom du resrestaurant
 * @param id id HTML pour spécifier l'endroit ou aafficher les avis
 */
function affichageAvis(moyenne,nomDuResto,id) {
    
    var divElt = document.createElement("div");
    var h2Elt = document.createElement("h2");
    var pElt = document.createElement("p");
    var nomResto = document.createTextNode(nomDuResto);
    var moyenneResto = document.createTextNode("note : ");
    id.appendChild(divElt);
    divElt.appendChild(h2Elt);
    h2Elt.appendChild(nomResto);
    divElt.appendChild(pElt);
    pElt.appendChild(moyenneResto);
    affichageEtoile(moyenne, pElt)
}

 // creation class restaurant
function Restaurant(nom, adresse, lat, long){
    this.nom = nom;
    this.adresse = adresse;
    this.lat = lat;
    this.long = long;
    this.avis = [];
    this.note = [];
}
// Creation tableau pour stocket chaque objet restaurant
var tabRestaurants = [];


// boucle qui sert a creer chaque instance restaurant + ajout dans le tableau des restaurants
for (let i = 0; i < objetJSON.length; i++) {
    tabNote = [];
    tabCom = [];
    var restaurant = new Restaurant(objetJSON[i].restaurantName,objetJSON[i].address,objetJSON[i].lat, objetJSON[i].long);
    for (let j = 0; j < objetJSON[i].ratings.length; j++) {
        commentaire = objetJSON[i].ratings[j].comment;
        etoile = objetJSON[i].ratings[j].stars;
        tabNote.push(etoile);
        tabCom.push(commentaire);
        restaurant.avis = tabCom;
        restaurant.note = tabNote
    }
    tabRestaurants.push(restaurant)
}
/**
 * methode servant a calculer la moyenne des avis 
 * 
 */
Restaurant.prototype.moyenne = function () {
    var additionNote = 0
    for (let i = 0; i < this.note.length; i++) {
        additionNote = additionNote + this.note[i]
        var moyenne = additionNote / this.note.length;
    };
    return moyenne
};

// craetion tabkleau regroupajnt les marker des restaurants
var markerTab = []
/**
 * Creation fonction qui genère les restaurants du JSOn
 * @param  json tableau representant le fichier json (objetJSON)
 */
function ajoutRestaurantMap() {
    iconeResto = 'img/icone-resto-json.png'

    for (var i = 0; i < tabRestaurants.length; i++) {
        var latitudeResto = tabRestaurants[i].lat;
        var longitudeResto = tabRestaurants[i].long;
        
        positionRestaurant = {lat : latitudeResto, lng: longitudeResto}
        // creation des marqueurs de la position des restaurants.
        marker = new google.maps.Marker({
            position: positionRestaurant,
            map: map,
            icon:iconeResto,
            title: tabRestaurants[i].nom
        });
        
        //  ajout du marker dans le tableau markerTab
        markerTab.push(marker);

        //Ajout d'un evenement lors du click sur les markers 
        marker.addListener('click',function () {
            bouton.innerHTML="";
            streetView.innerHTML = "";
            ajoutCommentaire.innerHTML = "";
            for (let i = 0; i < tabRestaurants.length; i++) {
                if ((this.getPosition().lat() === tabRestaurants[i].lat) && (this.getPosition().lng() === tabRestaurants[i].long)) {
                    var nomResto = tabRestaurants[i].nom;
                    var moyenne = tabRestaurants[i].moyenne();
                    affichageAvis(moyenne,nomResto,ajoutCommentaire);
                    commentaireDiv(tabRestaurants[i])
                    boutonAjoutCom(tabRestaurants[i],nomResto,ajoutCommentaire);
                    

                    


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