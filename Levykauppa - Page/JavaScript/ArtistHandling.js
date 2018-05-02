function getArtists(){
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange= function() {
        if(xhr.readyState === 4 && xhr.status === 200){
            console.log(xhr.responseText);
            var artists = JSON.parse(xhr.responseText);
            for(artist of artists) {
                addArtist(artist.name, artist.logo, artist.homepage);
            }
        }
    }
    
    xhr.open("GET","server.php/levykauppa/artists",true);
    xhr.send();
    /*var cover = "resources/default-album-artwork.png";
    var link = "https://fi-fi.facebook.com/stormicband/";
    addArtist("Stormic", cover, link)*/
    
}

function addArtist(artistName, coverLink, artistPageLink){
    var artists = document.getElementById("artists");
    var artistContainer = document.createElement("div");
    artistContainer.setAttribute("class", "innerContainer");
    
    var img = document.createElement("img");
    img.setAttribute("width","100");
    img.setAttribute("height","100");
    img.setAttribute("class","cover");
    img.setAttribute("src", coverLink);
    artistContainer.appendChild(img);
    
    var infoContainer = document.createElement("div");
    infoContainer.setAttribute("class","infoContainer");
    
    var name = document.createElement("p");
    name.setAttribute("class","containerName");
    name.innerHTML = artistName;
    infoContainer.appendChild(name);
    
    var pp = document.createElement("p");
    var pa = document.createElement("a");
    pa.setAttribute("href",artistPageLink);
    pa.setAttribute("class","artistPageLink");
    pa.innerHTML = "Artist's Page";
    pp.appendChild(pa);
    infoContainer.appendChild(pp);
    
    var ap = document.createElement("p");
    var aa = document.createElement("a");
    aa.setAttribute("href", "#");
    aa.setAttribute("class", "artistAlbumLink");
    aa.innerHTML = "Albums";
    aa.onclick = function () {
        getArtist();
        changePage("artist");
    }
    ap.appendChild(aa);
    infoContainer.appendChild(ap);
    
    artistContainer.appendChild(infoContainer);
    artists.appendChild(artistContainer);
}