        am4core.ready(function() {

            // Themes begin
            am4core.useTheme(am4themes_dataviz);
        am4core.useTheme(am4themes_animated);
        // Themes end
        
        var availableCountries = ["GH", "CG", "NG", "FR", "US"];
        
        var selectedPolygon;
        var userCountryId;
        var mapChart;
        var continentsSeries;
        var countriesSeries;
        var nextButton;
        var slider;
        var mainContainer;
        var flagContainer;
        var colorSet = new am4core.ColorSet();
        var heartAnimation;
        var flag;
        var countryName;
        
        // detect user country
        var ds = new am4core.DataSource();
        ds.url = "https://services.amcharts.com/ip/?v=xz6Z";
ds.events.on("ended", function(ev) {
  if (ev.target.data) {
            userCountryId = ev.target.data.country_code;
        }
      });
      
      ds.load();
      
      ds.events.on("ended", init);
      
function init() {
            mainContainer = am4core.create("chartdiv", am4core.Container);
        mainContainer.background.fillOpacity = 1;
        mainContainer.background.fill = am4core.color("#313950");
        mainContainer.width = am4core.percent(100);
        mainContainer.height = am4core.percent(100);
        mainContainer.preloader.disabled = true;
      
        slider = mainContainer.createChild(am4core.Slider);
        slider.isMeasured = false;
        slider.background.fillOpacity = 0.15;
      
        slider.x = am4core.percent(50);
        slider.y = am4core.percent(90);
        slider.start = 0;
        slider.horizontalCenter = "middle";
        slider.verticalCenter = "middle";
        slider.width = 300;
        slider.zIndex = 100;
        slider.background.fillOpacity = 0.15;
      
        slider.startGrip.background.fillOpacity = 0.8;
        slider.startGrip.background.fill = am4core.color("#0975da");
        slider.startGrip.background.stroke = am4core.color("#0975da");
        slider.startGrip.background.states.getKey("hover").properties.fill = am4core.color("#0975da");
      
        var downState =   slider.startGrip.background.states.getKey("down");
        downState .properties.fill = am4core.color("#0996f2");
      
      
        slider.events.on("rangechanged", handleSlider);
      
        var triangle = new am4core.Triangle();
        triangle.width = 8;
        triangle.height = 10;
        triangle.fill = am4core.color("#ffffff");
        triangle.direction = "right";
        triangle.valign = "middle";
        triangle.align = "center";
        triangle.dx = 1;
      
        nextButton = mainContainer.createChild(am4core.Button);
        nextButton.horizontalCenter = "middle";
        nextButton.verticalCenter = "middle";
        nextButton.padding(0, 0, 0, 0);
        nextButton.background.cornerRadius(25, 25, 25, 25);
        nextButton.x = am4core.percent(80);
        nextButton.y = am4core.percent(90);
        nextButton.width = 40;
        nextButton.height = 40;
        nextButton.zIndex = 101;
        nextButton.icon = triangle;
        nextButton.background.fillOpacity = 0;
        nextButton.background.states.getKey("hover").properties.fill = am4core.color("#0975da");
        nextButton.background.stroke = am4core.color("#0975da");
      
        nextButton.background.states.getKey("down").properties.fill = am4core.color("#0975da");
      
        var label = mainContainer.createChild(am4core.Label)
        label.text = "next";
        label.x = am4core.percent(80);
        label.y = am4core.percent(90);
        label.verticalCenter = "middle";
        label.horizontalCenter = "right";
        label.dx = -25;
        label.dy = -2;
        label.fill = am4core.color("#ffffff");
      
  label.events.on("over", function() {
            nextButton.isHover = true;
        });
  label.events.on("out", function() {
            nextButton.isHover = false;
        });
      
        nextButton.events.on("hit", handleNext);
        label.events.on("hit", handleNext);
      
        flagContainer = mainContainer.createChild(am4core.Container);
        flagContainer.horizontalCenter = "middle";
        flagContainer.hiddenState.properties.dy = -180;
        flagContainer.x = am4core.percent(50);
        flagContainer.y = 30;
        flagContainer.layout = "horizontal";
      
        flag = flagContainer.createChild(am4core.Image);
        flag.width = 50;
        flag.height = 50;
      
        countryName = flagContainer.createChild(am4core.Label);
        countryName.marginLeft = 15;
        countryName.fontSize = 25;
        countryName.x = 100;
        countryName.valign = "middle";
        countryName.fill = am4core.color("#ffffff");
      
        createMap();
      }
      
      
function createMap() {
            // MAP CHART
            mapChart = mainContainer.createChild(am4maps.MapChart);
        mapChart.zIndex = -1;
        mapChart.maxZoomLevel = 2000;
        mapChart.projection = new am4maps.projections.Mercator();
        mapChart.seriesContainer.events.disableType("doublehit");
        mapChart.chartContainer.background.events.disableType("doublehit");
      
        mapChart.deltaLongitude = -11;
        mapChart.seriesContainer.draggable = false;
        mapChart.geodataSource.url = "//www.amcharts.com/lib/4/geodata/json/continentsHigh.json";
        mapChart.seriesContainer.resizable = false;
        mapChart.mouseWheelBehavior = "none";
      
        continentsSeries = mapChart.series.push(new am4maps.MapPolygonSeries());
        continentsSeries.useGeodata = true;
        continentsSeries.exclude = ["antarctica"];
        continentsSeries.mapPolygons.template.fill = am4core.color("#283047");
        continentsSeries.mapPolygons.template.strokeOpacity = 0;
        continentsSeries.toBack();
      
        countriesSeries = mapChart.series.push(new am4maps.MapPolygonSeries());
        countriesSeries.useGeodata = true;
        // countriesSeries.geodata = am4geodata_worldIndiaHigh;
        countriesSeries.exclude = ["AQ"];
        countriesSeries.mapPolygons.template.visible = false;
        countriesSeries.mapPolygons.template.hiddenState.properties.opacity = 0;
      
        countriesSeries.geodataSource.url = "//www.amcharts.com/wp-content/uploads/assets/maps/worldCustomHigh.json";
        countriesSeries.mapPolygons.template.fill = am4core.color("#0975da");
        countriesSeries.mapPolygons.template.strokeOpacity = 0;
      
  countriesSeries.geodataSource.events.on("ended", function() {
            setTimeout(function () {
                handleNext(userCountryId);
            }, 500)
        });
      }
      
function handleNext(countryId) {

            flagContainer.hide(1000);

        if (availableCountries.indexOf(countryId) == -1) {
            userCountryId = availableCountries[Math.floor(Math.random() * availableCountries.length)];
        }
      
  if (slider.start > 0) {
    var animation = slider.animate({property: "start", to: 0 }, 500);
    animation.events.on("animationended", function() {
            setTimeout(function () {
                zoomToSelectedPolygon()
            }, 100);
        });
      }
  else {
            zoomToSelectedPolygon();
        }
      }
      
function zoomToSelectedPolygon() {

  if (selectedPolygon) {
            selectedPolygon.hide();
        }
      
        selectedPolygon = countriesSeries.getPolygonById(userCountryId);
        selectedPolygon.hide(0);
        selectedPolygon.opacity = 0;
        selectedPolygon.defaultState.properties.opacity = 1;
        selectedPolygon.toFront();
      
        var showAnimation = selectedPolygon.show(1000);
      
  showAnimation.events.on("animationended", function() {

            flag.href = "//www.amcharts.com/wp-content/uploads/assets/flags/" + userCountryId.toLowerCase() + ".svg";
        countryName.text = selectedPolygon.dataItem.dataContext.name;
    
    setTimeout(function() {
            flagContainer.show();
        }, 1000)
    
        selectedPolygon.polygon.validate();
        var w = selectedPolygon.polygon.bbox.width;
        var h = selectedPolygon.polygon.bbox.height;
    
        var x = selectedPolygon.polygon.bbox.x + w / 2;
        var y = selectedPolygon.polygon.bbox.y + h / 2;
    
        w = Math.max(w, h);
    
    var path = am4core.path.moveTo({x: x, y: y + w / 3 });
    path += am4core.path.cubicCurveTo({x: x, y: y - w / 4 }, {x: x - w / 2 - w / 4, y: y - w / 3 }, {x: x - w / 8, y: y - w / 2 });
    path += am4core.path.cubicCurveTo({x: x, y: y + w / 3 }, {x: x + w / 8, y: y - w / 2 }, {x: x + w / 2 + w / 4, y: y - w / 3 });
    
        var points = am4core.path.pathToPoints(path, 300);
    
        var middleLatitude = mapChart.zoomGeoPoint.latitude + (selectedPolygon.latitude - mapChart.zoomGeoPoint.latitude) / 2;
        var middleLongitude = mapChart.zoomGeoPoint.longitude + (selectedPolygon.longitude - mapChart.zoomGeoPoint.longitude) / 2;
    
        mapChart.zoomEasing = am4core.ease.sinOut;
    var zoomOutAnimation = mapChart.zoomToGeoPoint({latitude: middleLatitude, longitude: middleLongitude }, 2, true);
    
    zoomOutAnimation.events.on("animationended", function() {
            mapChart.zoomEasing = am4core.ease.cubicInOut;
        mapChart.zoomToMapObject(selectedPolygon, 400 / Math.max(w, h) * mapChart.scaleRatio, true, 1500);
        selectedPolygon.polygon.points;
        selectedPolygon.polygon.morpher.morphToSingle = true;
        var animation;
      if (points) {
            animation = selectedPolygon.polygon.morpher.morphToPolygon([[points]]);
        }
      else {
            animation = selectedPolygon.polygon.morpher.morphToCircle();
        }
  
  
        animation.stop();
      })
    })
  }
  
function handleSlider() {
  if (selectedPolygon) {
            selectedPolygon.polygon.morpher.morphProgress = slider.start;

        if (slider.start >= 0.999) {
      if (!heartAnimation) {
            heartBeet(mapChart.zoomLevel / 1000);
        }
      }
    else {
      if (heartAnimation) {
            heartAnimation.kill();
        heartAnimation = undefined;
      }
    }
  }
}

function heartBeet(scale) {
            heartAnimation = mapChart.animate({ property: "scale", to: 1 + scale / 7 }, 200);
        heartAnimation.events.on("animationended", function() {
            heartAnimation = mapChart.animate([{ property: "scale", to: 1 }], 100);
        heartAnimation.events.on("animationended", function() {
            setTimeout(function () { heartBeet(scale) }, 500)
        })
      })
    }
    
    }); // end am4core.ready()
