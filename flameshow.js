(function () {
  var fbRef = new Firebase('https://uri-slides.firebaseio.com/present');

  function updateState() {
    fbRef.set(_.omit(Reveal.getState(), _.isUndefined));
    return true;
  }

  Reveal.addEventListener('ready', function (event) {
    updateState();

    fbRef.on('value', function (snapshot) {
      Reveal.setState(snapshot.val());
    });
  });

  Reveal.addEventListener('slidechanged', updateState);
  Reveal.addEventListener('fragmenthidden', updateState);
  Reveal.addEventListener('fragmentshown', updateState);
})();
