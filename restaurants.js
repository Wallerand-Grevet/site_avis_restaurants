
 // creation class restaurant
function Restaurant(nom, adresse, lat, long){
    this.nom = nom;
    this.adresse = adresse;
    this.lat = lat;
    this.long = long;
    this.avis = [];
    this.note = [];
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

Restaurant.prototype.affichageEtoiles = function (pElt) {
    var apresVirgule = this.moyenne() - (Math.floor(this.moyenne()))
    var resteMoyenne = 5 - (Math.floor(this.moyenne()))
    for (let i = 1; i <= this.moyenne(); i++) {
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

Restaurant.prototype.affichageAvis= function (id) {
    var divElt = document.createElement("div");
    var h2Elt = document.createElement("h2");
    var pElt = document.createElement("p");
    var nomResto = document.createTextNode(this.nom);
    var moyenneResto = document.createTextNode("note : ");
    id.appendChild(divElt);
    divElt.appendChild(h2Elt);
    h2Elt.appendChild(nomResto);
    divElt.appendChild(pElt);
    pElt.appendChild(moyenneResto);
    this.affichageEtoiles(pElt)
}

// boucle qui sert a creer chaque instance restaurant + ajout dans le tableau des restaurants pour le json local

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
        restaurant.note = tabNote;

    }
    tabRestaurantsJson.push(restaurant)
}

// boucle qui sert a creer chaque instance restaurant + ajout dans le tableau des restaurants pour le google places.
/*for (let i = 0; i < googlePlacesJson.results.length; i++) {
    tabComPlaces = []
    var restaurant = new Restaurant(googlePlacesJson.results[i].name,googlePlacesJson.results[i].vicinity,googlePlacesJson.results[i].geometry.location.lat, googlePlacesJson.results[i].geometry.location.lng);
    restaurant.placeId = googlePlacesJson.results[i].place_id;
    avisPlacesJson = avisPlaces(restaurant.placeId);
    for (let j = 0; j < avisPlacesJson.result.reviews.length; j++) {
        tabComPlaces.push(avisPlacesJson.result.reviews[j].text);
        restaurant.avis = tabComPlaces;
    }
    restaurant.note = [];
    restaurant.note.push(googlePlacesJson.results[i].rating);
    tabRestaurants.push(restaurant)
    }
*/
/**
 * Creation fonction qui genère les restaurants du JSOn
 * @param  json tableau representant le fichier json (objetJSON)
 */
function ajoutRestaurantMap() {
    iconeResto = 'img/icone-resto-json.png';

    service = new google.maps.places.PlacesService(map);
    var requete = {
        location: paris,
        radius: '1500',
        type: ['restaurant']
      };
    function rappel(results, status) {
        if (status == google.maps.places.PlacesServiceStatus.OK) {
            for (let i = 0; i < results.length; i++) {
                tabComPlaces = []
                var restaurant = new Restaurant(results[i].name,results[i].vicinity,results[i].geometry.location.lat(), results[i].geometry.location.lng());
                restaurant.placeId = results[i].place_id;
                restaurant.note = [];
                restaurant.note.push(results[i].rating);
                tabRestaurantsPlaces.push(restaurant)
            }
            creerMarqueur(tabRestaurantsPlaces, markerTabPlaces)
        }
    }
    service.nearbySearch(requete,rappel)


    creerMarqueur(tabRestaurantsJson,markerTabJson)
}