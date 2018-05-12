function initUpload() {
    var radioText = document.getElementById("rText");
    var radioSelect = document.getElementById("rSelect");
    
    radioText.onclick = function() {
        addAlbumNamer(true);
        radioText.onclick = function(){toggleArtistLogoUpload(true)};
        radioSelect.onclick = function(){toggleArtistLogoUpload(false)};
    };
    
    radioSelect.onclick = function() {
        addAlbumNamer(false);
        radioText.onclick = function(){toggleArtistLogoUpload(true)};
        radioSelect.onclick = function(){toggleArtistLogoUpload(false)};
    };
    
    function toggleArtistLogoUpload(show) {
        var artistLogoElement = document.getElementById("artistImageContainer");
        if(show){
            artistLogoElement.classList.remove("invisible");
        }else{
            artistLogoElement.classList.add("invisible");
        }
    }
    
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

function addAlbumNamer(isNewArtist) {
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
    
    var uploadButtonShowing = false;
    button.onclick = function (){
        addTrackUploader();
        if(!uploadButtonShowing){
            container.appendChild(uploadButton);
            uploadButtonShowing = true;
        }
    };
    
    var imageUploadContainer = document.createElement("div");
    imageUploadContainer.setAttribute("class", "selectContainer");
    
    var albumImageContainer = document.createElement("div");
    albumImageContainer.setAttribute("class", "selectContainer");
    var labelAlbum = document.createElement("label");
    labelAlbum.setAttribute("for","albumFile");
    labelAlbum.innerHTML = "Upload album cover";
    labelAlbum.setAttribute("id", "labelAlbum");
    var albumFile = document.createElement("input");
    albumFile.setAttribute("type","file");
    albumFile.setAttribute("id","albumFile");
    
    var artistImageContainer = document.createElement("div");
    artistImageContainer.setAttribute("class", "selectContainer");
    artistImageContainer.setAttribute("id","artistImageContainer");
    var labelArtist = document.createElement("label");
    labelArtist.setAttribute("for","artistFile");
    labelArtist.innerHTML = "Upload artist logo";
    labelArtist.setAttribute("id", "labelArtist");
    var artistFile = document.createElement("input");
    artistFile.setAttribute("type","file");
    artistFile.setAttribute("id","artistFile");
    
    if(!isNewArtist){
        artistImageContainer.classList.add("invisible");
    }
    
    albumImageContainer.appendChild(labelAlbum);
    albumImageContainer.appendChild(document.createElement("br"));
    albumImageContainer.appendChild(albumFile);
    artistImageContainer.appendChild(labelArtist);
    artistImageContainer.appendChild(document.createElement("br"));
    artistImageContainer.appendChild(artistFile);
    
    imageUploadContainer.appendChild(albumImageContainer);
    imageUploadContainer.appendChild(artistImageContainer);
    
    container.appendChild(imageUploadContainer);
    
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
    fileInput.innerHTML = "stuff";
    var deleteButton = document.createElement("button");
    deleteButton.innerHTML = "&#128465";
    deleteButton.onclick = function() {
        var toDelete = this.parentElement;
        toDelete.parentElement.removeChild(toDelete);
    }
    
    container.appendChild(textInput);
    container.appendChild(fileInput);
    container.appendChild(deleteButton);
    document.getElementById("uploadContainer").appendChild(container);
}



function validate() {
    var artistInfo = validateArtist();
    var artistName = artistInfo.name;
    var isNew = artistInfo.isNew;
    if(!artistName) return false;
    var albumName = validateAlbum();
    if(!albumName) return false;
    var tracks = validateTracks();
    if(!tracks) return false;
    var covers = validateCovers(isNew);
    if(!covers) return false;
    var album = {name:albumName,artist:artistName,tracks:tracks,albumCover:covers.albumCover,artistCover:covers.artistCover};
    console.log(album);
    
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange= function() {
        if(xhr.readyState === 4 && xhr.status === 200){
            alert("The new album has been uploaded successfully");
        }else{
            alert("There was an error uploading your album. Error code: " + xhr.state);
        }
    }
    xhr.open("POST","PHP/server.php/levykauppa/albums",true);
    xhr.send(JSON.stringify(album));
    
}

function validateTracks(){
    var trackElements = document.getElementsByName("trackContainer");
    var tracks = [];
    //track = {name:"name", file:"file"}
    if(trackElements.length === 0){
        alert("Please submit at least one track");
        return false;
    }
        
        
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
    return {name:artistName, isNew:radioText.checked};
}

function validateCovers(isNewArtist){
    var artistFile = document.getElementById("artistFile").files[0];
    var albumFile = document.getElementById("albumFile").files[0];
    
    if(isNewArtist){
        if(artistFile != undefined){
            if(!artistFile.type === "image/png"){
                alert("Artist logo must be a 100x100 image (.png)");
            }
        }else{
            if(!confirm("Are you sure you don't want to submit an artist logo?")){
                return false;
            }
        }
    }else{
        artistFile = undefined;
    }
    
    if(albumFile != undefined){
        if(!albumFile.type === "image/png"){
            alert("Album cover must be a 100x100 image (.png)");
        }
    }else{
        if(!confirm("Are you sure you don't want to submit an album cover?")){
            return false;
        }
    }
    return {artistCover:artistFile,albumCover:albumFile};
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
    return albumName;
}

function validateString(string){
    return /^[a-zA-Z0-9\ \-]+$/.test(string);
}