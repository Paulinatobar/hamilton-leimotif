// Se declaran variables globales
var jsonurl = "js/datos.json"
var misdatos = "";
var sidebar = document.getElementById("sidebar-content");
var playerSpotify = document.getElementById("player");
var vizArc = document.getElementById("arc-viz");


// Carga los datos del jason en "misdatos"
document.addEventListener("DOMContentLoaded", function api() {
	fetch(jsonurl)
		.then(res => res.json())
		.then(data => {
			misdatos = data;
		});
});



// Borra el contenido dinámico anterior
var resetCanvas = function() {
	sidebar.innerHTML = "";
	vizArc.className = "";

};



// función para obtener los datos del json
var createContent = function(el) {
	// obtiene el id de la clase para buscar en el json
	const jsonId = el.className.replace("motif ", "");

	// valida que la clase pertenezca al motif correspondiente
	for (var i = 0; i < misdatos.motifs.length; ++i) {
		var currentMotif = misdatos.motifs[i];
		if (currentMotif.id == jsonId) {
			//Función que musetra los contenidos del json
			mostrar(i);

			// Funcion para poner color a los arcos de los motifs correspondientes
			paintArc(currentMotif.id);
		}

	}
};


//función que agrega una clase "active" a los arcos del motif seleccionado
function paintArc(y) {
	resetArcClass();
	const arcClass = document.getElementsByClassName(y);
	for (let i = 0; i < arcClass.length; i++) {
		//const arcClassCheck = "arc";
		if (arcClass[i].classList.contains("arc")) {
			arcClass[i].classList.add("active");
		}
	}
};

function resetArcClass() {
	const arcClassActive = document.querySelectorAll('g.active');
	for (let i = 0; i < arcClassActive.length; i++) {
		arcClassActive[i].classList.remove("active");
	}
}

// Agrega un EventListener para que cada motif muestre datos al hacer clic
var addEventListenersMotif = function() {
	// arreglo con todos los elementos que tienen clase motif
	const motifElements = document.querySelectorAll(".motif");

	// Se agrega el EventListener a cada elemento
	for (let i = 0; i < motifElements.length; i++) {
		let item = motifElements[i];
		item.addEventListener('click', function() {
			createContent(this);
		});
	}
};

// Crea una canción del listado.
var buildSong = function(llave, i) {

	// Se llama la canción en el json
	let songData = llave.songs[i];

	// Se crea el elemento li con el nombre
	const song = document.createElement("li");
	song.innerHTML = songData.song_name;

	/* Sólo si tiene url de Spotify se agrega comportamiento y atributos */
	if (typeof songData.uri_spotify != undefined && songData.uri_spotify.indexOf("spotify.com") != -1) {
		song.setAttribute("song", songData.uri_spotify);
		song.addEventListener('click', function() {
			playerSpotify.src = songData.uri_spotify;
			console.log(songData.uri_spotify)
		});
		song.classList.add("song");
	}

	return song;
};



// Construye el contenido dinámico y lo presenta en pantalla.
var mostrar = function(x) {
	// llave permite acceder al listado de atributos del motif
	var llave = misdatos.motifs[x];

	// Se elimina de pantalla los datos dinámicos
	resetCanvas();

	// Se crea un div con la clase del motif y se agrega a contenido dinámico
	var contenidos = document.createElement("div");
	contenidos.classList.add(llave.class); 
	sidebar.appendChild(contenidos);

	// Se crea título de leimotif
	var leitmotif = document.createElement("h2");
	leitmotif.innerHTML = "Leitmotif: " + llave.name;
	contenidos.appendChild(leitmotif);

	// Se agrega la descripción del personaje
	var character = document.createElement("h3");
	character.innerHTML = "Personaje: " + llave.character;
	contenidos.appendChild(character);

	// Se crea un contenedor flex para la imagen y el texto del motif
	var contentWrapper = document.createElement("div");
	contentWrapper.classList.add("motif-content-wrapper");
	contenidos.appendChild(contentWrapper);

	// Se agrega la descripción del motif 
	var motifText = document.createElement("div");
	motifText.innerHTML = llave.texto_motif;
	motifText.classList.add("motif-text");
	contentWrapper.appendChild(motifText);

	// Se agrega un subtítulo
	var songs = document.createElement("h3");
	songs.innerHTML = "Canciones: ";
	contenidos.appendChild(songs);

	var songsText = document.createElement("p");
	songsText.innerHTML = "Haz clic en una canción para cargarla en el player y escuchar el motif (requiere estar logueado en una cuenta de Spotify en el navegador para escucharlas todas).";
	contenidos.appendChild(songsText);

	// Se crea el listado de canciones
	var songList = document.createElement("ul");
	contenidos.appendChild(songList);
	playerSpotify.src = llave.songs[0].uri_spotify;
	for (i = 0; i < llave.songs.length; i++) {
		songList.appendChild(buildSong(llave, i));
	};

	// Se agrega clase personaje a div arc
	vizArc.classList.add(llave.class);

};

let actualSong = null;
// Botón para siguiente canción
function nextSong(actualSong) {
	const nextSong = actualSong === null ? 1 : actualSong + 1;
	const dict = {
		1: ["m13", 10], // Running out of time
		2: ["m10", 7], // Take a stand
		3: ["m11", 8], // Wait for it
		4: ["m9", 6], // Enough
		5: ["m13", 10], // Running out of time
		6: ["m4", 1], // Right hand man
		7: ["m6", 3], // Look around
		8: ["m7", 4], // Helpless
		9: ["m9", 6], // Enough
		10: ["m8", 5], // Satisfied
		11: ["m5", 2], // History has its eyes on you
		12: ["m6", 3], // Look around
		13: ["m8", 5], // Satisfied
		14: ["m9", 6], // Enough
		15: ["m5", 2], // History has its eyes on you
		16: ["m13", 10], // Running out of time
		17: ["m5", 2], // History has its eyes on you
		18: ["m12", 9], // My shot
		19: ["m3", 0], // Just you wait
		20: ["m12", 9] // My shot
	}
	mostrar(dict[nextSong][1]);
	paintArc(dict[nextSong][0]);
}

function addEventListenerNext() {
	const button = document.getElementById("button-next");
	button.addEventListener('click', function() {
		nextSong(actualSong);
		actualSong++;

		if (actualSong === 21) {
			actualSong = null;
		}
	})
}

// Se ejecuta la función para llamar a toda la funcionalidad
addEventListenersMotif();
addEventListenerNext();

//Controlador slideshow header
let currentIndex = 1;

function moveSlide(direction) {
	const slides = document.querySelectorAll('.carousel-slide');
	const dots = document.querySelectorAll('.dot');

	// Quitar clase active
	slides[currentIndex - 1].classList.remove('active');
	dots[currentIndex - 1].classList.remove('active');

	// Calcular nuevo índice
	currentIndex += direction;

	if (currentIndex > slides.length) {
		currentIndex = 1;
	} else if (currentIndex < 1) {
		currentIndex = slides.length;
	}

	slides[currentIndex - 1].classList.add('active');
	dots[currentIndex - 1].classList.add('active');
}

function currentSlide(n) {
	const slides = document.querySelectorAll('.carousel-slide');
	const dots = document.querySelectorAll('.dot');

	slides[currentIndex - 1].classList.remove('active');
	dots[currentIndex - 1].classList.remove('active');

	currentIndex = n;

	slides[currentIndex - 1].classList.add('active');
	dots[currentIndex - 1].classList.add('active');
}

/* Código formateado en: https://pinetools.com/es/formateador-javascript*/ 


