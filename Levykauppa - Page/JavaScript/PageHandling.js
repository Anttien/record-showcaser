window.onload = init;
var pageIdList = [/*"home",*/"artists","albums","about","artist", "upload"];
function init() {
    document.getElementById("button_menu").onclick = function() {openMenu();};
    document.getElementById("button_close").onclick = function() {closeMenu();};
    //document.getElementById("button_home").onclick = function() {changePage("home");};
    document.getElementById("button_artists").onclick = function() {changePage("artists");};
    document.getElementById("button_albums").onclick = function() {changePage("albums");};
    document.getElementById("button_about").onclick = function() {changePage("about");};
    document.getElementById("button_upload").onclick = function() {changePage("upload");};
    
    getArtists();
    initUpload();
    getAlbums();
}

function openMenu(){
    document.getElementById("menu").style.width = "250px";
    document.getElementById("main").style.marginLeft = "200px";
}

function closeMenu(){
    document.getElementById("menu").style.width = "0px";
    document.getElementById("main").style.marginLeft = "0px";
}

function changePage(pageId) {
    if(document.getElementById(pageId).classList.contains("invisible")){
        for(var id of pageIdList){
            var elem = document.getElementById(id);
            elem.classList.add("invisible");
        }
        document.getElementById(pageId).classList.remove("invisible");
    }
    closeMenu();
}