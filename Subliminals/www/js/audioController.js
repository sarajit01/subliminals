app.controller('audioController' , function ($scope , $http , $window , $location , $q , $timeout ) {
    $scope.currentAudioTitle = 'Please select an audio to enjoy' ;
    $scope.currentAudioAlbum = 'Welcome' ;
    $scope.currentAudioImgSrc = '' ;
    $scope.currentAudioWriter = '' ;
    $scope.play = false ;
    $scope.myAudio = undefined ;
    $scope.range = 0 ;
    $scope.mute = false ;

    $scope.volume = 1.00 ;


    var resumeFrom ; 

    $('#loading-indicator').hide();

    $scope.getAlbums = function ($action) {
        $('#audio-showcase').hide();
        $scope.progress = true ;

        var q = $q.defer() ;
        
        $timeout(loadAlbums,1000);

        function loadAlbums() {
            $http.get($action).then(
                function (response) {
                    q.resolve(response);
                    $scope.albums = response.data ;
                    $scope.progress = false ;
                    console.log(response.data);
                }  ,

                function (reason) {
                    console.log(reason);
                }
            ) ;

            return q.promise ;
        }


    }  ;

    $scope.currentAlbum = {

    } ;

    $scope.volumeUp = function () {
        if($scope.myAudio === undefined)  {
            alert('No audio selected !') ;

            return false ;
        }
        if(($scope.volume + 0.1) >= 1){
            $scope.volume = 1 ;
            $scope.maxVol = true ;
            //alert('Volume has been set to 100%');
            //return true ;
        }

        else {
            $scope.volume+= 0.1 ;

        }

        $scope.myAudio.volume = $scope.volume ;
        $scope.minVol = false ;

        // alert($scope.volume);

        return true;

    }   ;

    $scope.volumeDown = function () {
        if($scope.myAudio === undefined)  {
            alert('No audio selected !') ;

            return false ;
        }

        if(($scope.volume - 0.1) <= 0){

             $scope.volume = 0 ;
             $scope.minVol = true ;
             //alert('Volume has been muted');

             //return true ;
        }

        else {
            $scope.volume-= 0.1 ;

        }
        $scope.maxVol = false ;
        $scope.myAudio.volume = $scope.volume ;

        //alert($scope.volume);

        return true;



    }   ;


    $scope.getAudios = function ($action) {

        $scope.progress = true ;

        var q = $q.defer() ;

        $http.get($action).then(
            function (response) {
                q.resolve(response);
                console.log(response.data);
            }  ,

            function (reason) {
                console.log(reason);
            }
        ) ;

        return q.promise ;
    }   ;

    $scope.appearAudioList = function ($album_id,$action,$action_album) {
        $scope.audioListAppeared = true ;

        $('#album-showcase').hide();
          $('.audio-list-empty').hide();
          $scope.progress = true ;

          //$('#audio-showcase').show();

          var q = $q.defer() ;

          $http.get($action+'?album_id='+$album_id).then(
              function (response) {
                      q.resolve(response);
                      $scope.audioList = response.data ;
                     // alert($scope.audioList.length);
                      if($scope.audioList.length === 0){
                          $('.audio-list-empty').show();
                          $('.audio-list-container').hide();
                      }
                      else {
                          $('.audio-list-empty').hide();
                          $('.audio-list-container').show();
                      }
                      $scope.getAlbumDetails($action_album,$album_id);
                      $scope.progress = false ;
                      $('#audio-showcase').show() ;
                      console.log(response.data);
              }    ,

              function (reason) {
                      q.reject(reason);
                      $scope.progress = false ;
                      $scope.empty = true ;
                      $('#audio-showcase').show();
              }
          ) ;

        return     q.promise;


    }   ;
    
    $scope.getAlbumDetails = function ($action,$album_id) {


        var q = $q.defer() ;

        $http.get($action+'?album_id='+$album_id).then(
            function (response) {
               q.resolve(response);
               $scope.albumDetails = response.data ;
               console.log($scope.albumDetails) ;
            }  ,
            function (reason) {
               q.reject(reason) ;
               $scope.albumDetailsEmpty = true ;
               $('.audio-list-empty').show();
               $('.audio-list-container').hide();
            }
        )  ;

        return q.promise ;



    }   ;
    
    $scope.getNoOfAudios = function ($action,$album_id) {
         var q = $q.defer() ;

         $http.get($action+'?album_id='+$album_id).then(
             function (response) {
                 q.resolve(response);
                 $scope.noOfAudios = response.data ;
                 console.log(response.data);
             }  ,

             function (reason) {
                 $scope.noOfAudios = 0;
             }
         )  ;

         return q.promise ;
    }   ;

    $scope.backToAlbum = function () {
          $scope.audioListAppeared = false ;
          $scope.myplaylistAppeared = false ;
          $('#audio-showcase').hide();
          $('#album-showcase').show();

    }   ;

    $scope.currentDiskInPlayer = undefined ;

    $scope.currentSelection = function ($id) {
          $scope.selectedHover = $id ;
        //  alert($id);
    }      ;

    $scope.playFavorite = function ($x) {
        
        $scope.currentDiskInPlayer = $x ;

        if($scope.currentAudioId === $x.id ){
            if($scope.play === true){
                $scope.play = false ;
                $scope.pauseAudioPlayer();
                //alert($scope.myAudio.currentTime);
            }
            else {
                $scope.play = true ;
                $scope.myAudio.play();
            }
            //  alert('this was played');
        }
        else {
            $scope.play = true;
            // alert('playing now!');

            $scope.currentAudioId = $x.id;
            $scope.currentAudioTitle = $x.audio_title;
            $scope.currentAudioImgSrc = $x.img_src;
            $scope.currentAudioAlbum = 'My Favourites';
            $scope.currentAudioCategory = 'My playlist';
            $scope.currentAudioDuration = $x.duration;
            $scope.currentAudioWriter = $x.writer_name;
            $scope.currentAudioSrc = $x.audio_src;

            $scope.stopAudio();

            $scope.playAudio();

            // alert($scope.audioList.indexOf(x));
        }

    }  ;

    $scope.selectAudio = function ($x) {
        
        $scope.currentAlbum.id = $x.album_id ;
           $scope.currentDiskInPlayer = $x ;
          if($scope.currentAudioId === $x.id ){
                if($scope.play === true){
                    $scope.play = false ;
                    $scope.pauseAudioPlayer();
                    //alert($scope.myAudio.currentTime);
                }
                else {
                    $scope.play = true ;
                    $scope.myAudio.play();
                }
              //  alert('this was played');
          }
          else {
              $scope.play = true;
              // alert('playing now!');

              $scope.currentAudioId = $x.id;
              $scope.currentAudioTitle = $x.audio_title;
              $scope.currentAudioImgSrc = $x.img_src;
              $scope.currentAudioAlbum = $scope.albumDetails.album_title;
              $scope.currentAudioCategory = $scope.albumDetails.album_category;
              $scope.currentAudioDuration = $x.duration;
              $scope.currentAudioWriter = $x.writer_name;
              $scope.currentAudioSrc = $x.audio_src;

              $scope.stopAudio();

              $scope.playAudio();

             // alert($scope.audioList.indexOf(x));
          }

    }    ;

    $scope.playAudio = function () {
        if($scope.currentAudioAlbum !== 'My Favourites') {
            $scope.addToPlayList($location.$$absUrl+'/add',$scope.currentAudioId,'silent');
        }


        $scope.myAudio = new Audio('http://sarajit.byethost8.com/audio/storage/app/audios/'+$scope.currentAudioSrc);
          console.log('loading');
          $scope.currentAudioLoaded = false ;
          $('.range-slider__range').hide();
          $('#loading-indicator').show();
        $scope.myAudio.onloadedmetadata = function() {
           // $scope.myAudio.load();
            $scope.currentAudioLoaded = true ;
            $('#loading-indicator').hide();
            $('.range-slider__range').show();
            $scope.refreshRange();
            $scope.changeRange() ;

           // alert('loaded');
            var audioDuration = $scope.myAudio.duration ;


            $(".range-slider__range").attr("max", $scope.myAudio.duration);
            $scope.myAudio.play() ;
            $scope.myAudio.addEventListener('timeupdate',function (){

                curtime = $scope.myAudio.currentTime;
                //alert(curtime);
                $(".range-slider__range").val(curtime);
                if(curtime === $scope.myAudio.duration) {
                   // $scope.play = false ;
                   // alert(curtime);
                    //myAudio.play();


                   // var nextDisk = $scope.audioList.indexOf($scope.currentDiskInPlayer)  + 1 ;

                    $scope.nextPlay();

                }
            });


        };
    }      ;

    $scope.pauseAudioPlayer = function () {
          if($scope.myAudio !== undefined){
              $scope.paused = true ;
              $scope.myAudio.pause();
          }

    }  ;

    $scope.stopAudio = function () {
         if($scope.myAudio !== undefined){
             $scope.myAudio.currentTime = $scope.myAudio.duration ;
            // alert('stopped') ;
         }
    } ;
    var currentTime = $scope.currentTime ;
    $scope.changeRange = function () {
        if($scope.myAudio !== undefined){
            $scope.myAudio.currentTime = $scope.range ;
            $scope.currentTime = $scope.myAudio.currentTime;

        }
    }   ;

    $scope.refreshRange = function () {
        if($scope.myAudio !== undefined){
            $scope.range = 0.00 ;
            $scope.myAudio.currentTime = $scope.range ;
            $scope.currentTime = $scope.myAudio.currentTime;

        }
    }  ;

    $scope.resumeOrPauseAudioPlayer = function () {
        if($scope.myAudio !== undefined){
            if($scope.paused === true){
                $scope.paused = false ;
                $scope.play = true ;
                $scope.myAudio.play() ;
                
            }
            else {
                $scope.paused = true ;
                $scope.play = false ;
                $scope.myAudio.pause() ;
            }
        }


    }   ;
    
    
    $scope.setDiskInCurrentPlayer = function ($x) {
        $scope.currentAudioId = $x.id;
        $scope.currentAudioTitle = $x.audio_title;
        $scope.currentAudioImgSrc = $x.img_src;
        $scope.currentAudioAlbum = $scope.albumDetails.album_title;
        $scope.currentAudioCategory = $scope.albumDetails.album_category;
        $scope.currentAudioDuration = $x.duration;
        $scope.currentAudioWriter = $x.writer_name;
        $scope.currentAudioSrc = $x.audio_src;

        $scope.stopAudio();

        $scope.playAudio();


    } ;

    $scope.addToPlayList = function ($action,$id,$mode ) {

        var q = $q.defer() ;

        $http.get($action+'?id='+$id).then(
            function (response) {
                q.resolve(response);
                $scope.addResponse = response.data ;
                console.log(response.data);
            }  ,

            function (error) {
                q.reject(error);
                $scope.addResponse = 'something went wrong ! try again later' ;
                console.log(error);
            }

        )  ;
        if($mode === 'alert'){
            alert($scope.addResponse);
        }


        return q.promise ;

    }    ;
    
    $scope.getMyPlayList = function () {
       // alert('loading ..');
        $scope.myplaylistAppeared = true ;
        $('#album-showcase').hide();
        $('.audio-list-empty').hide();
        $scope.progress = true ;

        var q = $q.defer() ;

         
         $http.get($location.$$absUrl+'/get-myplaylist').then(
             function (response) {
                 q.resolve(response);
                  if(response.data.length !== 0){
                      $scope.audioList = response.data ;
                      $scope.progress = false ;
                      $('#album-showcase').hide();
                      $('#audio-showcase').hide();

                  }
                  else {
                      $scope.progress = false ;
                      alert('No Audio found in your playlist , please add some audio to your list');
                  }
             }  ,
             function (reason) {
                 q.reject(reason);
                 $scope.progress = false ;
                  alert('No Audio found in your playlist , please add some audio to your list');
                  console.log(reason);
             }
         );

         return q.promise ;
         
    }  ;

    
    
    $scope.nextPlay = function () {
        $scope.play = false ;

        if($scope.currentDiskInPlayer !== undefined){

            var nextDisk = $scope.audioList.indexOf($scope.currentDiskInPlayer)  + 1 ;
            if($scope.audioList[nextDisk] !== undefined){
                $scope.setDiskInCurrentPlayer($scope.audioList[nextDisk]) ;
                $scope.selectAudio($scope.audioList[nextDisk]);
            }
            else {

                $scope.nextDiscEmpty = true ;
                $scope.stopAudio();
                $scope.myAudio = undefined ;
            }

        }

    }    ;

    $scope.prevPlay = function () {
        $scope.play = false ;
        if($scope.currentDiskInPlayer !== undefined){

            var prevDisk = $scope.audioList.indexOf($scope.currentDiskInPlayer)  - 1 ;
            if($scope.audioList[prevDisk] !== undefined){
                $scope.setDiskInCurrentPlayer($scope.audioList[prevDisk]) ;
                $scope.selectAudio($scope.audioList[prevDisk]);
            }
            else {

                $scope.prevDiskEmpty = true ;
                $scope.stopAudio();
                $scope.myAudio = undefined ;
            }

        }

    }    ;


    $scope.playAlbum = function ($id) {
        if($scope.currentAlbum.id === $id )  {
            if($scope.audioList.length !== 0 ){
                if($scope.audioList[0] !== undefined && $scope.currentDiskInPlayer === undefined){
                    $scope.setDiskInCurrentPlayer($scope.audioList[0]) ;
                    $scope.selectAudio($scope.audioList[0]);
                }
                else {
                    $scope.resumeOrPauseAudioPlayer();
                }
            }
            else {
                $scope.play = false ;
                $scope.stopAudio();
                $scope.myAudio = undefined ;
                alert('no audio found to play !') ;
            }
        }
        else {

            if($scope.audioList.length !== 0 ){
                if($scope.audioList[0] !== undefined && $scope.currentDiskInPlayer === undefined){
                    $scope.setDiskInCurrentPlayer($scope.audioList[0]) ;
                    $scope.selectAudio($scope.audioList[0]);
                }
                else {
                    $scope.resumeOrPauseAudioPlayer();
                }
            }
            else {

                alert('no audio found to play !') ;

            }

        }

    }  ;

    $scope.repeatAudio = function () {
         $scope.range = 0 ;
         $scope.changeRange();
    }   ;

    $scope.muteAudio = function () {
          if($scope.myAudio !== undefined){
              $scope.myAudio.muted = true ;
              $scope.mute = true;
          }
    }   ;
    
    $scope.unMuteAudio = function () {
        if($scope.myAudio !== undefined){
            $scope.myAudio.muted = false ;
            $scope.mute = false ;
        }
    }


















})   ;
