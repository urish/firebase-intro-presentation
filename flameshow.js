(function () {
  var fbRef = new Firebase('https://uri-slides.firebaseio.com/present');

  function updateState() {
    fbRef.set(_.omit(Reveal.getState(), _.isUndefined));
    return true;
  }

  function installListeners() {
    Reveal.addEventListener('slidechanged', updateState);
    Reveal.addEventListener('fragmenthidden', updateState);
    Reveal.addEventListener('fragmentshown', updateState);
  }

  Reveal.addEventListener('ready', function (event) {
    updateState();
    fbRef.onAuth(function (authData) {
      if (authData) {
        updateState();
        installListeners();
      }
    });

    fbRef.on('value', function (snapshot) {
      Reveal.setState(snapshot.val());
    });
  });

  window.login = function () {
    fbRef.authWithOAuthRedirect('google', function (error) {
      console.log('Login Failed!', error);
    });
  };
})();
