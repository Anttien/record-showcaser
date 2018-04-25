function getAlbums() {
    var cover = "resources/default-album-artwork.png";
    var albumName = "Album Name";
    var tracks = [
        {name:"Rats",link:"resources/bensound-ukulele.mp3"},
        {name:"Cirice",link:"resources/bensound-ukulele.mp3"}
    ]
    addAlbum(albumName,cover,tracks);
}

function addAlbum(albumName, coverLink, trackArray){
    var albums = document.getElementById("albums");
    var albumContainer = document.createElement("div");
    albumContainer.setAttribute("class","albumContainer");
    
    var img = document.createElement("img");
    img.setAttribute("width","100");
    img.setAttribute("height","100");
    img.setAttribute("class","albumCover");
    img.setAttribute("src",coverLink);
    albumContainer.appendChild(img);
    
    var infoContainer = document.createElement("div");
    infoContainer.setAttribute("class","infoContainer");
    
    var p = document.createElement("p");
    p.setAttribute("class","albumName");
    p.appendChild(document.createTextNode(albumName));
    infoContainer.appendChild(p);
    
    var select = document.createElement("select");
    select.onchange = function(){
        console.log(this.value);
    }
    
    for(var track of trackArray){
        var option = document.createElement("option");
        option.setAttribute("value",track.name);
        option.appendChild(document.createTextNode(track.name));
        select.appendChild(option);
    }
    infoContainer.appendChild(select);
    
    var br = document.createElement("br");
    infoContainer.appendChild(br);
    
    var audio = document.createElement("audio");
    audio.setAttribute("controls","");
    var source = document.createElement("source");
    source.setAttribute("id","")
    audio.appendChild(source);
    infoContainer.appendChild(audio);
    albumContainer.appendChild(infoContainer);
    albums.appendChild(albumContainer);
    
}



/*
<div class="albumContainer">
    <img class="cover" src="resources/default-album-artwork.png" width="100" height="100">
    <div class="infoContainer">
        <p class="albumName">Album Name</p>
        <select>
            <option value="default">Select a track</option>
            <option value="track1">Track 1</option>
            <option value="track2">Track 2</option>
            <option value="track3">Track 3</option>
            <option value="track4">Track 4</option>
        </select>
        <br>
        <audio controls>
            <source src="resources/bensound-ukulele.mp3" type="audio/mpeg">
        </audio>
    </div>
</div>
*/