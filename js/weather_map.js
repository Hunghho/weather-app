(function(){
    "use strict";
    //Mapbox api
    mapboxgl.accessToken = keys.mapbox;
    let map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/hunghoh/cldand30g007101pc3hy7zluw',
        zoom: 11,
        center: [-98.25617, 29.56699]
    });
    // marker
    let marker = new mapboxgl.Marker({ color: 'black', rotation: 45,
        draggable: true
    });
    //get weather data from dragged marker
    function onDragEnd(){
        const lngLat = marker.getLngLat();
        console.log(lngLat);
        $.get('https://api.openweathermap.org/data/2.5/forecast', {
            lat: lngLat.lat,
            lon: lngLat.lng,
            appid: keys.weatherMap,
            units: 'imperial'
        }).done(function(data) {
            let newCity = `<span class='d-flex align-items-end ms-auto text-white city'>Current Location: ${data.city.name}</span>`
            $('.city').replaceWith(newCity);
            foreCast(data);
        })

    }
    marker.on('dragend', onDragEnd);

    // add marker on click
    function add_marker (event) {
        const coordinates = event.lngLat;
        marker.setLngLat(coordinates).addTo(map);

        $.get('https://api.openweathermap.org/data/2.5/forecast', {
            lat: coordinates.lat,
            lon: coordinates.lng,
            appid: keys.weatherMap,
            units: 'imperial'
        }).done(function(data) {
            let newCity = `<span class='d-flex align-items-end ms-auto text-white city'>Current Location: ${data.city.name}</span>`
            $('.city').replaceWith(newCity);
            foreCast(data);
        })

    }
    map.on('click', add_marker);

    // button function to get search value and update the forecast

    $('.button').on('click', function () {
        let searchResult = $('#search').val();
        // replace the current city
        let newCity = `<span class='d-flex align-items-end ms-auto text-white city'>Current Location: ${searchResult}</span>`
        $('.city').replaceWith(newCity);
        // geocode location from search result
        geocode(searchResult, keys.mapbox).then(function(result) {

            map.flyTo(
                {center: result, essential: true}
            )
            marker.setLngLat(result)
                .addTo(map)
            // getting weather data from search result
            $.get('https://api.openweathermap.org/data/2.5/forecast', {
                lat: result[1],
                lon: result[0],
                appid: keys.weatherMap,
                units: 'imperial'
            }).done(function(data) {
                foreCast(data);
            });
        });
    })

    // Weather map api page load
    $.get('https://api.openweathermap.org/data/2.5/forecast', {
        lat: 29.4252,
        lon: -98.4916,
        appid: keys.weatherMap,
        units: 'imperial'
    }).done(function(data) {
        for (let i = 0; i < data.list.length; i += 8) {
            console.log(data);
        }
        foreCast(data);
    });

    // append to html
    function foreCast(data){
        let content = '';
        for (let i = 0 ; i < data.list.length ; i += 8){
            let newDate = new Date(data.list[i].dt * 1000);
            let sunrise = new Date(data.city.sunrise * 1000);
            let sunset = new Date(data.city.sunset * 1000);
            content += `<div class='card m-2 shadow-lg p-3 mb-5 bg-body-tertiary rounded' style="width: 18rem;">
                   <div class="card-header text-center">${newDate.toLocaleDateString("en-US", {weekday: 'long'})}<br>${newDate.toLocaleDateString("en-US")}</div>
                   <div class="card-body">
                   <ul class="p-0">
                   <li class="list-group-item text-center"><i class="fa-solid fa-temperature-three-quarters"></i> ${data.list[i].main.temp_min}${String.fromCharCode(176)}F / ${data.list[i].main.temp_max}${String.fromCharCode(176)}F</li>
                   <li class="list-group-item text-center"><img alt="icon" src='http://openweathermap.org/img/w/${data.list[i].weather[0].icon}.png'/></li>
                   <hr>
                   <li class="list-group-item">Description: ${data.list[i].weather[0].description}</li>
                   <li class="list-group-item">Humidity: ${data.list[i].main.humidity}</li>
                   <li class="list-group-item"><i class="fa-solid fa-wind"></i> ${data.list[i].wind.speed}</li>
                   <li class="list-group-item">Pressure: ${data.list[i].main.pressure}</li>
                   <hr>
                   <li class="list-group-item">Sunrise: ${sunrise.toLocaleTimeString("en-US")}</li>
                   <li class="list-group-item">Sunset: ${sunset.toLocaleTimeString('en-US')}</li>
                   </ul>
                   </div>
                   </div>`
        }
        $('#weatherContent').html(content);
    }


})();