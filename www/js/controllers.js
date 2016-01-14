angular.module('appControllers', [])

.controller('HomeCtrl', ['$scope', '$rootScope', '$cordovaCamera', '$cordovaGeolocation', function($scope, $rootScope, $cordovaCamera, $cordovaGeolocation) {
  var photoCounter = 0;
	$scope.showsCamBig = true;
	$scope.ready = false;
	$scope.images = [];

	$rootScope.$watch('appReady.status', function() {
		console.log('watch fired '+$rootScope.appReady.status);
		if($rootScope.appReady.status) $scope.ready = true;
	});
/*//for select image from photo gallery
	$scope.selImages = function() {

		var options = {
			quality: 50,
			destinationType: Camera.DestinationType.FILE_URI,
			sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
			targetWidth: 200,
			targetHeight: 200
		};

		$cordovaCamera.getPicture(options).then(function(imageUri) {
			console.log('img', imageUri);
			$scope.images.push(imageUri);

		}, function(err) {
		// error
		});

	};
	*/

	$scope.getPhoto = function() {
    $cordovaCamera.getPicture().then(function(imageURI) {
      //alert(imageURI);
      //$scope.lastPhoto = imageURI;
      //$scope.imgURI = $scope.lastPhoto;
			$scope.showsCamBig = false;
			$scope.showsCamSmall = true;
			$scope.showsEmailSmall = true;
			getLocation();
			$scope.images.push(imageURI);
    }, function(err) {
      console.err(err);
    }, {
      quality: 75,
      targetWidth: 40,
      targetHeight: 40,
      saveToPhotoAlbum: false
    });
  };

	function getLocation(){
		var vm = this;
				vm.myLocation = "";
				var geocoder = new google.maps.Geocoder();

				var geoSettings = {frequency: 1000, timeout: 30000, enableHighAccuracy: false};

				var geo = $cordovaGeolocation.getCurrentPosition(geoSettings);

				geo.then(function (position) {

								var lat = position.coords.latitude,
										long = position.coords.longitude,
										LatLng = new google.maps.LatLng(lat, long);
								//alert(LatLng);
								showLocation(LatLng);
						},
						function error(error) {
								alert('code: ' + error.code + '\n' +
								'message: ' + error.message + '\n');
						}
				);

		function showLocation(LatLng) {
				geocoder.geocode({'latLng': LatLng}, function (results, status) {
						if (status == google.maps.GeocoderStatus.OK) {
								vm.myLocation = results[0].formatted_address;
								//alert(vm.myLocation);
								var pos = document.getElementById('currentPosition');
								pos.innerHTML = vm.myLocation
						}
				})
		};
	}

  $scope.test = function(lat, lng) {
		alert("OK");
			var geocoder;
			geocoder = new google.maps.Geocoder();
        var latlng = new google.maps.LatLng(lat, lng);
        geocoder.geocode({'latLng': latlng}, function(results, status) {
          if (status == google.maps.GeocoderStatus.OK) {
          console.log(results)
            if (results[1]) {
             //formatted address
             //alert(results[0].formatted_address)
                var address = results[0].formatted_address;
            //find country name
                 for (var i=0; i<results[0].address_components.length; i++) {
                for (var b=0;b<results[0].address_components[i].types.length;b++) {

                //there are different types that might hold a city admin_area_lvl_1 usually does in come cases looking for sublocality type will be more appropriate
                    if (results[0].address_components[i].types[b] == "administrative_area_level_1") {
                        //this is the object you are looking for
                        city= results[0].address_components[i];
                        break;
                    }
                }
            }
            //city data
            //alert(city.short_name + " " + city.long_name)


            } else {
              alert("No results found");
            }
          } else {
            alert("Geocoder failed due to: " + status);
          }
        });
				alert(address);
    }

		$scope.sendEmail = function() {
        var bodyText = "<h2>Look at this images!</h2>";
        if (null != $scope.images) {
            var images = [];
            var savedImages = $scope.images;
            for (var i = 0; i < savedImages.length; i++) {
                images.push("" + $scope.urlForImage(savedImages[i]));
                images[i] = images[i].replace('file://', '');
            }

            window.plugin.email.open({
                to:          ["avilavi44@gmail.com"], // email addresses for TO field
                cc:          Array, // email addresses for CC field
                bcc:         Array, // email addresses for BCC field
                attachments: images, // file paths or base64 data streams
                subject:    "Just some images", // subject of the email
                body:       bodyText, // email body (for HTML, set isHtml to true)
                isHtml:    true, // indicats if the body is HTML or plain text
            }, function () {
                console.log('email view dismissed');
            },
            this);
        }
			}

}])
