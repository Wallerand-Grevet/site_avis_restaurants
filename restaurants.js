
 // creation class restaurant
function Restaurant(nom, adresse, lat, long){
    this.nom = nom;
    this.adresse = adresse;
    this.lat = lat;
    this.long = long;
    this.avis = [];
    this.note = [];
}





// methode servant a calculer la moyenne des avis 

Restaurant.prototype.moyenne = function () {
    var additionNote = 0
    for (let i = 0; i < this.note.length; i++) {
        additionNote = additionNote + this.note[i]
        var moyenne = additionNote / this.note.length;
    };
    return moyenne
};

// // methode servant a afficher les etoiles selon la moyenne

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

// // methode servant a afficher les avis
Restaurant.prototype.affichageAvis= function (id) {
    var divElt = document.createElement("div");
    var h2Elt = document.createElement("h2");
    h2Elt.style.fontFamily = "'Anton', sans-serif";
    var pElt = document.createElement("p");
    pElt.style.fontFamily ="'Charmonman', cursive";
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

/**
 * Creation fonction qui genère les restaurants sur la map
 * 
 */
function ajoutRestaurantMap() {
    iconeResto = 'img/icone-resto-json.png';
    // recuperation du centre de la map
    var centreLat = map.getCenter().lat();
    var centreLng = map.getCenter().lng();
    var centre = {lat : centreLat, lng: centreLng};
    // appel au service google places
    service = new google.maps.places.PlacesService(map);
    var requete = {
        location: centre,
        radius: '5000',
        type: ['restaurant']
    };

    /**
     * 
     * @param result resultat que renvoie google places
     * @param status si google places est accessible
     */

    function rappelAvis (result,status){
        
        if (status == google.maps.places.PlacesServiceStatus.OK) {
             // creation d'une boucle pour ajouter les avis des restaurants de google places dans un tableau
            for (let i = 0; i < tabRestaurantsPlaces.length; i++) {
                if (result.name === tabRestaurantsPlaces[i].nom) {
                    tabComPlaces = []
                    for (let j = 0; j < result.reviews.length; j++) {
                        tabComPlaces.push(result.reviews[j].text);
                        tabRestaurantsPlaces[i].avis = tabComPlaces;
                    }
                
                }
            }
        }else{
            alert("L'application n'a pas plus charger tous les avis veuillez recharger la page")
        }
    }
    /**
     * 
     * @param results resultat que renvoie google places
     * @param status si google places est accessible
     */
    function rappel(results, status) {
        if (status == google.maps.places.PlacesServiceStatus.OK) {
            // creation d'une boucle pour ajouter les notes des restaurants de google places dans un tableau
            for (let i = 0; i < results.length; i++) {
                var restaurant = new Restaurant(results[i].name,results[i].vicinity,results[i].geometry.location.lat(), results[i].geometry.location.lng());
                restaurant.placeId = results[i].place_id;
                restaurant.note = [];
                restaurant.note.push(results[i].rating);
                tabRestaurantsPlaces.push(restaurant);
            }
            // creation d'une boucle pour ajouter les avis des restaurants de google places avec un "settimeout" pour ne pas avoir d'echec lors de la requete 
            for (let index = 0; index < tabRestaurantsPlaces.length; index++) {
                (function (index) {
                    setTimeout(function () {
                        var request = {
                            placeId: tabRestaurantsPlaces[index].placeId,
                            fields: ['name','review']
                        };
                        // on cherche les details des restaurants sur google places
                        service.getDetails(request, rappelAvis)
                    }, 500*index);
                  })(index);

                
        
            }
            creerMarqueur(tabRestaurantsPlaces, markerTabPlaces)
        }else{
            alert("L'application n'a pas plus charger tous les avis veuillez recharger la page");
        }
    }
    // on cherche les restaurants sur google place 
    service.nearbySearch(requete,rappel)
    creerMarqueur(tabRestaurantsJson,markerTabJson)
}