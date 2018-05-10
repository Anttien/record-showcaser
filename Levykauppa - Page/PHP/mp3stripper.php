<?php


include("phpmp3.php"); // For stripping the mp3
include("mp3file.php"); // For calculating the duration

class mp3stripper {


    public function stripmp3($artist, $album) {

        // The root directory for the album
        $directory = '../resources/albums/'.$artist.'/'.$album;

        // The directory for the original mp3's
        $directory_original = $directory.'/original/';

        // Scan the directory for files and folders and put their names to array
        $filelist = scandir($directory_original);

        // Remove the . and .. from the beginning of the array
        array_splice($filelist, 0, 2);

        // Remove folders and other than mp3's from filelist
        foreach ($filelist as $file => $link) {
            if(is_dir($directory_original.'/'.$link)) {
                unset($filelist[$file]);
            }
            elseif (pathinfo($directory_original.'/'.$link, PATHINFO_EXTENSION) != 'mp3') {
                unset($filelist[$file]);
            }
        }

        // Create '/stripped' folder to the album root directory
        if (!file_exists($directory . '/stripped')) {
            mkdir($directory . '/stripped');
        }

        /*
         * For each file in the array, strip '$strip_length' seconds starting at '$strip_start'
         * and add the stripped mp3 to the '/stripped' folder
        */
        foreach ($filelist as $file) {
            $path = $directory_original . "/" . $file;

            // Calculate duration of the mp3 file
            $mp3file = new MP3File($path);
            $duration = $mp3file->getDuration();

            /*
             * Set $strip_length and $strip_start.
             * If $duration is 20 seconds or less, $strip_length will be half of the duration.
            */
            if ($duration <= 20) {
                $strip_length = $duration / 2;
                $strip_start = 0;
            } else {
                $strip_length = 10;
                $strip_start = $duration / 2;
            }

            // Strip the mp3
            $mp3 = new PHPMP3($path);
            $mp3_1 = $mp3->extract($strip_start,$strip_length);
            $mp3_1->save($directory . '/stripped/' . $file);
        }

        return $filelist; // For testing purposes
    }



}





