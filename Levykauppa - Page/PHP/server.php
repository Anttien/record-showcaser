<?php

include ("mp3stripper.php"); // Strips all the mp3 files in folder
// include ("mp3storage.php"); // The database demo version
include ("databaseconnector.php"); // The mysql database connection

$mp3stripper = new mp3stripper();
// $mp3storage = new mp3storage();
// $artist = 'Stormic';
// $album = 'Demo';
// $mp3storage->registerAlbum($artist, $album, $mp3stripper->stripmp3($artist, $album));
// echo $mp3storage->getAlbumsInJson();

# URI parser helper functions
# ---------------------------

function getResource() {
    # returns numerically indexed array of URI parts
    $resource_string = $_SERVER['REQUEST_URI'];
    $resource_string = urldecode($resource_string);
    if (strstr($resource_string, '?')) {
        $resource_string = substr($resource_string, 0, strpos($resource_string, '?'));
    }

    $resource = array();
    $resource = explode('/', $resource_string);
    array_shift($resource);
    array_shift($resource);
    array_shift($resource);

    return $resource;
}

function getParameters() {
    # returns an associative array containing the parameters
    $resource = $_SERVER['REQUEST_URI'];
    $param_string = "";
    $param_array = array();
    if (strstr($resource, '?')) {
        # URI has parameters
        $param_string = substr($resource, strpos($resource, '?')+1);
        $parameters = explode('&', $param_string);
        foreach ($parameters as $single_parameter) {
            $param_name = substr($single_parameter, 0, strpos($single_parameter, '='));
            $param_value = substr($single_parameter, strpos($single_parameter, '=')+1);
            $param_array[$param_name] = $param_value;
        }
    }
    return $param_array;
}

function getMethod() {
    # returns a string containing the HTTP method
    $method = $_SERVER['REQUEST_METHOD'];
    return $method;
}

// Main

$resource = getResource();
$request_method = getMethod();
$parameters = getParameters();

# Redirect to appropriate handlers.

if ($resource[0]=="levykauppa") {

    /*
     * Returns all artists in the database, in ascending order by name
     * Example: 'server.php/levykauppa/artists'
     */
    if ($request_method=="GET" && $resource[1]=="artists") {
        echo json_encode(getArtists());
    }

    /*
     * Returns all albums in the database, in ascending order by album name
     * Example: 'server.php/levykauppa/artists'
     */
    else if ($request_method=="GET" && $resource[1]=="albums") {
        echo json_encode(getAlbums("album.name"));
    }

    /*
     * Returns all tracks of <album> in the database
     * Example: 'server.php/levykauppa/<artist>/<album>'
     *
     * OR
     *
     * Returns <artist> and the albums in the database, in ascending order by release year
     * Example: 'server.php/levykauppa/<artist>'
     */
    else if ($request_method=="GET" && is_int(getArtistId($resource[1]))) {
        if (isset($resource[2])) {
            echo json_encode(getTracksOfAlbum($resource[1], $resource[2]));
        } else {
            echo json_encode(getArtist($resource[1]));
        }
    }


    else if ($request_method=="GET" && is_int(getArtistId($resource[1]))) {

    }
    else {
        http_response_code(405); # Method not allowed
    }
}

else {
    http_response_code(405); # Method not allowed
}
