//variables para github
var github;
var myrepo;


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

		if($("#collection").attr('class')==='active'){
			$("#desc").hide();
		}
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

	$("#desc").show();

	if($("#desc").attr('showed') !== 'true'){
		$("#desc").attr('showed','true');

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
			var li = document.createElement("li");


			var content1 = document.createTextNode(accomodations[i].basicData.title);
			var content2 = document.createTextNode(accomodations[i].basicData.title);

			//para pestaña de gestion
			p.setAttribute('no', i);
			p.appendChild(content1);
			$("#finalList").append(p);
			//para pestaña principal
			li.setAttribute('no', i);
			li.appendChild(content2);
			$("#listHome ul").append(li);
	 	}

	 	$('#listHome li').click(function(){

	 		var markData = show_accomodation(accomodations,[$(this).attr('no')]);
	 		info_map(markData);


	 		//miro la informacion de alojados para mostrarla (si hay alguno para ese hotel)
	 		var hotelName = $("#desc").find('h2').html();
	 		var position;
	 		var apiKey = 'AIzaSyBu3RpbHtQvU9s-JQVwRnCwfuYG--ve6fI';

	 		for(var i=0;i<myCollection.housed.length;i++){
	 			if(myCollection.housed[i].hotelName === hotelName){
	 				position = i;
	 				break;
	 			}
	 		}

	 		//tengo el hotel en la coleccion
	 		if(position !== undefined){
	 			$("#housedPeople").empty();
	 			$("<h1>Lista de alojados</h1>").appendTo($("#housedPeople"));
	 			//miro si tiene alojados para mostrarlo
	 			if(myCollection.housed[position].idHoused.length>0){//si contiene algun alojado
	 				
	 				
	 				for(var k =0;k<myCollection.housed[position].idHoused.length;k++){
	 					var id = myCollection.housed[position].idHoused[k];
	 					handleClientLoad(apiKey,id);

	 				}
	 				$("#housedPeople").show();
	 			}

	 		}else{//no hay ese hotel en la coleccion por tanto no hay alojados
	 			//alert("no esta el hotel en la coleccion");
	 			$("#housedPeople").empty();
	 			$("<h1>Lista de alojados</h1>").appendTo($("#housedPeople"));
	 			$("#housedPeople").hide();
	 		}
	 	});

	});
};

///////////////////////////////////////////////////////FUNCIONES PARA SUBIR A GITHUB Y DESCARGAR/////////////////////////////////////////

writeRepository = function(myToken,reponame,file) {
    var token = myToken;
    //console.log (token);

    github = new Github({token: token,auth: "oauth"});
    myrepo = github.getRepo('jesmoreno', reponame);

    //console.log (token+" "+reponame +" "+file);

    myrepo.writeFile('gh-pages', file, 
		 new Date().toLocaleString(),
		 "Create file", function(err) {
		     console.log (err);
		 });

};

/////////////////////////////////////////////////////FUNCIONES PARA GOOGLE+/////////////////////////////////////////////////////////////

handleClientLoad = function(apiKey,id) {

        gapi.client.setApiKey(apiKey);
        
        makeApiCall(id);
        //console.log(window.person);
};


makeApiCall = function(id) {

        gapi.client.load('plus', 'v1', function() {

        	var request = gapi.client.plus.people.get({'userId': id});

          	request.execute(function(resp) {

          		person = resp.displayName;
          		img = resp.image.url;

            	var heading = document.createElement('h4');
            	var image = document.createElement('img');
            	image.src = resp.image.url;
            	heading.appendChild(image);
            	heading.appendChild(document.createTextNode("  "+resp.displayName));

            	document.getElementById('housedPeople').appendChild(heading);

          	});

        });

};


