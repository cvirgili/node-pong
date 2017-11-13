  window.fbAsyncInit = function() {
      FB.init({
          appId: '1595259017177350',
          autoLogAppEvents: true,
          xfbml: true,
          version: 'v2.11'
      });
      FB.AppEvents.logPageView();
      FB.login(function(response) {
          if (response.authResponse) {
              FB.api('/me', function(response) {
                  document.getElementById('name').innerText = response.name;
              });
              FB.api('/me/picture', { width: 200, height: 200 }, function(res) {
                  document.getElementById('profile-image').innerHTML = '<img src="' + res.data.url + '"/>';
                  socket.emit('user-photo', { n: number, url: res.data.url });
              });
          } else {
              document.getElementById('messages').innerText = 'User cancelled login or did not fully authorize.';
          }
      }, { scope: 'publish_actions' });
  };
  (function(d, s, id) {
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) { return; }
      js = d.createElement(s);
      js.id = id;
      js.src = "//connect.facebook.net/en_US/sdk.js";
      fjs.parentNode.insertBefore(js, fjs);
      var p = new player(number, socket);
  }(document, 'script', 'facebook-jssdk'));