// code for live-syncing the slides
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
    fbRef.authWithOAuthPopup('google', function (error, auth) {
      if (error) {
        console.log('Login Failed!', error);        
      } else {
        console.log('login success', auth);
      }
    });
  };
})();

// code for the like-box
(function () {
  var fbRef = new Firebase('https://uri-slides.firebaseio.com/likes');
  var currentUser = null;
  var likes = {};
  var usedLiked = false;
  var slideIndex = null;

  fbRef.onAuth(function (authData) {
    if (authData) {
      currentUser = authData.uid;
    } else {
      fbRef.authAnonymously(function (error, authData) {
        if (error) {
          console.error('Login Failed!', error);
        } else {
          currentUser = authData.uid;
          console.log('Authenticated successfully!');
        }
      });
    }
  });

  document.querySelector('.fb-like-box').addEventListener('click', function () {
    fbRef.child(slideIndex).child(currentUser).set(userLiked ? 0 : 1);
  });

  function showLikeBox() {
    document.querySelector('.fb-like-box').classList.remove('hidden');
  }

  function updateLikes() {
    slideIndex = Reveal.getIndices().h + '-' + Reveal.getIndices().v;
    userLiked = _.get(likes, [slideIndex, currentUser], 0);
    var totalLikes = _.filter(likes[slideIndex]).length;
    document.querySelector('.fb-like-count').textContent = totalLikes;
    document.querySelector('.fb-like-box').classList.toggle('liked', userLiked);
  }

  fbRef.on('value', function (snapshot) {
    likes = snapshot.val() || {};
    updateLikes();
    showLikeBox();
  });

  function splashLikeBox(snapshot) {
    if (snapshot.key() === slideIndex) {
      document.querySelector('.fb-like-box').classList.add('splash');
      setTimeout(function() {
        document.querySelector('.fb-like-box').classList.remove('splash');
      }, 200);
    }
  }

  fbRef.on('child_added', splashLikeBox);
  fbRef.on('child_changed', splashLikeBox);

  Reveal.addEventListener('slidechanged', updateLikes);
  Reveal.addEventListener('slidechanged', updateLikes);
})();