/////////////////////////////////////////////////////CUANDO EL DOM ESTA LISTO////////////////////////////////////////////////////////////
$(document).ready(function() {

	//estructura para almacenar info de colecciones
	myCollection = {};
	myCollection.lists = [];
	myCollection.housed = [];

	//alert(screen.width + " x " + screen.height); 


////////////////////////////////////////////////FORMULARIO ID GOOGLE +//////////////////////////////////////////////////////////////////


	$('#googleForm button').click(function(){

		var id = $('#idGoogle').val();
		//consigo el nombre en google plus
		var apiKey = 'AIzaSyBu3RpbHtQvU9s-JQVwRnCwfuYG--ve6fI';

		//vacio input formulario
		$("#idGoogle").val('');


		//hName---> nombre hotel    pos---->variable para saber si está ya el hotel y mirar alojados
		var hName = $("#desc").find('h2').html();
		var pos;

		//si el hotel que muestra la info coincide con uno ya en la lista
		for(var i=0;i<myCollection.housed.length;i++){
			if(myCollection.housed[i].hotelName === hName){
				pos = i;
				break;
			} 
		}


		var obj = new Object();
		var idExist = false;

		if(pos === undefined){//no existe el hotel asi que añado toda la info
			//alert("no esta este hotel");

			obj.hotelName = hName;
			obj.idHoused = [];
			obj.idHoused.push(id);
			//inserto objeto en coleccion principal
			myCollection.housed.push(obj);

			handleClientLoad(apiKey,id);

		}else{//si coincide el nombre de hotel miro si tiene ya el id
			//alert("esta este hotel");

			for(var j=0;j<myCollection.housed[pos].idHoused.length;j++){
				if(myCollection.housed[pos].idHoused[j] === id){
					//funcion autoejecutable si ya esta el id informo y no añado
					//alert("no añado id");
					$("#idGoogle").val('id ya existente');
					idExist = true;
					break;
				}
			}

			//no coincide el id y añado al hotel correspondiente
			if(!idExist){
				//alert("añado id");
				myCollection.housed[pos].idHoused.push(id);
				handleClientLoad(apiKey,id);
			}
			
		}

		

		$("#housedPeople").attr("showed","true");
		$("#housedPeople").show();

	});



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
		if($("#housed").attr('class')==='active'){
			//alert("alojados");
			$("#finalList").hide();
			$("#listHome").hide();
		}

		if($("#collection").attr('class')==='active'){
			//alert("gestion");
			$("form.navbar-left").show();
			$("#finalList").show();
		}

		if($("#home").attr('class')==='active'){
			//alert("inicio");
			$("#listHome").show();
			$("#finalList").hide();
		}

	});

	//nada mas empezar no muestro:
	$("#listHome").hide();
	$("#finalList").hide();
	$("#favs").hide();
	$("#googleForm").hide();
	$("#desc").hide();
	$("form.navbar-left").hide();
	$("#housedPeople").hide();
	$("#collectionSelected").hide();


/////////////////////////////BOTONES PARA CARGAR LISTA DE FAVS Y SUBIRLA/////////////////////////////////////////////////////////////////////////////////////////
	$("ul.dropdown-menu li").click(function(){

		if($(this).attr('id')=== "save"){
			var form = '<form class="myForm" action="" method="post" name="contact_form">'+
      		'<ul><li><h2>Form</h2><span class="required_notification">* Denotes Required Field</span>'+
        	'</li><li><label for="name">Token Github:</label><input type="text" id="token" placeholder="" required/>'+
          	'<span class="form_hint">*</span></li>'+
			'<li><label for="email">Repository name:</label><input type="text" id="repository" placeholder="X-Nav-Practica-Hoteles" required/>'+
         	'<span class="form_hint">*</span></li>'+
			'<li><label for="website">File name:</label><input type="text" id="file" placeholder="fileName.json" required/>'+
          	'<span class="form_hint">*</span></li>'+
        	'<li><button class="submit" type="button">Submit Form</button></li></ul></form>';

        	$("#formJson").append(form);

        	//cuando pinchen en enviar lo subo y cierro el div
        	$("button.submit").click(function(){
        		
        		var token = $("input#token").val();
        		var repName = $("input#repository").val();
        		var fileName = $("input#file").val();

        		if($("div.ui-droppable").length>0){//si ha contenido en lista favoritos
        			//alert("hay lista que guardar");

	        		$("div.ui-droppable").each(function(index){
	        			//console.log(index+": "+$(this).find('h1').text());
	        			var favList = {};
	        			favList.name = $(this).find('h1').text();
	        			favList.hotels = [];
	        			$(this).find('p').each(function(index){
	        				//console.log($(this).text());
	        				favList.hotels.push($(this).text());
	        			});
	        			//inserto
	        			myCollection.lists.push(favList);
	        		});


	        		//paso la coleccion de elementos a json
	        		var dataFile = JSON.stringify(myCollection);
	        		console.log(dataFile);
	        	}
	        	//alert("no hay listas");

        		//alert(token+" "+repName+" "+fileName);
        		//writeRepository(token,repName,fileName);
        		$("form.myForm").remove();
        	});

		}else{
			//cuando cargue
			console.log("cargo json");
		}
	});

