var map;
var restoVisible = [];
/**
 * Initialisation de la map google avec les marqueurs des restaurants et gestion des mouvement effectué sur la map.
 */
function initMap() {
    var filtreEtoile = document.querySelectorAll("select");
    
    // creation de la map avec comme centre Paris
    map = new google.maps.Map(document.getElementById('map'), {
        center: paris,
        zoom: 5
    });

    
    
    
    // importation restaurant du fichier JSON
    ajoutRestaurantMap();

    // Ajout des marqueurs lors du clic sur la map
    map.addListener('click',function (e) {
        iconeRestoAdd = 'img/icone-resto-add.png'
        filtreEtoile[0].selectedIndex=0;
        filtreEtoile[1].selectedIndex=4;
        var nomNewResto = null;
        while ((nomNewResto === null) || (nomNewResto === '')) {
            nomNewResto = prompt("quel est le nom de votre restaurant?");
        }
        var adresse = null
        while ((adresse === null) || (adresse === '')) {
            adresse  = prompt("quel est l'adresse du restaurant?")
        }

        var note = 0 
        while ((note <=0) || (note>5) || (isNaN(note)=== true)) {
            note = parseInt(prompt("quel est votre note entre 1 et 5?"));
        }
        
        var commentaire = null
        while ((commentaire === null) || (commentaire === '')) {
             commentaire = prompt("laissez un avis :")
        }
        
        
        var marker = new google.maps.Marker({
            position: e.latLng,
            map: map,
            title : nomNewResto,
            icon: iconeRestoAdd
        });
        
        markerTabJson.push(marker)
        restaurant = new Restaurant (nomNewResto,adresse, marker.position.lat(), marker.position.lng())
        restaurant.avis.push(commentaire);
        restaurant.note.push(note);
        tabRestaurantsJson.push(restaurant);
        restoVisible.push(restaurant)
        restaurant.affichageAvis(restaurants);

        
        //Ajout d'un evenement lors du click sur les markers 
        marker.addListener('click',function () {
            console.log(tabRestaurantsJson)
            bouton.innerHTML = "";
            streetView.innerHTML = "";
            ajoutCommentaire.innerHTML = "";
            for (let i = 0; i < tabRestaurantsJson.length; i++) {
                if ((this.getPosition().lat() === tabRestaurantsJson[i].lat) && (this.getPosition().lng() === tabRestaurantsJson[i].long)) {
                    var resto = tabRestaurantsJson[i];
                    resto.affichageAvis(ajoutCommentaire);
                    commentaireDiv(resto);
                    boutonAjoutCom(resto,ajoutCommentaire);
                    // insertion image google street 
                    imgStreet = document.createElement("img");
                    latitude = this.getPosition().lat();
                    longitude = this.getPosition().lng();
                    var street = "https://maps.googleapis.com/maps/api/streetview?size=800x500&location=" + latitude + "," + longitude + "&fov=90&pitch=10&key=AIzaSyCNd35nwOHwihsaBPyuffJGLWgixK3JKy8";

                    imgStreet.src= street;
                    streetView.appendChild(imgStreet);
                }
                
            }
            ajoutAvis.style.visibility = 'visible';
        })
        
        
    })

    
    
    // Recuperation des bornes de la carte et ajout des restaurant afficher sur la carte dans la partie gauche a chaque action sur la map 
    map.addListener('bounds_changed', function () {
        //on fusionne les tableau des restaurants.
        tabRestaurants = tabRestaurantsJson.concat(tabRestaurantsPlaces);
        //on fusionne les tableau des marqueurs
        markerTab = markerTabJson.concat(markerTabPlaces);
        //a chaque mvt de la map on met le filtre min a 1 etoile et le filtre max a 5 étoiles
        filtreEtoile[0].selectedIndex=0;
        filtreEtoile[1].selectedIndex=4;
        //a chaque mvt de la map on vide la parti droite du site pour mise a jour en temps reel
        restaurants.innerHTML = '';
        // creation tableaux recupérant les markers et les restos visible sur la map
        var markerVisible = [];
        restoVisible = []
        // creation des bornes de la map
        var bornes = map.getBounds();
        var sudLat = bornes.getSouthWest().lat();
        var sudLng = bornes.getSouthWest().lng();
        var nordLat = bornes.getNorthEast().lat();
        var nordLng = bornes.getNorthEast().lng();
        // On parcours le tableau des markers pour parcourir les restaurants 
        for (var i = 0; i < tabRestaurants.length; i++) {
            //on delimite la carte visible grace aux bornes de la map
            if (sudLat < tabRestaurants[i].lat && nordLat > tabRestaurants[i].lat && sudLng < tabRestaurants[i].long && nordLng > tabRestaurants[i].long) {
                // Ajout des marker visible sur la carte dans le tableau markerVisible.
                markerVisible.push(markerTab[i]);
                restoVisible.push(tabRestaurants[i]);
                //On rend visible tous les marqueurs sur la maps lors d'un mouvement effectuer sur cette map
                for (let j = 0; j < markerVisible.length; j++) {
                    markerVisible[j].setVisible(true)
                }
                var nomResto = tabRestaurants[i]
        
            
                // affichage des avis et nom resto sur la partie droite
                nomResto.affichageAvis(restaurants)

                
            }
            
        }
        
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
            for(i = 0; i < restoVisible.length; i++){
                //creation des conditions d'affichage des avis selon le filtre
                if ((restoVisible[i].moyenne() >= parseInt(this.value)) && (restoVisible[i].moyenne() <= valeurEtoileMax) ) {
                    var resto = restoVisible[i]
                    
                    resto.affichageAvis(restaurants)
    
                    // parcours du tableau des markers visibles
                    for (let index = 0; index < markerVisible.length; index++) {
                        // on rend visible les marqueurs en comparant le titre du marqueur present dans le tableau au nom des restaurants
                        if (markerVisible[index].title === resto.nom) {
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
            for(i = 0; i < restoVisible.length; i++){
                //creation des conditions d'affichage des avis selon le filtre
                if ((restoVisible[i].moyenne() <= parseInt(this.value)) && (restoVisible[i].moyenne() >= valeurEtoileMin) ) {
                    var resto = restoVisible[i]
                    resto.affichageAvis(restaurants)
        
                   // parcours du tableau des markers visibles
                    for (let index = 0; index < markerVisible.length; index++) {
                        // on rend visible les marqueurs en comparant le titre du marqueur present dans le tableau au nom des restaurants
                        if (markerVisible[index].title === resto.nom) {
                            markerVisible[index].setVisible(true);
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
    map.setZoom(6)

}