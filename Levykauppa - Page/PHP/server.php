<?php

include ("mp3stripper.php"); // Strips all the mp3 files in folder
include ("databaseconnector.php"); // The mysql database connection

$mp3stripper = new mp3stripper();

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
     * Example: 'server.php/levykauppa/albums'
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

    /*
     * Creates the directories for album and artist to the server if they doesn't exist.
     * Moves the uploaded mp3's there and creates stripped versions of them.
     * Registers the album and artist info to the database.
     *
     * Example: 'server.php/Stormic/Justice For All'
     */
//    else if ($request_method=="POST" && isset($resource[1]) && isset($resource[2])) {
    else if ($request_method=="POST") {

        $target_path_root = "../resources/albums/";

        $artist = $_POST['artist'];
        $album = $_POST['album'];


        // Create folder for the artist
        if (!file_exists($target_path_root . '/'.$artist)) {
            mkdir($target_path_root . '/'.$artist);
        }

        // Create folder for the album
        if (!file_exists($target_path_root . '/'.$artist.'/'.$album)) {
            mkdir($target_path_root . '/'.$artist.'/'.$album);
        }

        // Create folder for the original mp3
        if (!file_exists($target_path_root . '/'.$artist.'/'.$album)."/original/") {
            mkdir($target_path_root . '/'.$artist.'/'.$album."/original/");
        }



        // Register artist and album to the database

        $target_path_artistCover = "../resources/albums/".$artist."/";
        $target_path_albumCover = "../resources/albums/".$artist."/".$album."/";

        if (!is_int(getArtistId($artist))) {
            addArtist($artist, $target_path_artistCover . $_FILES['artistCover']['name']);
        }

        if (!is_int(getAlbumId($artist, $album))) {
            addAlbum($artist, $album, $target_path_albumCover . $_FILES['albumCover']['name']);
        } else {
            echo "Album already exists";
            return;
        }

        // Move each file to the right folders and register tracks to database
        // Handle mp3's and other(image) files differently.
        $target_path_original = "../resources/albums/".$artist."/".$album."/original/";
        $target_path_stripped = "../resources/albums/".$artist."/".$album."/stripped/";

        foreach ($_FILES as $file) {
            var_dump($file);

            if (substr($file['name'], -3) == 'mp3') {
                $target_path = $target_path_original . basename( $file['name']);

                if(move_uploaded_file($file['tmp_name'], $target_path)) {
                    $target_path_stripped_mp3 = $target_path_stripped . basename( $file['name']);
                    $mp3file = new MP3File($target_path);
                    $duration = $mp3file->getDuration();
                    $track_length = $mp3file::formatTime($duration);
                    addTrack($artist, $album, rtrim($file['name'], ".mp3"), $track_length, $target_path, $target_path_stripped_mp3);
                    echo "The mp3 file ".  basename( $file['name']). " has been uploaded";
                } else {
                    echo "There was an error uploading the file, please try again!";
                }

            } else {

                if ($file['name'] == 'albumcover.png') {
                    $target_path = $target_path_albumCover;
                } else {
                    $target_path = $target_path_artistCover;
                }

                $target_path = $target_path . basename( $file['name']);
                if(move_uploaded_file($file['tmp_name'], $target_path)) {
                    echo "The file ".  basename( $file['name']). " has been uploaded";
                } else{
                    echo "There was an error uploading the file, please try again!";
                }
            }
        }

        // Strip the mp3's
        $mp3stripper->stripmp3($artist, $album);

        // For testing purposes:
        var_dump($_FILES);
        var_dump($_POST);

    }
    else {
        http_response_code(405); # Method not allowed
    }
}

else {
    http_response_code(405); # Method not allowed
}
