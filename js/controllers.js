angular.module('App.controllers', ['Camera'])
    //register page

    .controller('RegistCtrl', function($scope, $http, $localStorage, $location) {
        $scope.lstorage = $localStorage;
        $scope.submitForm = function(){

            var data = {

                password:$scope.lstorage.user.password,
                email:$scope.user.email,
                first:$scope.lstorage.user.first,
                last:$scope.user.last,
                zip:$scope.user.zip,
               handed:$scope.lstorage.hand
            }

            console.log(data);
        $http({method:'post',params:data,url: 'https://backend.targetsgolf.com/api/1/user/'+ $scope.lstorage.user.userId})
                .success(function(data,status,headers, config) {

                    if ((data.code === 400)&&(data.reason === "invalid user")) {

                       $scope.message = "Name already taken. Please try another.";
                        $location.path( "/register" );

                    }else if((data.code === 400)&&(data.reason === "invalid password")){
                        $scope.message = "invalid password,more than 5 characters";
                        $location.path( "/register" );

                    }else if((data.code === 400)&&(data.reason === "invalid zip")){
                        $scope.message = "invalid zip";
                        $location.path( "/register" );

                    }
                    else{
                        $("#wait").fadeIn();
                   $location.path( "/round" );
               }

                }).error(function(data, status, headers, config) {
                    $scope.status = status;
                    alert("error")

                })
        }


    })
    .controller('mainCtrl', function($scope, $localStorage, $location) {
        $scope.lstorage = $localStorage;

        if ($scope.lstorage.user.userId === '' || $scope.lstorage.user.password === '') {
            $location.path( "/" );
        } else
        {
            $location.path( "/round" );
        }

    })
    .controller('loginCtrl', function($scope, $http, $localStorage,authentication, $location) {
        $scope.lstorage = $localStorage;
        $scope.lstorage.user.userId = $scope.user.userId;
        $scope.lstorage.user.password = $scope.user.password;

        $scope.login = function (user_name, password) {
            if ( user_name === $scope.lstorage.user.userId && password === $scope.lstorage.user.password) {
                authentication.isAuthenticated = true;
                authentication.user_name = { user_name: $scope.lstorage.user.userId };
                $location.url("/");
            }
            else {
                    $scope.loginError = "Invalid username/password combination";
                };

            console.log(data);
            $http({method:'post',params:data,url: 'https://backend.targetsgolf.com/api/1/user/'+ $scope.lstorage.user.userId})
                .success(function(data,status,headers, config) {

                    if ((data.code === 400)&&(data.reason === "invalid user")) {

                        $scope.message = "Invalid Name";
                        $location.path( "/login" );

                    }else if((data.code === 400)&&(data.reason === "invalid password")){
                        $scope.message = "invalid password";
                        $location.path( "/login" );

                    }
                    else{
                        $("#wait").fadeIn();
                        $location.path( "/round" );
                    }

                }).error(function(data, status, headers, config) {
                    $scope.status = status;
                    alert("error")

                })
        }
  })
    .controller('RoundCtrl', function ($scope,$http,geolocation, $localStorage,$sessionStorage,$location) {
        $scope.lstorage = $localStorage;
        $scope.sstorage = $sessionStorage;
        $scope.sstorage.start = new Date().toUTCString();
        $scope.coords = geolocation.getLocation().then(function(position){
            $scope.coords.lat=position.coords.latitude;
            $scope.coords.long=position.coords.longitude;
            $http.get('https://backend.targetsgolf.com/api/1/courses?latitude=' + $scope.coords.lat + '&longitude=' + $scope.coords.long + '&range=15&limit=100')
            .success(function(data){
                    $scope.results = data;


                })
             .error(function(){
                    $("#courseGolf").hide();
                    $("#zip").fadeIn();


                })
        })


        $scope.setZip = function() {
            $scope.course_zip = $scope.zip.value;
            $http.get('https://backend.targetsgolf.com/api/1/courses?zip=' + $scope.course_zip + '&range=15&limit=100')
            .success(function(data){
                $scope.results = data;
                console.log(data);
            })

       }
       $scope.zipShow = function(){
           $("#zip").fadeIn();

       }
        $scope.zipHide = function(){
            $("#zip").fadeOut();

        }
        $scope.hideThis=function(){
            $("#select").hide();
            $("#courseGolf").show();
        }
        $scope.hideThat=function(){
            $("#select").hide();
            $("#pra").show();
        }
        $scope.getCourseDetails = function(){
            console.log($scope.selectedCourse);
           $scope.sstorage.Course = $scope.selectedCourse.course_name;
            $scope.sstorage.Course_par = $scope.selectedCourse.course_par;
            $http.get('https://backend.targetsgolf.com/api/1/course/'+ $scope.selectedCourse.course_id)
                .success(function(courseData){
                    console.log(courseData);
                    $scope.courseData=courseData;

                })

        }
        $scope.getTeeDetail = function(){
            console.log($scope.selectedTee);
            $scope.sstorage.tee = $scope.selectedTee;
            $("#submit").show();
        }
        if (!$scope.lstorage.clubs) {
            $scope.lstorage.clubs=[
                {value:"Driver",check: false },
                {value:"3W",check: false},
                {value:"5W",check: false},
                {value:"18\u00B0",check: false},
                {value:"21\u00b0",check: false},
                {value:"3",check: false},
                {value:"4",check: false},
                {value:"5",check: false},
                {value:"6",check: false},
                {value:"7",check: false},
                {value:"8",check: false},
                {value:"9",check: false},
                {value:"52\u00B0",check: false},
                {value:"54\u00b0",check: false},
                {value:"56\u00B0",check: false},
                {value:"58\u00b0",check: false},
                {value:"60\u00B0",check: false},
                {value:"64\u00b0",check: false},
                {value:"PW",check: false},
                {value:"Putter",check: false}
            ]
        }
        $scope.clubChange = function(club){
            console.log($scope.clubs);
            var checkedClubs = $scope.lstorage.clubs.filter(function (club) { return club.check; });
            $scope.clubCount = checkedClubs.length;
            if($scope.clubCount === 15){
                alert("14 is OK");
                club.check = false;
                $scope.clubCount--;
            }


        }
        $scope.showSubmit = function(){

            $("#submit").show();

        }
        $scope.onSubmit = function(){
            $scope.sstorage.type = $scope.sele;
            $scope.sstorage.RangeCourse=$scope.Range;
            if($scope.sele === "Golf Course"){
                $location.path( "/display" );

            }else{
                $location.path( "/practice" );

            }
        }

    })
    .controller('settingCtrl',function ($scope,$sessionStorage,$location) {
        $scope.sstorage = $sessionStorage;

        $scope.onSubmit = function(){
            $scope.sstorage.ball= $scope.balls;
            $scope.sstorage.homeCourse= $scope.homeCourse;
            $scope.sstorage.pro= $scope.pro;
            $scope.sstorage.putterB= $scope.putterB;
            $scope.sstorage.ironB= $scope.ironB;
            $scope.sstorage.wedgesB= $scope.wedgesB;
            $scope.sstorage.woodsB= $scope.woodsB;
            $scope.sstorage.driverB= $scope.driverB;

        }

    })
    .controller('practiceCtrl',function ($scope, $localStorage,$sessionStorage,$location){
        $scope.lstorage = $localStorage;
        $scope.sstorage = $sessionStorage;
        $scope.sstorage.club="";
        $scope.hole= 0;
        $scope.strokesN = 1;
        $scope.shotType="Approach";
        $scope.sstorage.approachXY=[];
        $scope.hideClubs=function(){
            $("#clubs").fadeOut();
            $scope.strokesN = 1;
            if(($scope.sstorage.club === "3W")||($scope.sstorage.club === "5W")||($scope.sstorage.club === "Driver")){
                $scope.showApp();
            } else{
               $scope.showPit()
            }
    }

        $scope.nextShot = function(){
           $scope.saveShot();
            $scope.clearCanvas();
            $("#arrow").hide();
            $("#pop").hide();
            $("#number").hide();
            $scope.strokesN++;
            $scope.playScale();
            $scope.sstorage.approachXY.push({x:$scope.sstorage.approachX,y:$scope.sstorage.approachY})
            console.log($scope.shotType)
        }
         $scope.playScale=function(){

                 if(($scope.sstorage.club === "3W")||($scope.sstorage.club === "5W")||($scope.sstorage.club === "Driver")){
                     $scope.showApp();
              } else{
                     $scope.showPit()
                 }

              }

        $scope.clearCanvas=function(){
            var canvas=document.getElementById("canvas");
            var ctx=canvas.getContext("2d");
            ctx.clearRect(0, 0, canvas.width, canvas.height);

        }
        $scope.clubTypesShow = function(){
            $("#clubs").fadeIn();

        }
        $scope.showPit = function(){
            $("#ydss").show();
            $("#s1").text("15");
            $("#s2").text("30");
            $("#s3").text("45");
            $("#c1").text("YDS");
            $("#c2").text("YDS");
            $("#c3").text("YDS");
           }
        $scope.showApp = function(){
            $("#s1").text("20");
            $("#s2").text("40");
            $("#s3").text("60");
            $("#c1").text("FT");
            $("#c2").text("FT");
            $("#c3").text("FT");
            $("#ydss").fadeIn();

        }
        $scope.showEnd = function(){

            $("#endofRound").fadeIn();

        }
        $scope.goComs = function(){

            $scope.sstorage.approachXY.push({x:$scope.sstorage.approachX,y:$scope.sstorage.approachY});
            $("#endofRound").hide();
            $location.path( "/comment" );

        }
        $scope.noWay = function(){

            $("#endofRound").hide();

        }
        $scope.saveShot = function(){
            if (!$scope.sstorage.recordedHoles) {
                $scope.sstorage.recordedHoles = [];
            }

            if (!$scope.sstorage.recordedHoles[0]) {
                $scope.sstorage.recordedHoles[0] = {}
            }
            var hole = $scope.sstorage.recordedHoles[0];


            if (!hole.strokes) { hole.strokes = []; }

            if (!hole.strokes[$scope.sstorage.strokesN]) {
                hole.strokes[$scope.sstorage.strokesN] = { };
            }
            var stroke = hole.strokes[$scope.sstorage.strokesN];
            stroke.number= $scope.sstorage.strokesN;
            stroke.club = $scope.sstorage.club;

            stroke.shape = $scope.sstorage.shape;

            stroke.position={x:$scope.sstorage.shotPositionX,y:$scope.sstorage.shotPositionY}

        }
       })
    .controller('TeeCtrl',function ($scope, $localStorage,$sessionStorage,geolocation,$location) {
        $scope.lstorage = $localStorage;
        $scope.sstorage = $sessionStorage;
        $scope.coords = geolocation.getLocation().then(function(position){

            $scope.coords.lat=position.coords.latitude;
            $scope.coords.long=position.coords.longitude;
            })

        $scope.hole = 1;
        $scope.shot = 1;
        $scope.sstorage.holeN = 1;
        $scope.par = undefined;
        $scope.yards = undefined;
        $scope.shotType = undefined;
        $scope.sstorage.toPar = 0;
        $scope.shapeType = "";
        $scope.sstorage.fairways = 0;
        $scope.sstorage.greens = 0;
        $scope.sstorage.putts = 0;
        $scope.sstorage.approachXY=[];
        $scope.saveGpsOn=function(){
            $("#start").hide();
            $("#stop").fadeIn();
            geolocation.getLocation().then(function (position) {
                $scope.lat1 = position.coords.latitude;
                $scope.lon1 = position.coords.longitude;
                console.log($scope.lat1,$scope.lon1);
            });

      }

        $scope.saveGpsOff= function(){
            geolocation.getLocation().then(function (position) {
                $scope.lat2 = position.coords.latitude;
                $scope.lon2 = position.coords.longitude;
                console.log($scope.lat2,$scope.lon2);
                var lat1 = Geo.parseDMS($scope.lat1);
                var lon1 = Geo.parseDMS($scope.lon1);
                var lat2 = Geo.parseDMS($scope.lat2);
                var lon2 = Geo.parseDMS($scope.lon2);
                var p1 = new LatLon(lat1, lon1);
                var p2 = new LatLon(lat2, lon2);
                var dist = p1.distanceTo(p2);
                var yard = Math.floor(dist * 1093.6);

                $scope.distance = yard;
                console.log(yard);


            });
            $("#dist").delay(1000).fadeIn();
            $("#arrow").delay(1000).fadeIn();
            $("#stop").hide();

        }

        $scope.showHoleOut = function(){
      $("#holeOut").delay(1000).fadeIn();

  }
        $scope.thisHole = function(){
           $("#holeOut").hide();

        }

        $scope.nextHole = function(){

            $scope.clearCanvas();
            $("#pop").hide();
            $("#holeOut").hide();
            $scope.hole++;
            $scope.sstorage.holeN=$scope.hole;
            $("#arrow").hide();
            $scope.updateToPar();
            $scope.shot = 1;
            $scope.update();
            $scope.showClubs();
            $scope.saveShot();

        }

        $scope.update= function(){
            $scope.par = $scope.sstorage.tee["tee_par_" + $scope.hole];
            $scope.yards = $scope.sstorage.tee["tee_length_" + $scope.hole];
            if ($scope.par == 3){
                $scope.shotType = "Approach";
                $scope.sstorage.club=" Driver";
                $scope.showApp();


          }else{
                $scope.shotType = "Tee Shot";
                $scope.sstorage.club=" Driver";
                $scope.showDri();

            }

        }
        $scope.prevShot = function(){
            $scope.clearCanvas();
            $scope.shot--;
            $("#arrow").hide();
            $("#pop").hide();
            $("#dist").hide();
            $("#start").hide();
            $("#stop").hide();
            $("#number").hide();
            $("#green").hide();
            $("#fairway").hide();
            if($scope.par === 3 & $scope.shot === 1){
                $scope.sstorage.club=" Driver";
                $scope.shotType = "Approach";
                $scope.showClubs();
                $scope.showApp();
                $("#start").fadeIn();
            }

            else if(($scope.par === 4 & $scope.shot === 1)||($scope.par === 5 & $scope.shot === 1)){
                $scope.sstorage.club=" Driver";
                $scope.shotType = "Tee Shot";
                $scope.showClubs();
                $scope.showDri();
                $("#start").fadeIn();
            }
             else if($scope.par === 3 & $scope.shot === 2){
                $('#green').show();
            }

            else if(($scope.par === 4 & $scope.shot === 2)||($scope.par === 5 & $scope.shot === 2)){
                $('#fairway').show();

            }
            else if(($scope.par === 4 & $scope.shot === 3)||($scope.par === 5 & $scope.shot === 4)){
                $('#green').show();
                $("#start").hide();
            }
            else{
                $scope.showClubs();

            }


        }
        $scope.nextShot = function(){
            $scope.saveShot();
            $scope.clearCanvas();
            $scope.shot++;
            $("#arrow").hide();
            $("#pop").hide();
            $("#dist").hide();
            $("#start").fadeIn();
            $("#stop").hide();
            $("#number").hide();
            if($scope.shotType === "Approach"){
            $scope.sstorage.approachXY.push({x:$scope.sstorage.approachX,y:$scope.sstorage.approachY})
            console.log($scope.sstorage.approachXY);
        }
            if($scope.par === 3 & $scope.shot === 2){
                $('#green').show();

            }
            else if(($scope.par === 4 & $scope.shot === 2 & $scope.shotType === "Putt")||($scope.par === 5 & $scope.shot === 2 & $scope.shotType === "Putt")){
                $('#fairway').hide();
                $("#clubs").hide();
                $("#start").hide();
            }
            else if(($scope.par === 4 & $scope.shot === 3 & $scope.shotType === "Putt" )||($scope.par === 5 & $scope.shot === 4 & $scope.shotType === "Putt")){
                $('#green').hide();
                $("#start").hide();
                $("#clubs").hide();
            }else if($scope.shotType === "Putt" ){
                $("#clubs").hide();
                $("#start").hide();
            }
            else if(($scope.par === 4 & $scope.shot === 2)||($scope.par === 5 & $scope.shot === 2)){
                $('#fairway').show();

            }
            else if(($scope.par === 4 & $scope.shot === 3)||($scope.par === 5 & $scope.shot === 4)){
                $('#green').show();
                $("#start").hide();
            }
            else{
                $scope.showClubs();

            }

        }

         $scope.saveShapeType = function(){

            console.log($scope.sstorage.shape)

         }
        $scope.clearCanvas=function(){
            var canvas=document.getElementById("canvas");
            var ctx=canvas.getContext("2d");
            ctx.clearRect(0, 0, canvas.width, canvas.height);

        }

        $scope.updateToPar = function(){
            $scope.sstorage.toPar +=  $scope.shot - $scope.par;

        }
        $scope.displayToPar = function(){
            if($scope.sstorage.toPar > 0){
                return '+' + $scope.sstorage.toPar
            }else{
                return $scope.sstorage.toPar
            }

        }


        $scope.sstorage.club="Driver";

        $scope.inGreen=function(){
            $scope.greenPot="true";
            $('#green').hide();


        }
        $scope.notOnGreen=function(){
            $('#green').hide();
            $("#shots").fadeIn();
            $scope.greenPot="false";

        }

        $scope.inFairway=function(){

            $('#fairway').hide();
            $scope.shotType = "Approach";
            $scope.showClubs();
            $scope.onFairway="true";

        }
        $scope.notInFairway=function(){
            $('#fairway').hide();
            $scope.showClubs();
            $scope.onFairway="false";
        }

        $scope.showClubs = function(){

            $("#clubs").fadeIn();
        }

        $scope.shotTypesShow = function(){
            $("#shots").fadeIn();

        }

        $scope.goThere = function(){
            $("#holeOut").hide();
            $("#endofRound").fadeIn();

        }
        $scope.goCom = function(){
            $scope.saveShot();
            $scope.updateToPar();
            $scope.sstorage.approachXY.push({x:$scope.sstorage.approachX,y:$scope.sstorage.approachY});
            $("#endofRound").hide();
            $location.path( "/comment" );

        }
        $scope.noWay = function(){
            $("#holeOut").fadeIn();
            $("#endofRound").hide();

        }
        $scope.clubTypesShow = function(){
            $("#clubs").fadeIn();

        }
        $scope.showDri = function(){
            $("#displaypage").css("background-image","url('img/MainScreen_15yds_320.png')");
            $("#start").fadeIn();

        }
        $scope.showApp=function(){
            $("#displaypage").css("background-image","url('img/MainScreen_20FT_320.png')");
     }

        $scope.showPit=function(){
            $("#displaypage").css("background-image","url('img/MainScreen_10FT_320.png')");

        }
        $scope.showPut= function(){
            $("#shots").fadeOut();
            $scope.sstorage.club="Putter";
            $("#displaypage").css("background-image","url('img/MainScreen_3FT_320.png')");
        }
        $scope.showBun= function(){
            $("#displaypage").css("background-image","url('img/MainScreen_5FT_320.png')");
        }

        $scope.shotTypesHide = function(){
            $("#shots").fadeOut();

     }
        $scope.hideClubs=function(){
            $("#clubs").fadeOut();
            if(($scope.shotType === "Approach")||($scope.shotType === "Tee Shot")){
                $("#start").fadeIn();

            }else{

                $("#start").hide();
            }
            if($scope.sstorage.club === "Putter"){
                $scope.shotType = "Putt";
                $scope.showPut();
            }

        }
        $("#clubs").animate({
            height: 370
        },"fast", function(){

            $('#clubs').fadeIn();
        });
        $scope.saveShot = function(){
            if (!$scope.sstorage.recordedHoles) {
                $scope.sstorage.recordedHoles = [];
            }
            if (!$scope.sstorage.recordedHoles[$scope.hole - 1]) {
                $scope.sstorage.recordedHoles[$scope.hole - 1] = {}
            }
            var hole = $scope.sstorage.recordedHoles[$scope.hole - 1];
            hole.number= $scope.hole-1;
            hole.par = $scope.par;


            if (!hole.strokes) { hole.strokes = []; }

            if (!hole.strokes[$scope.shot - 1]) {
                hole.strokes[$scope.shot - 1] = { };
            }
            var stroke = hole.strokes[$scope.shot - 1];
            stroke.number= $scope.shot-1;
            stroke.club = $scope.sstorage.club;
            stroke.shotType = $scope.shotType;
            stroke.distance = $scope.distance;
            stroke.shape = $scope.sstorage.shape;
            stroke.onGreen = $scope.greenPot;
            stroke.onFairway = $scope.onFairway;
            stroke.position={x:$scope.sstorage.shotPositionX,y:$scope.sstorage.shotPositionY}
            console.log($scope.sstorage.shotPositionX);
            console.log($scope.sstorage.shotPositionY);
        }
        $scope.update();

    })
  .controller('CanvasCtrl',function($scope){
        var canvas=document.getElementById("canvas");
        var ctx=canvas.getContext("2d");
        var Starting_X =160;
        var Starting_Y =260;
        $scope.drawX= function(){
            var img  = new Image();
            img.onload = function(){
                ctx.drawImage(img,$scope.mouseX-12,$scope.mouseY-12);

            }
            img.src = "img/X.png"
        }
        $scope.drawLines = function($event){
            $("#pop").fadeIn();
            $("#arrow").fadeIn();
            $("#start").hide();
            console.log('Mouse position', $event.offsetX, $event.offsetY);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            var shotPosition = shotPositionFromClick($scope.shotType, $event.offsetX, $event.offsetY);
            $scope.mouseX = $event.offsetX;
            $scope.mouseY = $event.offsetY;
            $scope.shotPosition=shotPosition;
            console.log('Shot position', shotPosition);
            ctx.beginPath();
            ctx.moveTo( $scope.mouseX, $scope.mouseY);
            ctx.lineTo(Starting_X, Starting_Y);
            ctx.strokeStyle = '#ffffff';
            ctx.stroke();
            $scope.sstorage.shape = "Straight";
            $scope.drawX();
            $scope.xDown();
            $scope.yDown();

        }

        $scope.showForm = function(){

            $("#number").fadeIn();
            $scope.shotPositionX=Math.abs($scope.shotPositionX);
            $scope.shotPositionY=Math.abs($scope.shotPositionY);

        }


        $scope.xDown = function(){
            if (!$scope.shotPosition) { return; }
            var x =  $scope.mouseX - 160;
            if ($scope.shotType === "Approach") {
                x = Math.floor(x/2.16);
            $scope.sstorage.approachX=x;
            }
            if ($scope.shotType === "Pitch") {
                x = Math.floor(x/4.3);
            }
            if ($scope.shotType === "Putt") {
                x = Math.floor(x/14.3);
            }
            if (($scope.shotType === "Chip")||($scope.shotType === "Bunker")) {
                x = Math.floor(x/8.7);

            }
            if (($scope.shotType ==="Drive")||($scope.shotType === "Tee Shot")){
                x = Math.floor(x/2.9);
            }
            $scope.shotPositionX = x;
            $scope.shotPositionX=Math.abs($scope.shotPositionX);

           if(x > 0){
               $scope.sstorage.scalx = " right";


            }else{
               $scope.sstorage.scalx = " left";
               $scope.sstorage.shotPositionX = -$scope.shotPositionX;
            }


        }
        $scope.yDown = function(){

            if (!$scope.shotPosition) { return; }
            var y = $scope.mouseY - 130;
            if ($scope.shotType === "Approach") {
                y = Math.floor(y/2.16);
                $scope.sstorage.approachY= -y;
            }
            if ($scope.shotType === "Pitch") {
                y = Math.floor(y/4.3);
            }
            if ($scope.shotType === "Putt") {
                y = Math.floor(y/14.3);
            }
            if (($scope.shotType === "Chip")||($scope.shotType === "Bunker")) {
                y = Math.floor(y/8.7);

            }
            if (($scope.shotType ==="Drive")||($scope.shotType === "Tee Shot")){
                y = Math.floor(y/2.9);
            }
            $scope.shotPositionY = y;
            $scope.shotPositionY=Math.abs($scope.shotPositionY);

           if(y > 0){
               $scope.sstorage.scaly = " short";


            }else{
               $scope.sstorage.scaly = " long";
               $scope.sstorage.shotPositionY= -$scope.shotPositionY;
            }

        }

        $scope.submit = function() {
            $("#number").hide();

            if($scope.sstorage.scalx === " left"){
            $scope.sstorage.shotPositionX = -$scope.shotPositionX;

            }
            if($scope.sstorage.scaly === " long"){
            $scope.sstorage.shotPositionY = -$scope.shotPositionY;
            }
        };


        $scope.drawLeft= function($event){
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            $scope.sstorage.shape="slice";
            console.log($scope.sstorage.shape);
            var x2=$scope.mouseX+100;
            var y2=$scope.mouseY+50;
            ctx.beginPath();
            ctx.moveTo($scope.mouseX, $scope.mouseY);
            ctx.quadraticCurveTo(x2, y2, Starting_X,Starting_Y);
            ctx.lineWidth = 1;
            ctx.strokeStyle = '#ffffff';
            ctx.stroke();
            $scope.drawX();
        }
        $scope.drawLeft1 = function($event){
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            $scope.sstorage.shape="fade";
            var x1=$scope.mouseX+50;
            var y1=$scope.mouseY+50;
            ctx.beginPath();
            ctx.moveTo($scope.mouseX, $scope.mouseY);
            ctx.quadraticCurveTo(x1, y1, Starting_X,Starting_Y);
            ctx.lineWidth = 1;
            ctx.strokeStyle = '#ffffff';
            ctx.stroke();
            $scope.drawX();

        }
        $scope.drawRight = function($event){
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            $scope.sstorage.shape="draw";
            var x3=$scope.mouseX-50;
            var y3=$scope.mouseY+50;
            ctx.beginPath();
            ctx.moveTo($scope.mouseX, $scope.mouseY);
            ctx.quadraticCurveTo(x3, y3, Starting_X,Starting_Y);
            ctx.lineWidth = 1;
            ctx.strokeStyle = '#ffffff';
            ctx.stroke();
            $scope.drawX();
        }
        $scope.drawRight1 = function($event){
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            $scope.sstorage.shape="hook";
            var x4=$scope.mouseX-100;
            var y4=$scope.mouseY+50;
            ctx.beginPath();
            ctx.moveTo($scope.mouseX, $scope.mouseY);
            ctx.quadraticCurveTo(x4, y4, Starting_X,Starting_Y);
            ctx.lineWidth = 1;
            ctx.strokeStyle = '#ffffff';
            ctx.stroke();
            $scope.drawX();
        }

    })
    .controller('commentCtrl',function ($scope,$http, $localStorage,$sessionStorage,$location) {
        $scope.lstorage = $localStorage;
        $scope.sstorage = $sessionStorage;
        $scope.sstorage.comment="";

        $scope.submitForm = function(){


            var clubs = $scope.lstorage.clubs;
            console.log(clubs);

            var onlyCheckedClubs = clubs.filter(function (club) { return club.check; });

            console.log(onlyCheckedClubs);

            var checkedClubNames = onlyCheckedClubs.map(function (club) { return club.value; });

            console.log(checkedClubNames);

            var data = {
                start: $scope.sstorage.start,
                venue_name:$scope.sstorage.Course,
                 ball_brand:$scope.sstorage.ball,
                rangCourse:$scope.sstorage.RangeCourse,
                venue_type:$scope.sstorage.type,
                clubs: JSON.stringify(checkedClubNames),
                strokes:$scope.sstorage.strokes,
                putts:$scope.sstorage.putts,
                greens:$scope.sstorage.greens,
                fairways:$scope.sstorage.fairways,
                to_par: $scope.sstorage.toPar,
                comments: $scope.sstorage.comment,
                gps:true,
                holes: JSON.stringify($scope.sstorage.recordedHoles)

            }

          $http({method:'post',params:data,url: 'https://backend.targetsgolf.com/api/1/round/' + $scope.lstorage.user.userId})
               .success(function(data,status,headers, config) {

                  //$scope.message=data;

                    $location.path( "/result" );


                }).error(function(data, status, headers, config) {
                    $scope.status = status;
                    alert("error")

                })

        }

    })

    .controller('resultCtrl',function ($scope,$http, $localStorage,$sessionStorage,$location) {
        $scope.lstorage = $localStorage;
        $scope.sstorage = $sessionStorage;
        $scope.today = new Date();
        $('#container').highcharts({
            chart: {
                type: 'scatter',
                zoomType: 'xy',
                spacingTop:3,
                spacingLeft:3,
                backgroundColor:''

            },
            title: {
                text: 'Approach Shots',
                style: {
                    color: '#ffffff'

                }
            },


            xAxis: {

                max:60,
                min:-60,
                tickInterval:20,
                lineWidth: 3,
                offset: -89,
                labels: {
                    style: {
                        color: '#ffffff',
                        fontSize: '15px'
                    }
                }
            },

            yAxis: {
                gridLineColor: '',
                max:60,
                min:-60,
                tickInterval:20,
                lineWidth: 3,
                offset: -108,
                labels: {
                    style: {
                        color: '#ffffff',
                        fontSize: '15px'
                    }
                }

            },
            legend: {
                enabled: false
            },
            plotOptions: {
                scatter: {
                    marker: {
                        radius: 5


                    },
                    states: {
                        hover: {
                            marker: {
                                enabled: false
                            }
                        }
                    },
                    tooltip: {

                        pointFormat: '{point.x}, {point.y}'
                    }
                }
            },
            series: [{

                color: '#ffffff',
                opacity:1,
                data : $scope.sstorage.approachXY


            }]
        });


       $scope.showExit = function(){
           $("#exit").fadeIn();
           $("#came").hide();


       }
        $scope.close = function(){
            $("#exit").hide();

      }
      $scope.showCam = function(){
          $("#came").fadeIn();


      }
        $scope.showScre = function(){
            $("#screenshot").fadeIn();

        }

        $scope.thisHide = function(){
            $("#screenshot").hide();

        }
        $scope.goNext = function(){
            $location.path( "/round" );
            $scope.onSubmit()
        }
        $scope.onSubmit = function(){
            delete $scope.sstorage.recordedHoles;
            delete $scope.sstorage.toPar;
            delete $scope.sstorage.strokes;
            delete $scope.sstorage.putts;
            delete $scope.sstorage.greens;
            delete $scope.sstorage.fairways;
            delete $scope.sstorage.comment;
            delete $scope.sstorage.Course;
            delete $scope.sstorage.RangeCourse;
            delete $scope.sstorage.holeN;
            delete $scope.sstorage.strokesN;
            delete $scope.sstorage.approachXY

        }

    })

    .controller('cameraCtrl', ['Camera', '$scope', function (Camera, $scope) {
        $scope.capturePhoto = function(){
            $("#came").hide();

            Camera.getPicture(onSuccess, onFail,{
                quality : 75,
                destinationType:Camera.DestinationType.FILE_URI,
                sourceType : Camera.PictureSourceType.CAMERA,
                allowEdit :false,
                encodingType: Camera.EncodingType.JPEG,
                targetWidth: 320,
                targetHeight: 338,
                saveToPhotoAlbum: true,
                correctOrientation:true

            });

            function onSuccess(imageURI) {
                $('#image').css({'background-image': 'url('+imageURI+')', 'background-size':  '320px 338px'});
            }

            function onFail(message) {
                console.log('Failed to get an image');
            }
        }

        $scope.getPictureFromGallery = function(){
            $("#came").hide();
            navigator.camera.getPicture(onSuccess, onFail, {
                quality: 75,
                destinationType: Camera.DestinationType.FILE_URI,
                sourceType: navigator.camera.PictureSourceType.PHOTOLIBRARY,
                targetWidth: 320,
                targetHeight: 338
            });

            function onSuccess(imageURI) {
                $('#image').css({'background-image': 'url('+imageURI+')', 'background-size':  '320px 338px'});
            }

            function onFail(message) {
                console.log('Failed to get an image');
            }
        }


    }])


function shotPositionFromClick(shotType, offsetX, offsetY) {
    offsetX = offsetX - 160;
    offsetY = offsetY - 130;
    if (shotType === "Approach") {
        return {
            x: Math.floor(offsetX / 2.1),
            y: -Math.floor(offsetY / 2.1)
        }
    }

    if (shotType === "Chip") {
        return {
            x: Math.floor(offsetX / 8.6),
            y: -Math.floor(offsetY / 8.6)
        }
    }
    if (shotType === "Putt") {
        return {
            x: Math.floor(offsetX / 17.7),
            y: -Math.floor(offsetY / 17.7)
        }
    }
    if ((shotType === "Pitch")||(shotType === "Bunker")) {
        return {
            x: Math.floor(offsetX / 10.6),
            y: -Math.floor(offsetY / 10.6)
        };
    }

    if((shotType ==="Drive")||(shotType === "Tee Shot")){
        return {
            x: Math.floor(offsetX / 2.9),
            y: -Math.floor(offsetY / 2.9)
        }
    }
    // TODO: finish the rest
}
