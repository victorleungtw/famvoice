/**
 * Socket service
 * @module socket
 * @author Claudio A. Marrero
 * @class famvoice
 */
 services.factory('$socket', [

  '$rootScope', 

  function($rootScope) {

  /**
  * Socket.io property, have all methods and propertios of socket.io
  *
  * @property socket
  * @private
  */
  var socket = io.connect('http://192.168.0.2:9564');

  var fileName = "";

  /**
  * Listen some messages from the server
  *
  * @method on
  */
  function on(eventName, callback){
    socket.on(eventName, function () {  
      var args = arguments;
      $rootScope.$apply(function () {
        callback.apply(socket, args);
      });
    });
  }

  /**
  * Send messages to the server, if send the acknowleage, when
  * is recived is fired.
  *
  * @method emit
  */
  function emit(eventName, data, callback){
    socket.emit(eventName, data, function () {  
      var args = arguments;
      $rootScope.$apply(function () {
        callback.apply(socket, args);
      });
    });
  }

  function stream(file){
    fileName = file;
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, gotFS, fail);   
  }

  function onDeviceReady() {
      window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, gotFS, fail);
  }

  function gotFS(fileSystem) {
      fileSystem.root.getFile(fileName, null, gotFileEntry, fail);
  }

  function gotFileEntry(fileEntry) {
      fileEntry.file(gotFile, fail);
  }

  function gotFile(file){
      readDataUrl(file);
  }

  function readDataUrl(file) {
      var reader = new FileReader();

      reader.onloadend = function(evt) {
        console.log("Read as data URL");
        console.log(evt.target.result);
        var stream = ss.createStream();
        ss(socket).emit('playlists:save', stream, {name:file});
        ss.createBlobReadStream(dataURL).pipe(stream);
      };
      reader.readAsDataURL(file);
  }

  function fail(evt) {
      console.log(evt);
  }

  /**
  * Get the ID of socket.io session.
  *
  * @method id
  */
  function id(){
    return socket.io.engine.id;
  }

  /**
  * Get the ID of socket.io session.
  *
  * @method id
  */
  function expose(){
    return socket;
  }

  return {
    on: on,
    emit: emit,
    id:id,
    expose:expose,
    stream:stream
  };
}]);