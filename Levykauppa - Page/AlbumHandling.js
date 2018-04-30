function getAlbums() {
    var cover = "resources/default-album-artwork.png";
    var albumName = "Demo";
    var tracks = [
        {name:"Nyt Masentaa",link:"../albums/Stormic - demo/original/01. Nyt Masentaa.mp3"},
        {name:"Ralli",link:"../albums/Stormic - demo/original/02. Ralli.mp3"},
        {name:"Survive the Night",link:"../albums/Stormic - demo/original/03. Survive the Night.mp3"},
        {name:"Tearless",link:"../albums/Stormic - demo/original/04. Tearless.mp3"}
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
        }
    }
    
    var optionDef = document.createElement("option");
    optionDef.setAttribute("value","default");
    optionDef.appendChild(document.createTextNode("Select a track"));
    select.appendChild(optionDef);
    
    for(var track of trackArray){
        var option = document.createElement("option");
        option.setAttribute("value",track.name);
        option.setAttribute("id",track.name);
        option.setAttribute("data-link",track.link);
        option.appendChild(document.createTextNode(track.name));
        select.appendChild(option);
    }
    infoContainer.appendChild(select);
    
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