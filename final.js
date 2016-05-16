/***FUNCIONES PARA CONTROLAR EL ARRASTRE A LISTA DE COLECCIONES***/
function handleDragStart(event) {

	//dragged = event.target;
  	this.style.opacity = .5;  // this / e.target is the source node.
  	//alert("cambio opacidad");
};

function handleDragOver(event) {
  if (e.preventDefault) {
    e.preventDefault(); // Necessary. Allows us to drop.
  }


  e.dataTransfer.dropEffect = 'move';  // See the section on the DataTransfer object.

  return false;
};

function handleDragEnter(event) {
  // this / e.target is the current hover target.
  //alert(e.target);
  alert("entro");

  if ( event.target.className == "nameList" ) {
	event.target.style.background = "purple";
  }
};

function handleDragLeave(event) {
  this.classList.remove('over');  // this / e.target is previous target element.
};

/***************************************************************************************************/

function create_carousel(obj){

	var carousel = $('<div id="hotelCarousel" class="carousel slide" data-ride="carousel">'
		+'<ol class="carousel-indicators">'
 	+'</ol>'
	+'<div class="carousel-inner" role="listbox">'
  	+'</div>'
  	+'<a class="left carousel-control" href="#hotelCarousel" role="button" data-slide="prev">'
    	+'<span class="glyphicon glyphicon-chevron-left" aria-hidden="true"></span>'
    	+'<span class="sr-only">Previous</span>'
  	+'</a>'
  	+'<a class="right carousel-control" href="#hotelCarousel" role="button" data-slide="next">'
    	+'<span class="glyphicon glyphicon-chevron-right" aria-hidden="true"></span>'
    	+'<span class="sr-only">Next</span>'
  	+'</a>'
	+'</div>').appendTo("#desc");

	for(var i=0;i<obj.multimedia.media.length;i++){
		if(i===0){
			$("#desc .carousel-indicators").append('<li data-target="#hotelCarousel" data-slide-to="'+i+'"class="active"></li>');
			$("#desc .carousel-inner").append('<div class="item active"> <img src="'+obj.multimedia.media[i].url+'"></div>');
		}else{
			$("#desc .carousel-indicators").append('<li data-target="#hotelCarousel" data-slide-to='+i+'></li>');
			$("#desc .carousel-inner").append('<div class="item"> <img src="'+obj.multimedia.media[i].url+'"></div>');
		}
	}
};

function show_accomodation(){

	//objeto que contiene la informacion
	var accomodation = accomodations[$(this).attr('no')];
	
	if(accomodation.geoData.latitude){
		var lat = accomodation.geoData.latitude;
	}
	if(accomodation.geoData.longitude){
		var lon = accomodation.geoData.longitude;
	}
	if(accomodation.geoData.address){
		var address = accomodation.geoData.address;
	}
	if(accomodation.basicData.name){
		var name = accomodation.basicData.name;
	}
	if(accomodation.basicData.body){
		var desc = accomodation.basicData.body;
	}
	if(accomodation.extradata.categorias.categoria.subcategorias.subcategoria.item[1]['#text']){
		var subcat = accomodation.extradata.categorias.categoria.subcategorias.subcategoria.item[1]['#text'];
	}
	//marcador de localizacion en el mapa con nombre
	L.marker([lat, lon]).addTo(map).bindPopup('<p '+'no='+$(this).attr('no')+'>'+name +'</p>').openPopup();
	map.setView([lat, lon], 15);
	//añado información del hotel seleccionado al html
	$('#desc').html('<h2>' + name + '</h2>'+ '<p><strong>Dirección: </strong>'+address+'. <strong>Valoración: </strong>' + subcat + '</p>'+ desc);
	

	//para el carousel de fotos
	if(accomodation.multimedia.media[0].url){
		var img = create_carousel(accomodation);
	}
};

