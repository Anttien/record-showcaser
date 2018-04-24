<?php

include ("mp3stripper.php"); // Strips all the mp3 files in folder
include ("mp3storage.php"); // The database

$mp3stripper = new mp3stripper();
$mp3storage = new mp3storage();

$artist = 'Stormic';
$album = 'Demo';

$mp3storage->registerAlbum($artist, $album, $mp3stripper->stripmp3($artist, $album));

echo $mp3storage->getAlbumsInJson();
