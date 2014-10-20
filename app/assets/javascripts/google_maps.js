  var map;
  var infowindow;
  var geocoder;
  var markers = [];
  var listNames = [];

  function initialize() {
    map = new google.maps.Map(document.getElementById('map-canvas'), {
      center: new google.maps.LatLng(37.6, -95.665),
      zoom: 4
    });
    infowindow = new google.maps.InfoWindow(); //may need to move to search function
  }

  //Makes the search run if Enter is hit inside textbox
  function isEnter(){
    if(event.keyCode == 13){
      search();
    }
  }

  //Starts the search function using whatever is used in the 'address' textbox
  function search(){
    console.log('search function')
    for(var i = 0; i < markers.length; i++){
      markers[i].setMap(null);
    }
    markers = [];
    listNames = [];
    geocoder = new google.maps.Geocoder();
    var address = document.getElementById('address').value; //sets variable to html<input> of the same name
    geocoder.geocode( { 'address': address}, function(results, status) {
      console.log('geocoding function')
      if (status == google.maps.GeocoderStatus.OK) {
        console.log('geocoding function ok')
        map.setCenter(results[0].geometry.location);
        var marker = new google.maps.Marker({
            map: map,
            icon: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png',
            position: results[0].geometry.location
        });
        console.log('adding to markers')
        markers.push(marker);
        var request = {
          location: map.getCenter(),
          radius: 500,    //radius of the search around the location
          query: 'coffee' //the text query being issued to the Goog
        };
        map.setZoom(11);
        var service = new google.maps.places.PlacesService(map);
        service.textSearch(request, intermediate);
        console.log('calling callback')
      } else {
        alert('Geocode was not successful for the following reason: ' + status);
      }
    });
    function intermediate(results, status) {
    console.log('callback')
    if (status == google.maps.places.PlacesServiceStatus.OK) {
      for (var i = 0; (i < results.length) && (i < 10); i++) {        //Modify to only get <10 results with && operator
        createMarker(results[i]);
        console.log('calling createMarkers')
      }
    }
    makeList();
  }
  }

  function makeList(){
    console.log('makeList function')
    if(document.getElementById("container") != null) {
      document.getElementById("container").remove();
    }
    var listContainer = document.createElement("div");
    listContainer.setAttribute("id", "container");
    document.getElementsByTagName("body")[0].appendChild(listContainer);
    var listElement = document.createElement("ol"); //lol freaking typo OP
    listElement.setAttribute("id", "theList");
    listContainer.appendChild(listElement);
    for(var i = 0; i < 10; i++){
      var listItem = document.createElement("li");
      listItem.innerHTML = listNames[i].name + ": " + listNames[i].formatted_address;
      listItem.addEventListener("click", function(){
        
      });
      listElement.appendChild(listItem);
    }
  }



  function createMarker(place) {
    console.log('markers')
    var placeLoc = place.geometry.location;
    var marker = new google.maps.Marker({
      map: map,
      position: place.geometry.location
    });
    markers.push(marker);
    listNames.push(place);
    google.maps.event.addListener(marker, 'click', function() {
      infowindow.setContent(place.name);
      infowindow.open(map, this);
    });
  }




// function loadScript() {
// var script = document.createElement('script');
// script.type = 'text/javascript';
// script.src = 'https://maps.googleapis.com/maps/api/js?v=3.exp&' +
//       'callback=initialize';
//   document.body.appendChild(script);
// }

window.onload=initialize;