function get_accomodations(){
	var url = "https://raw.githubusercontent.com/CursosWeb/Code/3c0f0ddaf433eee819428ba9617c59c74081fa11/JS-APIs/misc/alojamientos/alojamientos.json";
	$.getJSON(url, function(data) {

		//quito el boton de cargar el json
		$('#get').hide();
		accomodations = data.serviceList.service;

		var list = '';
		for (var i = 0; i < accomodations.length; i++) {
	 		list = list + '<li no="' + i + '" draggable=true>' + accomodations[i].basicData.title + '</li>';
	 	}
	 	//creo el nodo y lo añado
	 	var div = $("<div id='list'>"+list+"</div>");
	 	div.appendTo( "#finalList" );

	 	$('#list li').click(show_accomodation);
	});
};

$(document).ready(function() {

	//estructuras para almacenar info de colecciones
	var myCollection = [];

	//alert(screen.width + " x " + screen.height); 

	map = L.map('map').setView([40.4175, -3.708], 11);
	L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
	attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
	maxZoom: 13
	}).addTo(map);


	//boton cargar json
	$("#get").click(function(){
		get_accomodations();
		//boton de cargar json pulsado
		$("#get").attr('state','clicked');

		//crear zona para arrastrar nombre hotel y guardar en coleccion
		var titleFavs = $("<h1>Lista de favoritos</h1>");
		titleFavs.appendTo("#favs");

		//si estoy en la pestaña inicio quito la zona para guardar hotel en coleccion
		if($("#home").attr('class') === "active"){
			$("#favs").hide();
		}
	});

	//escondo formulario para crear coleccion
	$("form.navbar-left").hide();
 
	//cojo información que se mete en el formulario y añado lista
	$("button.btn-default").click(function(){
		var collectionTitle = $("input.form-control").val();
		$("input.form-control").val("");
		var newCollection = {name : collectionTitle};
		$("#favs").append($('<p class="nameList" draggable=true>'+collectionTitle+'</p>'));

	/*********************************************arrastre a coleccion*********************************************************************************/
		
		if($('#favs').find('p').length === 1){
			//alert($("#favs p").html());

			var elements = document.querySelectorAll('#list li , #favs p');
			//alert(elements.length);

			[].forEach.call(elements, function(item) {
	  			item.addEventListener('dragstart', handleDragStart, false);
	  			item.addEventListener('dragenter', handleDragEnter, false);
	 	 		item.addEventListener('dragover', handleDragOver, false);
	  			item.addEventListener('dragleave', handleDragLeave, false);
			});
		}
	});

	//boton que este con clase active para cargar sus elementos correspondientes
	$(".navbar-nav li").click(function(){

		//si el boton pulsado no es el de cargar los alojados
		if($(this).attr('id')!=="housed"){
			$('ul').find('li.active').removeClass("active");
			$(this).addClass("active");
		}
		
		if($(this).attr('id')==="management"){//si gestion de hoteles

			$("#myCarousel").hide();
			$("#desc").hide();
			//si ya se han cargado los hoteles mostrar formulario para favoritos
			if($("#get").attr('state')!=="none"){
				$("form.navbar-left").show();
			}
			$("#favs").show();
			$("#map").show();
			$("#finalList").show();
				
		}else if($(this).attr('id')==="home"){//si es inicio

			$("#favs").hide();
			$("form.navbar-left").hide();
			$("#map").show();
			$("#myCarousel").show();
			$("#desc").show();
			$("#finalList").show();

		}else if($(this).attr('id')==="collection"){

			$("#favs").hide();
			$("form.navbar-left").hide();
			$("#map").hide();
			$("#myCarousel").hide();
			$("#desc").show();
			$("#finalList").hide();
		}
	});
/////////////////////////////////////////////////////////////////PREGUNTAR SI SE CREA SIEMPRE/////////////////////////////////////////
	//cerrar marca del mapa
	/*$(".leaflet-popup-close-button").click(function(){
		$("img.leaflet-clickable ,img.leaflet-zoom-animated").remove();
	});
	//si pinchan en un pop up muestra la informacion del hotel
	$(".leaflet-popup-content p").click(function(){
		alert("info hotel al pulsar marca en mapa");
		show_accomodation();
	});*/
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

});