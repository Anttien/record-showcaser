window.onload = init;
var menuLinks = ["home","albums","about"];
function init() {
    document.getElementById("button_menu").onclick = function() {openMenu();};
    document.getElementById("button_close").onclick = function() {closeMenu();};
    document.getElementById("button_home").onclick = function() {changePage("home");};
    document.getElementById("button_albums").onclick = function() {changePage("albums");};
    document.getElementById("button_about").onclick = function() {changePage("about");};
}

function openMenu(){
    document.getElementById("menu").style.width = "250px";
}

function closeMenu(){
    document.getElementById("menu").style.width = "0";
}

function changePage(pageId) {
    if(document.getElementById(pageId).classList.contains("invisible")){
        for(var id of menuLinks){
            var elem = document.getElementById(id);
            elem.classList.add("invisible");
        }
        document.getElementById(pageId).classList.remove("invisible");
    }
    closeMenu();
}