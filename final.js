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

function info_map(data){
	//data[0] = selector; data[1]= lat ; data[2] = long; data[3] = nombre hotel
	var marker = L.marker([data[1], data[2]]);

	marker.addTo(map);
	marker.bindPopup('<p '+'no='+data[0]+'>'+data[3] +'</p>',{closeOnClick: true}).openPopup();
	//si pinchan en la marca muestro info hotel
	marker.on('click',function(e){
		var num = this.getPopup().getContent().split("=")[1].split(">")[0];
		show_accomodation(accomodations,num);
	});

	//cerrar marca
	marker.on('dblclick',function(e){
		this.closePopup();
		this.setOpacity(0);
	});

	map.setView([data[1], data[2]], 15);
};



show_accomodation = function (elements,selector){

	//objeto que contiene la informacion
	var accomodation = elements[selector];
	var data = [];

	data.push(selector);

	if(accomodation.geoData.latitude){
		var lat = accomodation.geoData.latitude;
		data.push(lat);
	}
	if(accomodation.geoData.longitude){
		var lon = accomodation.geoData.longitude;
		data.push(lon);
	}
	if(accomodation.geoData.address){
		var address = accomodation.geoData.address;
	}
	if(accomodation.basicData.name){
		var name = accomodation.basicData.name;
		data.push(name);
	}
	if(accomodation.basicData.body){
		var desc = accomodation.basicData.body;
	}
	if(accomodation.extradata.categorias.categoria.subcategorias.subcategoria.item[1]['#text']){
		var subcat = accomodation.extradata.categorias.categoria.subcategorias.subcategoria.item[1]['#text'];
	}

	//añado información del hotel seleccionado al html
	$('#desc').html('<h2>' + name + '</h2>'+ '<p><strong>Dirección: </strong>'+address+'. <strong>Valoración: </strong>' + subcat + '</p>'+ desc);

	//para el carousel de fotos
	if(accomodation.multimedia.media[0].url){
		create_carousel(accomodation);
	}

	return data;
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

	 	$('#finalList p').click(function(){

	 		var markData = show_accomodation(accomodations,[$(this).attr('no')]);
	 		info_map(markData);
	 	});

		//muestro la caja de hoteles
		$("#finalList").show();

	});
};

$(document).ready(function() {

	//estructuras para almacenar info de colecciones
	var myCollection = [];
	//alert(screen.width + " x " + screen.height); 


/////////////////////////////CREAR MAPA INICIAL/////////////////////////////////////////////////////////////////////////////////////////
	map = L.map('map').setView([40.4175, -3.708], 11);
	L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
	attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
	maxZoom: 13
	}).addTo(map);

/////////////////////////////BOTON PARA CARGAR JSON/////////////////////////////////////////////////////////////////////////////////////////
	$("#get").click(function(){
		get_accomodations();
		//boton de cargar json pulsado
		$("#get").attr('state','clicked');
		//si estoy en Mis hoteles
		if($("#collection").attr('class')==='active'){
			$("#finalList").hide();
			alert("quito lista de hoteles");
		}

	});

	//nada mas empezar no muestro la caja de hoteles ni la lista de favoritos
	$("#finalList").hide();
	$("#favs").hide();
	//escondo formulario para crear coleccion
	$("form.navbar-left").hide();


/////////////////////////////BOTONES PARA CARGAR LISTA DE FAVS Y SUBIRLA/////////////////////////////////////////////////////////////////////////////////////////
	$("ul.dropdown-menu li").click(function(){
		//16133830a10601b0465900ef179454262860d5e1 GITHUB API
		if($(this).attr('id')=== "save"){
			var form = '<form class="myForm" action="" method="post" name="contact_form">'+
      		'<ul><li><h2>Form</h2><span class="required_notification">* Denotes Required Field</span>'+
        	'</li><li><label for="name">Token Github:</label><input type="text" id="token" placeholder="" required/>'+
          	'<span class="form_hint">*</span></li>'+
			'<li><label for="email">Repository name:</label><input type="text" id="repository" placeholder="" required/>'+
         	'<span class="form_hint">*</span></li>'+
			'<li><label for="website">File name:</label><input type="text" id="file" placeholder="" required/>'+
          	'<span class="form_hint">*</span></li>'+
        	'<li><button class="submit" type="button">Submit Form</button></li></ul></form>';

        	$("#formJson").append(form);

        	//cuando pinchen en enviar lo subo y cierro el div
        	$("button.submit").click(function(){
        		
        		var token = $("input#token").val();
        		var repName = $("input#repository").val();
        		var fileName = $("input#file").val();

        		//alert(token+" "+repName+" "+fileName);
        		$("form.myForm").remove();
        	});

		}else{
			//cuando cargue
			console.log("cargo json");
		}
	});

/////////////////////////////BOTON FORMULARIO CREAR LISTAS DE HOTELES/////////////////////////////////////////////////////////////////////////////////////////
	$("button.btn-default").click(function(){
		if($("input.form-control").val() !== ""){
			var collectionTitle = $("input.form-control").val();
			$("input.form-control").val("");
			var newCollection = {name : collectionTitle};
			$("#favs").append($('<div><h1>'+collectionTitle+'</h1></div>'));
		}
		
		$('#favs div').last().droppable({
			drop: function( event, ui ) {
				//$(this).html();
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

/////////////////////////////PESTAÑAS APLICACION/////////////////////////////////////////////////////////////////////////////////////////
	$(".navbar-nav li").click(function(){

		//si el boton pulsado no es el de cargar los alojados
		if($(this).attr('id')!=="housed" && $(this).attr('id')!=="download"){
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
});