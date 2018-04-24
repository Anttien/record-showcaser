<?php


class mp3storage
{
    private $albums;

    public function getAlbumsInJson() {
        return json_encode($this->albums, JSON_UNESCAPED_SLASHES);
    }

    public function registerAlbum($artist, $album_name, $files) {
        $album = array();

        $album['artist'] = $artist;
        $album['album_name'] = $album_name;
        $album['tracks'] = array();

        $i = 0;
        foreach ($files as $file) {
            $album['tracks'][$i]['title'] = substr($file, 4);

            // Calculate duration of the original mp3 file
            $mp3file = new MP3File('albums/' . $artist . ' - ' . $album_name . '/original/' . $file);
            $duration = MP3File::formatTime($mp3file->getDuration());
            $album['tracks'][$i]['duration'] = $duration;

            $album['tracks'][$i]['stripped_file_link'] = 'albums/' . $artist . ' - ' . $album_name . '/stripped/' . $file;

            $i += 1;
        }

        $this->albums[] = $album;

        // echo json_encode($this->albums, JSON_UNESCAPED_SLASHES);
    }

}