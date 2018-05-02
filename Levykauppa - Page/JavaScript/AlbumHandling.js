//Here go the albums
function getAlbums() {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange= function() {
        if(xhr.readyState === 4 && xhr.status === 200){
            var albums = JSON.parse(xhr.responseText);
            for(album of albums) {
                addAlbum(album.name, album.artist_name, album.cover_image, album.tracks);
            }
        }
    }
    
    xhr.open("GET","server.php/levykauppa/albums",true);
    xhr.send();
    /*var cover = "resources/default-album-artwork.png";
    var albumName = "Demo";
    var artist = "Stormic";
    var tracks = [
        {name:"Nyt Masentaa",link:"../albums/Stormic - demo/original/01. Nyt Masentaa.mp3", duration: "04:18"},
        {name:"Ralli",link:"../albums/Stormic - demo/original/02. Ralli.mp3", duration: "03:07"},
        {name:"Survive the Night",link:"../albums/Stormic - demo/original/03. Survive the Night.mp3", duration: "04:22"},
        {name:"Tearless",link:"../albums/Stormic - demo/original/04. Tearless.mp3", duration: "04:06"}
    ];*/
    //addAlbum(albumName,artist,cover,tracks);
}

function getArtist(artistName) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange= function() {
        if(xhr.readyState === 4 && xhr.status === 200){
            var artist = JSON.parse(xhr.responseText);
            var albums = artist.albums;
            clearArtistAlbums();
            for(album of albums) {
                addAlbum(album.name, album.artist_name, album.cover_image, album.tracks, true);
            }
        }
    }
    
    xhr.open("GET","server.php/levykauppa/"+artistName,true);
    xhr.send();
    /*var cover = "resources/default-album-artwork.png";
    var albumName = "Demo";
    var artist = "Stormic";
    var tracks = [
        {name:"Nyt Masentaa",link:"../albums/Stormic - demo/original/01. Nyt Masentaa.mp3", duration: "04:18"},
        {name:"Ralli",link:"../albums/Stormic - demo/original/02. Ralli.mp3", duration: "03:07"},
        {name:"Survive the Night",link:"../albums/Stormic - demo/original/03. Survive the Night.mp3", duration: "04:22"},
        {name:"Tearless",link:"../albums/Stormic - demo/original/04. Tearless.mp3", duration: "04:06"}
    ];*/
    //clearArtistAlbums();
    //addAlbum(albumName,artist,cover,tracks, true);
}

//Adds the album into the page
function addAlbum(albumName, artistName, coverLink, trackArray, toArtistPage){
    if(toArtistPage){
        var albums = document.getElementById("artist");
        var nameString = albumName;
        document.getElementById("artistTitle").innerHTML = artistName;
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
    img.setAttribute("src",coverLink);
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
            var oldAudio = document.getElementById(albumName).parentNode;
            var source = document.getElementById(albumName);
            var newAudio = document.createElement("audio");
            newAudio.setAttribute("controls","");
            source.setAttribute("src",mp3link);
            newAudio.appendChild(source);
            oldAudio.parentNode.replaceChild(newAudio,oldAudio);
            
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
    source.setAttribute("id",albumName);
    audio.appendChild(source);
    
    infoContainer.appendChild(audio);
    
    albumContainer.appendChild(infoContainer);
    albums.appendChild(albumContainer); 
}

function clearArtistAlbums(){
    var parent = document.getElementById("artist");
    var children = parent.childNodes;
    for(child of children){
        if(child.firstChild != null && child.getAttribute("class") == "albumContainer"){
            parent.removeChild(child);
        }
    }
}