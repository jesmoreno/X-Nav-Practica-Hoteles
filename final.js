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

/*function(){

};*/



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
	var marker = L.marker([lat, lon]);

	marker.addTo(map).bindPopup('<p '+'no='+$(this).attr('no')+'>'+name +'</p>',closeOnClick = false).openPopup();

	marker.on('click',function(e){
		alert(this.getPopup().getContent());
		show_accomodation();




		//this.setOpacity(0);
		//alert("cierro pestaña");

	});


	//cuando pincho sobre la marca muestro información de esta localizacion
	/*marker.on('remove',function(e){
		//this.setOpacity(0);
		alert("elimino");
	});*/

	map.setView([lat, lon], 15);
	//añado información del hotel seleccionado al html
	$('#desc').html('<h2>' + name + '</h2>'+ '<p><strong>Dirección: </strong>'+address+'. <strong>Valoración: </strong>' + subcat + '</p>'+ desc);
	

	//para el carousel de fotos
	if(accomodation.multimedia.media[0].url){
		create_carousel(accomodation);
	}
};

function get_accomodations(){
	var url = "https://raw.githubusercontent.com/CursosWeb/Code/3c0f0ddaf433eee819428ba9617c59c74081fa11/JS-APIs/misc/alojamientos/alojamientos.json";
	$.getJSON(url, function(data) {

		//quito el boton de cargar el json
		$('#get').hide();
		accomodations = data.serviceList.service;

		//genero lista de hoteles
		for (var i = 0; i < accomodations.length; i++) {
			var p = document.createElement("p");
			p.setAttribute('no', i);
			var content = document.createTextNode(accomodations[i].basicData.title);
			p.appendChild(content);

			$("#finalList").append(p);
	 	}

	 	$('#finalList p').click(show_accomodation);

		//muestro la caja de hoteles
		$("#finalList").show();

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

	//nada mas empezar no muestro la caja de hoteles ni la lista de favoritos
	$("#finalList").hide();
	$("#favs").hide();
	//escondo formulario para crear coleccion
	$("form.navbar-left").hide();


	//boton cargar json
	$("#get").click(function(){
		get_accomodations();
		//boton de cargar json pulsado
		$("#get").attr('state','clicked');
	});

	//cojo información que se mete en el formulario y añado lista
	$("button.btn-default").click(function(){
		if($("input.form-control").val() !== ""){
			var collectionTitle = $("input.form-control").val();
			$("input.form-control").val("");
			var newCollection = {name : collectionTitle};
			$("#favs").append($('<div><h1>'+collectionTitle+'</h1></div>'));
		}
		
		$('#favs div').last().droppable({
			drop: function( event, ui ) {
				//alert($(this).html());
				$("<p></p>").text(ui.draggable.text()).appendTo(this);
			},
			over: function( event, ui ) {
				this.style.opacity = '0.4';
			},
			deactivate: function( event, ui ) {
				this.style.opacity = '1';
				$(this).find("p").hide();
				$(this).click(function(){
					//cierro las demas pestañas
					$('#favs div').find('p').hide();
					//abro esta pestaña
					$(this).find('p').show();
				});
			},
			out: function( event, ui ) {
				this.style.opacity = '1';
			}
		});

		//hago arrastrables los elementos de la lista
		if($("#favs").find('h1').length === 1){//solo lo hago la primera vez que hay una lista
			//creo acordeon de favs
			$("#finalList").find("p").draggable({appendTo: "body",helper: "clone",scroll: true});
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
			$("#map").show();

			if($("#get").attr('state') === "clicked"){
				$("#finalList").show();
				$("#favs").show();
			}
			
				
		}else if($(this).attr('id')==="home"){//si es inicio

			$("#favs").hide();
			$("form.navbar-left").hide();
			$("#map").show();
			$("#myCarousel").show();
			$("#desc").show();

			if($("#get").attr('state') === "clicked"){
				$("#finalList").show();
			}

		}else if($(this).attr('id')==="collection"){

			$("#favs").hide();
			$("form.navbar-left").hide();
			$("#map").hide();
			$("#myCarousel").hide();
			$("#desc").show();
			if($("#get").attr('state') === "clicked"){
				$("#finalList").hide();
			}
		}
	});
/////////////////////////////////////////////////////////////////PREGUNTAR SI SE CREA SIEMPRE/////////////////////////////////////////
	//si pinchan en un pop up muestra la informacion del hotel
	/*$(".leaflet-popup-content p").click(function(){
		alert("info hotel al pulsar marca en mapa");
		show_accomodation();
	});*/
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

});