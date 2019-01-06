REST:
/levykauppa/artists
	[
		{
		"name":"name",
		"logo":"logoLink",
		"homepage":"pageLink"
		}
	]

/levykauppa/albums
	[
		{
		"name":"name",
		"artist_name":"name",
		"relase_year":<year>,
		"tracks":[{"name":"name", "stripped_mp3":"link", "duration":"stringDur"}],
		"cover_image":"link"
		}
	]

/levykauppa/<artist>
	{
	"artistName":"name",
	"logo":"coverLink",
	"homepage":"pageLink",
	albums:[
		{
		"name":"name",
		"relase_year":<year>,
		"cover_image":"link",
		"tracks":[{"name":"name", "stripped_mp3":"link", "duration":"stringDur"}],
		}
	],
	}

JS:
upload:
	{
		albumCover:<file>,
		artist:"name",
		artistCover:<file>,
		name:"name",
		tracks:[
			{name:"name", file:"file"}
		],
	}





