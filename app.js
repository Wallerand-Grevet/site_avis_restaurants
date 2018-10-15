




var req = new XMLHttpRequest();
req.open("GET", "restaurants.json",false);
req.addEventListener("load", function () {
    if (req.status >= 200 && req.status < 400) {
        objetJSON = JSON.parse(req.responseText);
    } else {
        console.error(req.status + " " + req.statusText + " " + url);
    }
});
req.addEventListener("error", function () {
    console.error("Erreur réseau avec l'URL " + url);
});
req.send(null);


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
                    var street = "https://maps.googleapis.com/maps/api/streetview?size=800x400&location=" + latitude + "," + longitude + "&fov=90&pitch=10&key=AIzaSyCNd35nwOHwihsaBPyuffJGLWgixK3JKy8";

                    imgStreet.src= street;
                    streetView.appendChild(imgStreet);
                }
                
            }
        ajoutAvis.style.visibility = 'visible';
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
    h3Commentaire.style.fontFamily = "'Charmonman', cursive";
    divCommentaire.appendChild(h3Commentaire);
    h3Commentaire.appendChild(commentaire);
    ajoutCommentaire.appendChild(divCommentaire);

    // Insertion de tous les commentaires du restaurant dans la div commentaire 
    for (let j = 0; j < resto.avis.length; j++) {
        var avisRestoClic = document.createTextNode(resto.avis[j]);
        var pCommentaire = document.createElement("p");
        pCommentaire.style.fontFamily = "'Chakra Petch', sans-serif";
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
    divBouton.style.fontFamily="'Charmonman', cursive";
    divBouton.style.fontWeight= 'bold'
    var nomLien = document.createTextNode("ajouter un commentaire");
    divBouton.appendChild(nomLien);
    bouton.appendChild(divBouton);
    // Gestion du clic sur le bouton
    var newCommentaire = document.getElementById("newCommentaire")
    newCommentaire.addEventListener("click", function () {
        var ajoutNote = 0 
        while ((ajoutNote <=0) || (ajoutNote>5) || (isNaN(ajoutNote)=== true)) {
            ajoutNote = parseInt(prompt("quel est votre note entre 1 et 5?"));
        }
        var ajoutAvis = null;
        while ((ajoutAvis === null) || (ajoutAvis === '')) {
            ajoutAvis = prompt("quel est votre commentaire?")
        }
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