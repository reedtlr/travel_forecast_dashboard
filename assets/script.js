$(document).ready(function() {

    $(".currentWeather").hide();
    $(".fiveDay").hide();
    var storedSearches = JSON.parse(localStorage.getItem("storedSearches")) || [] ;

    //a loop to populate past searches on the page for easy access
    for (var i = 0; i < storedSearches.length; i++) {
        var addLi = $("<li>")
        var addBtn = $("<button>")
        $(addBtn).attr({"type": "button", "class": "btn btn-light", "id": storedSearches[i]})
        $(addBtn).text(storedSearches[i])
        $(addBtn).val(storedSearches[i])
        $(addLi).append(addBtn)
        $(".pastSearches").prepend(addLi)
    }

    //    onClick function to save city name to local storage and start functions to run API request 
    $("#searchBtn").click(function() {
      $(".currentWeather").show();
      $(".fiveDay").show();
      $("div").remove(".fcard") 
        var cityCurrent = $.trim($(this).siblings("input").val());
        storedSearches.push(cityCurrent)
        window.localStorage.setItem("storedSearches", JSON.stringify(storedSearches))
        var addLi = $("<li>")
        var addBtn = $("<button>")
        $(addBtn).attr({"trype": "button", "class": "btn btn-light", "id": cityCurrent})
        $(addBtn).text(cityCurrent)
        $(addLi).append(addBtn)
        $(".pastSearches").prepend(addLi)
        currentWeather(cityCurrent)
    })

    // on click function for past cities 
    $(".btn-light").click(function() {
      $(".currentWeather").show();
      $(".fiveDay").show();
      $("div").remove(".fcard")  
      var cityCurrent = $(this).val();

        currentWeather(cityCurrent)
    })

    // function to add search data after 
    function currentWeather(cityCurrent) {
        var city = cityCurrent

        // Constructing queryURL using city for current weather
        var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=fdd6f8efa4fbb992f2faddee7d45c8de";
       
        // Performing an AJAX request with the queryURL
      $.ajax({
        url: queryURL,
        method: "GET"
      })

      // After data comes back from the request
      .then(function(response) {
        

        // storing the data from the AJAX request in the results variable
        var results = response;
        var addName = $(".currentName").text(response.name + " (" + moment().format('l') + ")");
        var iconCode = response.weather[0].icon
        var iconUrl = "https://openweathermap.org/img/w/" + iconCode + ".png";
        var addIcon = $('#wicon').attr('src', iconUrl);
        $(".icon").append(addIcon)
        $(".currentName").append(addName)

        var addTemp = $(".currentTemp").text("Temperature: " + Math.round(response.main.temp) + " °F");
        $(".currentTemp").append(addTemp);

        var addHum = $(".currentHum").text("Humidity: " + response.main.humidity + " %");
        $(".currentHum").append(addHum);

        var addWs = $(".currentWs").text("Wind Speed: " + response.wind.speed + " MPH");
        $(".currentWs").append(addWs);

        var currentLat = response.coord.lat
        var currentLon = response.coord.lon
        console.log(currentLat, currentLon)
        runUv(currentLat, currentLon)
        runFiveDay(currentLat, currentLon)

    });
    }

    function runUv(currentLat, currentLon) {
        var lat = currentLat
        var lon = currentLon

         // Constructing queryURL using lat and lon for UV index
         var queryURL = "https://api.openweathermap.org/data/2.5/uvi?lat=" + lat + "&lon=" + lon + "&units=imperial&appid=fdd6f8efa4fbb992f2faddee7d45c8de";
       
         // Performing an AJAX request with the queryURL
       $.ajax({
         url: queryURL,
         method: "GET"
       })
 
       // After data comes back from the request
       .then(function(response) {
         
         var addUv = $("#uvIndex").text(response.value); 
         $("#uvIndex").append(addUv);

         if (response.value <= 3) {
             var addColor = $("#uvIndex").css("background-color", "green");
             addColor.css("color", "white");
             $(".uvIndex").append(addColor);
         } else if (response.value <= 7) {
            var addColor = $("#uvIndex").css("background-color", "yellow");
            addColor.css("color", "black");
            $("#uvIndex").append(addColor);
         } else {
            var addColor = $("#uvIndex").css("background-color", "red");
            addColor.css("color", "white");
            $("#uvIndex").append(addColor);
         }
 

       })
      }

       function runFiveDay(currentLat, currentLon) {
        var lat = currentLat
        var lon = currentLon

           // Constructing queryURL using lat and lon for five day forecast
           var queryURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&units=imperial&appid=fdd6f8efa4fbb992f2faddee7d45c8de";

           // Performing an AJAX request with the queryURL
         $.ajax({
           url: queryURL,
           method: "GET"
         })
   
         // After data comes back from the request
         .then(function(response) {
  
          
          for (var i = 0; i < 5; i++) {           
            var j = i + 1
            var dateFancy = moment().add(j, 'days').format('l')
            var divCol = $("<div>");
          divCol.addClass("col-3 mb-1 fcard");
          divCol.attr("#del")
          $("#fiveDayList").append(divCol);

          var divCard = $("<div>");
          divCard.addClass("card text-white bg-primary");
          divCard.css("max-width: 18rem");
          divCol.append(divCard);

          var divBody = $("<div>");
          divBody.addClass("card-body");
          divCard.append(divBody);
            
          var head2 = $("<p>");
          head2.text(dateFancy);
          divBody.append(head2);

          var imgIcon = $("<img>");
          var iconCode = response.daily[i].weather[0].icon
          var iconUrl = "https://openweathermap.org/img/w/" + iconCode + ".png";
          imgIcon.attr({"id": "wicon", "src": iconUrl, "alt": "weather icon", "class": "icon"});
          divBody.append(imgIcon);

          var pWeather = $("<p>");
          pWeather.text("Temp: " + response.daily[i].temp.day + " °F")
          divBody.append(pWeather);

          var pHumidity = $("<p>");
          pHumidity.text("Hum: " + response.daily[i].humidity + "%")
          divBody.append(pHumidity);
            
            
          }

          




          })  
       }
       $(document).ajaxError(function(){
        alert("there are no results for that city, please try a new destination");
      });
});