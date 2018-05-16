//Here go the albums
function getAlbums() {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange= function() {
        if(xhr.readyState === 4 && xhr.status === 200){
            var albums = JSON.parse(xhr.responseText);
            if(albums != "No albums found."){
                for(var album of albums) {
                    addAlbum(album.name, album.artist_name, album.cover_image, album.tracks);
                }
            }
            console.log(albums);
        }
    }
    
    xhr.open("GET","/PHP/server.php/levykauppa/albums",true);
    xhr.send();
    /*var cover = "resources/default-album-artwork.png";
    var albumName = "Demo";
    var artist = "Stormic";
    var tracks = [
        {name:"Nyt Masentaa",stripped_mp3:"../resources/albums/Stormic - demo/original/01. Nyt Masentaa.mp3", duration: "04:18"},
        {name:"Ralli",stripped_mp3:"../resources/albums/Stormic - demo/original/02. Ralli.mp3", duration: "03:07"},
        {name:"Survive the Night",stripped_mp3:"../resources/albums/Stormic - demo/original/03. Survive the Night.mp3", duration: "04:22"},
        {name:"Tearless",stripped_mp3:"../resources/albums/Stormic - demo/original/04. Tearless.mp3", duration: "04:06"}
    ];
    addAlbum(albumName,artist,cover,tracks);*/
}

//Request's a single artist by name
function getArtist(artistName) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange= function() {
        if(xhr.readyState === 4 && xhr.status === 200){
            var artist = JSON.parse(xhr.responseText);
            console.log(artist);
            var albums = artist.albums;
            document.getElementById("artistTitle").innerHTML = artist.name;
            clearArtistAlbums();
            for(album of albums) {
                addAlbum(album.name, album.artist_name, album.cover_image, album.tracks, true);
            }
        }
    }
    
    xhr.open("GET","PHP/server.php/levykauppa/"+artistName,true);
    xhr.send();
}

//Adds the album(div) into either the album or the artist's page
function addAlbum(albumName, artistName, coverLink, trackArray, toArtistPage){
    if(toArtistPage){
        var albums = document.getElementById("artist");
        var nameString = albumName;
    }else{
        var albums = document.getElementById("albums");  
        var nameString = artistName + " - " + albumName;
    }
    
    var albumContainer = document.createElement("div");
    albumContainer.setAttribute("class","innerContainer");
    
    
    var img = document.createElement("img");
    img.setAttribute("width","100");
    img.setAttribute("height","100");
    img.setAttribute("class","cover");
    if(coverLink != null){
        img.setAttribute("src",coverLink);
    }else{
        img.setAttribute("src","resources/default-album-artwork.png");
    }
    
    albumContainer.appendChild(img);
    
    var infoContainer = document.createElement("div");
    infoContainer.setAttribute("class","infoContainer");
    
    var p = document.createElement("p");
    p.setAttribute("class","containerName");
    p.appendChild(document.createTextNode(nameString));
    infoContainer.appendChild(p);
    
    var select = document.createElement("select");
    
    select.onchange = function(){
        if(this.value !== "default"){
            var id = this.value;
            var mp3link = document.getElementById(id).getAttribute("data-link");
            var oldAudio = document.getElementById(nameString).parentNode;
            var source = document.getElementById(nameString);
            var newAudio = document.createElement("audio");
            newAudio.setAttribute("controls","");
            source.setAttribute("src",mp3link);
            newAudio.appendChild(source);
            oldAudio.parentNode.replaceChild(newAudio,oldAudio);
            console.log(source.parentNode.parentNode);
            
            var durationElement = document.getElementById(albumName+"duration");
            durationElement.innerHTML = document.getElementById(id).getAttribute("data-duration");
        }
    }
    
    var optionDefault = document.createElement("option");
    optionDefault.setAttribute("value","default");
    optionDefault.appendChild(document.createTextNode("Select a track"));
    select.appendChild(optionDefault);
    for(var track of trackArray){
        var option = document.createElement("option");
        option.setAttribute("value",track.name);
        option.setAttribute("id",track.name);
        option.setAttribute("data-link",track.stripped_mp3);
        option.setAttribute("data-duration",track.duration);
        option.appendChild(document.createTextNode(track.name));
        select.appendChild(option);
    }
    infoContainer.appendChild(select);
    
    var duration = document.createElement("span");
    duration.setAttribute("id",albumName + "duration");
    duration.innerHTML = "00:00";
    infoContainer.appendChild(duration);
    
    var br = document.createElement("br");
    infoContainer.appendChild(br);
    
    var audio = document.createElement("audio");
    audio.setAttribute("controls","");
    
    var source = document.createElement("source");
    source.setAttribute("type","audio/mpeg");
    source.setAttribute("id",nameString);
    audio.appendChild(source);
    
    infoContainer.appendChild(audio);
    
    albumContainer.appendChild(infoContainer);
    albums.appendChild(albumContainer); 
}

//Clears all albums from the artist page
function clearArtistAlbums(){
    var parent = document.getElementById("artist");
    var children = parent.childNodes;
    for(child of children){
        if(child.firstChild != null && child.getAttribute("class") == "innerContainer"){
            parent.removeChild(child);
        }
    }
}

//Clears all albums from the albums pages
function clearAlbumsAlbums(){
    var parent = document.getElementById("albums");
    var children = parent.childNodes;
    for(child of children){
        if(child.firstChild != null && child.getAttribute("class") == "innerContainer"){
            parent.removeChild(child);
        }
    }
}