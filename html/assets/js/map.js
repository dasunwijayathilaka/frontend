/*
Author       : Dreamguys
Template Name: Doccure - Bootstrap Template
Version      : 1.3
*/

google.maps.visualRefresh = true;
var slider, infowindow = null;
var bounds = new google.maps.LatLngBounds();
var map, current = 0;
var locations =[{
	"id":01,
	"doc_name":"Audi A6 1.8 TFSI 201",
	"address":"Alabama, USA",
	"amount":"$350",
	"lat":53.470692,
	"lng":-2.220328,
	"icons":"default",
	"total_review":"Fixed",
	"image":'assets/img/car-img.jpg'
	}, {
		
	"id":02,
	"doc_name":"Amsterdam",
	"address":"Newyork, USA",
	"amount":"$50",
	"lat":53.469189,
	"lng":-2.199262,
	"icons":"icon2",
	"total_review":"Fixed",
	"image":'assets/img/amsterdam.jpg'
	}, {
	"id":03,
	"doc_name":"Fresh organic herbs",
	"address":"Georgia, USA",
	"amount":"$100",
	"lat":53.468665,
	"lng":-2.189269,
	"icons":"icon3",
	"total_review":"Fixed",
	"image":'assets/img/foodhabits.jpg'
	}, {
	"id":04,
	"doc_name":"Light Wool Navy Blazer",
	"address":"Louisiana, USA",
	"amount":"$150",
	"lat":53.463894,
	"lng":-2.177880,
	"icons":"icon4",
	"total_review":"Fixed",
	"image":'assets/img/fashion.jpg'
	}, {
	"id":05,
	"doc_name":"Easy Ways To Learn",
	"address":"Michigan, USA",
	"amount":"$50",
	"lat":53.460359,
	"lng":-2.210394,
	"icons":"icon7",
	"total_review":"Fixed",
	"image":'assets/img/education.jpg'
	}, {
	"id":06,
	"doc_name":"Joyful dog",
	"address":"Texas, USA",
	"amount":"$100",
	"lat":53.463906,
	"lng":-2.213271,
	"icons":"icon5",
	"total_review":"Fixed",
"image":'assets/img/petanimal.jpg'	
	}, {
	"id":07,
	"doc_name":"Apple iPhone 6 16GB 4G LTE",
	"address":"Kansas, USA",
	"amount":"$450",
	"lat":53.468974,
	"lng":-2.210661,
	"icons":"icon6",
	"total_review":"Fixed",
	"image":'assets/img/apple-phone.jpg'
	}
	];

var icons = {
  'default':'assets/img/icons/marker.png',
  'icon2':'assets/img/icons/marker1.png',
  'icon3':'assets/img/icons/marker2.png',
  'icon4':'assets/img/icons/marker3.png',
  'icon5':'assets/img/icons/marker4.png',
  'icon6':'assets/img/icons/marker5.png',
  'icon7':'assets/img/icons/marker6.png',
  'icon8':'assets/img/icons/marker7.png'
  
};

function show() {
    infowindow.close();
  if (!map.slide) {
    return;
  }
    var next, marker;
    if (locations.length == 0 ) {
       return
     } else if (locations.length == 1 ) {
       next = 0;
     }
    if (locations.length >1) {
      do {
        next = Math.floor (Math.random()*locations.length);
      } while (next == current)
    }
    current = next;
    marker = locations[next];
    setInfo(marker);
    infowindow.open(map, marker);
}

function initialize() {
    var bounds = new google.maps.LatLngBounds();
    var mapOptions = {
        zoom: 14,
		center: new google.maps.LatLng(53.470692, -2.220328),
        scrollwheel: false,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
		
    };
  
     map = new google.maps.Map(document.getElementById('map'), mapOptions);
    map.slide = true;

    setMarkers(map, locations);
    infowindow = new google.maps.InfoWindow({
        content: "loading..."
    });
    google.maps.event.addListener(infowindow, 'closeclick',function(){
       infowindow.close();
    });
    slider = window.setTimeout(show, 3000);
}

function setInfo(marker) {
  var content = 
'<div class="profile-widget" style="width: 276px; background: url(' + marker.image + '); position: relative; padding: 90px 0; background-repeat: no-repeat; background-size: cover; display: inline-block; border-radius: 10px; ">'+
	
	'<div class="pro-content">'+
		'<h3 class="title">'+
			'<a href="javascript:void(0)">' + marker.doc_name + '</a>'+			
		'</h3>'+
				
		'<ul class="available-info">'+
			'<li class="mapaddress"><i class="fas fa-map-marker-alt me-2"></i> ' + marker.address + ' </li>'+
			'<li class="map-amount">' + marker.amount + '<span class="d-inline-block average-rating"> (' + marker.total_review + ')</span>'+'</li>' + 
		'</ul>'+
	'</div>'+
'</div>';
  infowindow.setContent(content);
}

function setMarkers(map, markers) {
  for (var i = 0; i < markers.length; i++) {
    var item = markers[i];
    var latlng = new google.maps.LatLng(item.lat, item.lng);
    var marker = new google.maps.Marker({
        position: latlng,
        map: map,
        doc_name: item.doc_name,
        address: item.address,
        next_available: item.next_available,
        amount: item.amount,
        profile_link: item.profile_link,
        total_review: item.total_review,
        animation: google.maps.Animation.DROP,
        icon: icons[item.icons],
        image: item.image
        });
        bounds.extend(marker.position);
        markers[i] = marker;
        google.maps.event.addListener(marker, "click", function () {
            setInfo(this);
            infowindow.open(map, this);
            window.clearTimeout(slider);
        });
    }
    map.fitBounds(bounds);
  google.maps.event.addListener(map, 'zoom_changed', function() {
    if (map.zoom > 16) map.slide = false;
  });
}

google.maps.event.addDomListener(window, 'load', initialize);