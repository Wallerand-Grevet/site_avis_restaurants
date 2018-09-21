// importation du json en Objet JS
var request = new XMLHttpRequest();
request.open("GET", "restaurants.json", false);
request.send(null)
var objetJSON = JSON.parse(request.responseText); 

var addRestaurants = document.getElementById("addRestaurants");
var restaurants = document.getElementById("restaurants");
var filtre = document.getElementById("filtre");
var ajoutCommentaire = document.getElementById("ajoutCommentaire");
var streetView = document.getElementById("streetView");


/**
 * fonction servant a calculer la moyenne des avis 
 * @param noteTab Tableau contennant les notes des avis
 */
function calculMoyenne(tableauNote){
    var additionNote = 0
    for (let i = 0; i < tableauNote.length; i++) {
        additionNote = additionNote + tableauNote[i]
        var moyenne = additionNote / tableauNote.length;
    };
    return moyenne
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



var markerTab = []


/**
 * Creation fonction qui genère les restaurants du JSOn
 * @param  json tableau representant le fichier json (objetJSON)
 */
function restaurantsJson(json) {
    iconeResto = 'img/icone-resto-json.png'
    

    for (var i = 0; i < json.length; i++) {
        var latitudeResto = json[i].lat;
        var longitudeResto = json[i].long;
        
        positionRestaurant = {lat : latitudeResto, lng: longitudeResto}
        // creation des marqueurs de la position des restaurants.
        marker = new google.maps.Marker({
            position: positionRestaurant,
            map: map,
            icon:iconeResto,
            title: json[i].restaurantName
        });
        
        //  ajout du marker dans le tableau markerTab
        markerTab.push(marker)

        //Ajout d'un evenement lors du click sur les markers 
        marker.addListener('click',function () {
            streetView.innerHTML = "";
            ajoutCommentaire.innerHTML = ""
            var noteTab = []
            for (let i = 0; i < objetJSON.length; i++) {
                if ((this.getPosition().lat() === objetJSON[i].lat) && (this.getPosition().lng() === objetJSON[i].long)) {
                    for (var j = 0; j < objetJSON[i].ratings.length; j++){
                        var note = objetJSON[i].ratings[j].stars;
                        noteTab.push(note)
                    };
                    moyenne = calculMoyenne(noteTab)
                    nomResto = objetJSON[i].restaurantName
                    affichageAvis(moyenne,nomResto,ajoutCommentaire)
                    

                    // Creation div commentaire avec titre h3
                    var divCommentaire = document.createElement("div");
                    var commentaire = document.createTextNode("commentaire : ")
                    var h3Commentaire = document.createElement("h3");
                    divCommentaire.appendChild(h3Commentaire);
                    h3Commentaire.appendChild(commentaire);
                    ajoutCommentaire.appendChild(divCommentaire);
                    
                    // Insertion de tous les commentaires du json dans la div commentaire 
                    for (let index = 0; index < objetJSON[i].ratings.length; index++) {
                        var avisRestoClic = document.createTextNode(objetJSON[i].ratings[index].comment)
                        var pCommentaire = document.createElement("p");
                        divCommentaire.appendChild(pCommentaire);
                        pCommentaire.appendChild(avisRestoClic);

                    
                    }
                    // insertion image google street 
                    imgStreet = document.createElement("img")
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


var map;

/**
 * Initialisation de la map google avec les marqueurs des restaurants et gestion des mouvement effectué sur la map.
 */
function initMap() {
    var filtreEtoile = document.querySelectorAll("select");
    var paris = {lat : 48.866667, lng: 2.333333}
    // creation de la map avec comme centre Paris
    map = new google.maps.Map(document.getElementById('map'), {
        center: paris,
        zoom: 9
    });
    // importation restaurant du fichier JSON
    restaurantsJson(objetJSON);

    
    

    
    
    // Recuperation des bornes de la carte et ajout des restaurant afficher sur la carte dans la partie gauche a chaque action sur la map 
    map.addListener('bounds_changed', function () {
        // recuperation des listes deroulante pour filtrer les restaurant selon etoile
        
        addRestaurants.style.display='block';
        filtre.style.visibility= 'visible';
        //a chaque mvt de la map on met le filtre min a 1 etoile et le filtre max a 5 étoiles
        filtreEtoile[0].selectedIndex=0;
        filtreEtoile[1].selectedIndex=4;
        //a chaque mvt de la map on vide la parti droite du site pour mise a jour en temps reel
        restaurants.innerHTML = '';
        // creation tableau recupérant les moyenne des notes des restos
        var moyenneNoteResto = []
        // creation tableau recupérant les noms des restos
        var nomRestoTab = []
        // creation tableau recupérant les markers des restos visible sur la map
        var markerVisible = []
        // creation des bornes de la map
        var bornes = map.getBounds();
        var sudLat = bornes.getSouthWest().lat();
        var sudLng = bornes.getSouthWest().lng();
        var nordLat = bornes.getNorthEast().lat();
        var nordLng = bornes.getNorthEast().lng();
        // On parcours le tableau des markers pour parcourir les restaurants du json
        for (var i = 0; i < markerTab.length; i++) {
            
        
            //on delimite la carte visible grace aux bornes de la map
            if (sudLat < markerTab[i].position.lat() && nordLat > markerTab[i].position.lat() && sudLng < markerTab[i].position.lng() && nordLng > markerTab[i].position.lng() ) {
                // Ajout des marker visible sur la carte dans le tableau markerVisible.
                markerVisible.push(markerTab[i]);
                //On rend visible tous les marqueurs sur la maps lors d'un mouvement effectuer sur cette map
                for (let j = 0; j < markerVisible.length; j++) {
                    markerVisible[j].setVisible(true)
                }
                //creation tableau de note
                var noteTab = []
                
                var nomResto = objetJSON[i].restaurantName
                //ajout des noms des restaurants dans le tableau
                nomRestoTab.push(nomResto)
                // on recupere les notes du restaurant.
                for (var j = 0; j < objetJSON[i].ratings.length; j++){
                    var note = objetJSON[i].ratings[j].stars;
                    noteTab.push(note)
                };
                // calcul de la moyenne du restaurant
                var moyenne = calculMoyenne(noteTab)
                // affichage des avis et nom resto sur la partie droite
                affichageAvis(moyenne, nomResto,restaurants)
                //ajout de la moyenne dans le tableau moyenne
                moyenneNoteResto.push(moyenne)
                
                // gestion du filtre min grace a la liste déroulante.
                filtreEtoile[0].onchange= function(){
                    // On rend invisible tout les markers pour pouvoir mettre a jour en temps réel les marker filtré
                    for (let j = 0; j < markerVisible.length; j++) {
                        markerVisible[j].setVisible(false)
                    }
                    //on récupere le nombre d'etoile du filtre max 
                    valeurEtoileMax = parseInt(filtreEtoile[1].options[filtreEtoile[1].selectedIndex].value);
                    //a chaque chgt du filtre min on vide la parti droite du site pour mise a jour en temps reel
                    restaurants.innerHTML='';
                    // parcours le tableau des moyennes des notes des restos
                    for(i = 0; i < moyenneNoteResto.length; i++){
                        //creation des conditions d'affichage des avis selon le filtre
                        if ((moyenneNoteResto[i] >= parseInt(this.value)) && (moyenneNoteResto[i] <= valeurEtoileMax) ) {
                            affichageAvis(moyenneNoteResto[i],nomRestoTab[i],restaurants);
                            var nomRestaurant = nomRestoTab[i];
                            // parcours du tableau des markers visibles
                            for (let index = 0; index < markerVisible.length; index++) {
                                // on rend visible les marqueurs en comparant le titre du marqueur present dans le tableau au nom des restaurants
                                if (markerVisible[index].title === nomRestaurant) {
                                    markerVisible[index].setVisible(true);
                                }
                                
                            }
                        }
                    }
                }
                // gestion du filtre max grace a la liste déroulante.
                filtreEtoile[1].onchange= function(){
                    // On rend invisible tout les markers pour pouvoir mettre a jour en temps réel les marker filtré
                    for (let j = 0; j < markerVisible.length; j++) {
                        markerVisible[j].setVisible(false)
                    }
                    //on récupere le nombre d'etoile du filtre min
                    valeurEtoileMin = parseInt(filtreEtoile[0].options[filtreEtoile[0].selectedIndex].value);
                    //a chaque chgt du filtre max on vide la parti droite du site pour mise a jour en temps reel
                    restaurants.innerHTML='';
                    // parcours le tableau des moyennes des notes des restos
                    for(i = 0; i < moyenneNoteResto.length; i++){
                        //creation des conditions d'affichage des avis selon le filtre
                        if ((moyenneNoteResto[i] <= parseInt(this.value)) && (moyenneNoteResto[i] >= valeurEtoileMin) ) {
                            affichageAvis(moyenneNoteResto[i],nomRestoTab[i],restaurants);
                            var nomRestaurant = nomRestoTab[i];
                           // parcours du tableau des markers visibles
                            for (let index = 0; index < markerVisible.length; index++) {
                                // on rend visible les marqueurs en comparant le titre du marqueur present dans le tableau au nom des restaurants
                                if (markerVisible[index].title === nomRestaurant) {
                                    markerVisible[index].setVisible(true);
                                }
                            }
                        }
                    }
                }
            }
        }
        
    })
    
    // API de géolocalisation de javascript 
    navigator.geolocation.getCurrentPosition(success)
}



// fonction en cas d'acceptation de la localisation
function success(pos){
    // Icone en forme de maison pour la position actuelle
    var home = "img/home.svg";
    // on recupère la latitude de la position de l'utilisateur
    var latitude = pos.coords.latitude;
    // on recupère la latitude de la position de l'utilisateur
    var longitude = pos.coords.longitude;
    //on defini la postion de l'utilisateur
    positionActuelle = {lat : latitude, lng: longitude}
    
    // creation du marqueur de la position actuelle de l'utilisateur
    markerPositionActuelle = new google.maps.Marker({
        position: positionActuelle,
        map: map,
        icon: home
    });
    // On centre la map sur le marqueur de la position actuelle
    map.setCenter(positionActuelle)
    // on met le zoom de la carte a 9
    map.setZoom(9)

}