/////////////////////////////BOTON FORMULARIO CREAR LISTAS DE HOTELES/////////////////////////////////////////////////////////////////////////////////////////
	$("button.btn-default").click(function(){

		$("#favs").show();

		if($("input.form-control").val() !== ""){
			var collectionTitle = $("input.form-control").val();
			$("input.form-control").val("");
			var newCollection = {name : collectionTitle};
			$("#favs").append($('<div><h1>'+collectionTitle+'</h1></div>'));

			//cuando lo clickea meto su contenido en el home
			$("#favs div").last().click(function(){
				//alert($(this).find('p').length);
				$("#collectionSelected").attr('show','true');

				//alert($("#collectionSelected").attr('show'));

				$("#collectionSelected").empty();

				$("#collectionSelected").append("<h1>"+$(this).find('h1').html()+"</h1>")

				$(this).find('p').each(function(){
					$("#collectionSelected").append('<p>'+$(this).html()+'</p>');
				});
			});


		
		$('#favs div').last().droppable({
			drop: function( event, ui ) {
				//$(this).html();
				$("<p></p>").text(ui.draggable.text()).appendTo(this);
				//alert($(this).find('h1').html());
				//alert($(this).find('h1').html());
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

	}

		//hago arrastrables los elementos de la lista
		if($("#favs").find('h1').length === 1){//solo lo hago la primera vez que hay una lista
			//creo acordeon de favs
			$("#finalList").find("p").draggable({appendTo: "body",helper: "clone",scroll: true});
		}

	});

/////////////////////////////PESTAÑAS APLICACION/////////////////////////////////////////////////////////////////////////////////////////
	$(".navbar-nav li").click(function(){

		//si el boton pulsado no es el de cargar los alojados
		if($(this).attr('id')!=="menu" && $(this).attr('id')!=="download"){
			$('ul').find('li.active').removeClass("active");
			$(this).addClass("active");
		}
		
		if($(this).attr('id')==="collection"){//si gestion de hoteles

			$("#googleForm").hide();
			$("#myCarousel").hide();
			$("#desc").hide();
			$("#housedPeople").hide();
			$("#collectionSelected").hide();

			$("#map").show();
			//si ya se han cargado los hoteles mostrar formulario para favoritos
			if($("#get").attr('state') ==="clicked"){
				$("form.navbar-left").show();
				$("#finalList").show();
				$("#listHome").hide();
				$("#favs").show();
			}
			
			
				
		}else if($(this).attr('id')==="home"){//si es inicio

			$("#googleForm").hide();
			$("#favs").hide();
			$("form.navbar-left").hide();
			$("#housedPeople").hide();

			$("#map").show();
			$("#myCarousel").show();

			if($("#get").attr('state') === "clicked"){
				$("#desc").show();
				$("#finalList").hide();
				$("#listHome").show();

			}

			if($("#collectionSelected").attr('show')==='true'){

				//alert("muestro coleccion pinchada");
				if($("#collectionSelected").find('p').length>0){
					//alert($("#collectionSelected").find('p').length);
					$("#collectionSelected").show();
				}
				
			}

			//si he pinchado una lista muestro sus hoteles

		}else if($(this).attr('id')==="housed"){

			$("#favs").hide();
			$("form.navbar-left").hide();
			$("#map").hide();
			$("#myCarousel").hide();
			$("#collectionSelected").hide();
			
			if($("#get").attr('state') === "clicked"){
				//alert("quito lista hoteles");
				$("#listHome").hide();
				$("#finalList").hide();
				$("#desc").show();

				if($("#desc").attr('showed')==='true'){
					$("#googleForm").show();
				}

				//mostrar lista de alojados si se ha descargado el archivo y tiene un elemento
				if($("#housedPeople").attr("showed")==="true"){
					$("#housedPeople").show();
				}
			}
		}
	});
});