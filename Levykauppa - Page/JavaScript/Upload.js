function initUpload() {
    var radioText = document.getElementById("rText");
    var radioSelect = document.getElementById("rSelect");
    radioText.onclick = function() {
        addAlbumNamer();
        radioText.onclick = null;
        radioSelect.onclick = null;
    };
    radioSelect.onclick = function() {
        addAlbumNamer();
        radioText.onclick = null;
        radioSelect.onclick = null;
    };
    
    var names = getArtistNames();
    var select = document.getElementById("selectArtists");
    if(names.length === 0){
        var defOption = document.createElement("option");
        defOption.setAttribute("value", "default");
        defOption.innerHTML = "No artists to choose from";
        select.appendChild(defOption);
    }else{
        var defOption = document.createElement("option");
        defOption.setAttribute("value", "default");
        defOption.innerHTML = "Select an artist";
        select.appendChild(defOption);
        
        for(name of names){
            var option = document.createElement("option");
            option.setAttribute("value", name);
            option.innerHTML = name;
            select.appendChild(option);
        }
    }
}

function getArtistNames(){
    var artistsJSON = [{artistName:"Stormic"},{artistName:"IA"}];
    var names = [];
    for(obj of artistsJSON){
        names.push(obj.artistName);
    }
    return names;
}

function addAlbumNamer() {
    var container = document.createElement("div");
    container.setAttribute("class", "selectContainer");
    var textInput = document.createElement("input");
    textInput.setAttribute("id","albumName");
    textInput.setAttribute("type","text");
    textInput.setAttribute("placeholder","Album Name");
    var button = document.createElement("button");
    button.innerHTML = "Add Track";
    
    var uploadButton = document.createElement("button");
    uploadButton.innerHTML = "Upload Album";
    uploadButton.onclick = function() {validate();};
    
    var tracks = 0;
    button.onclick = function (){
        addTrackUploader();
        if(tracks === 0){
            container.appendChild(uploadButton);
        }
        tracks++;
    };
    
    container.appendChild(textInput);
    container.appendChild(button);
    document.getElementById("uploadContainer").appendChild(container);
}

function addTrackUploader() {
    var container = document.createElement("div");
    container.setAttribute("class","selectContainer");
    container.setAttribute("name", "trackContainer");
    var textInput = document.createElement("input");
    textInput.setAttribute("name","trackName");
    textInput.setAttribute("type","text");
    textInput.setAttribute("placeholder","Track Name");
    var fileInput = document.createElement("input");
    fileInput.setAttribute("name","trackFile");
    fileInput.setAttribute("type","file");
    
    container.appendChild(textInput);
    container.appendChild(fileInput);
    document.getElementById("uploadContainer").appendChild(container);
}



function validate() {
    var artistName = validateArtist();
    if(!artistName) return false;
    var albumName = validateAlbum();
    if(!albumName) return false;
    var tracks = validateTracks();
    if(!tracks) return false;
    var album = {name:albumName,artist:artistName,tracks:tracks};
    console.log(album);
    
}

function validateTracks(){
    var trackElements = document.getElementsByName("trackContainer");
    var tracks = [];
    //track = {name:"name", file:"file"}
    
    for(element of trackElements){
        var trackName = element.childNodes[0].value;
        if(trackName === ""){
            alert("Please enter a name for all tracks");
            return false;
        }
        
        var trackFileList = element.childNodes[1].files;
        if(trackFileList.length !== 1){
            alert("Please submit a file for each track (.mp3)");
            return false;
        }
        
        var trackFile = trackFileList[0];
        if(trackFile.type !== "audio/mp3"){
            alert("Invalid file type (must be .mp3)");
            return false;
        }
        
        tracks.push({name:trackName, file:trackFile});
    }
    
    console.log(tracks);
    return tracks;
}

function validateArtist(){
    var radioText = document.getElementById("rText");
    var radioSelect = document.getElementById("rSelect");
    if(radioSelect.checked){
        var select = document.getElementById("selectArtists");
        if(select.value === "default"){
            alert("Please choose an artist");
            return false;
        }else{
            var artistName = select.value;
        }
    }else if(radioText.checked){
        var text = document.getElementById("textArtists");
        var artistName = text.value;
        artistName = artistName.trim();
        if(artistName === ""){
            alert("Please enter the artist's name");
            return false;
        }else if(!validateString(artistName)){
            alert("Artist's name can only contain letters, numbers, spaces and dashes");
            return false;
        }
    }
    console.log("Artist: " + artistName);
    return artistName;
}

function validateAlbum(){
    var albumName = document.getElementById("albumName").value;
    
    if(albumName === ""){
        alert("Please insert album's name");
        return false;
    }
    
    if(!validateString(albumName)){
        alert("Album's name can only contain letters, numbers, spaces and dashes");
        return false;
    }
    console.log("Album: " + albumName);
    return albumName;
}

function validateString(string){
    return /^[a-zA-Z0-9\ \-]+$/.test(string);
}