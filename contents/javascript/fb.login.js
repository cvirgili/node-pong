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
              FB.api('/me/feed', 'post', {
                      message: "Sto giocando a Node-Pong! ;)",
                      name: 'NodeJS-Pong',
                      description: ''

                  },
                  function(resp) {
                      console.log(JSON.stringify(resp, null, 1));
                      if (!resp || resp.error) {
                          console.log(resp.error);
                      } else {
                          console.log('Post ID: ' + resp.id);
                      }
                  });
              FB.api('/me/picture', { width: 200, height: 200 }, function(res) {
                  document.getElementById('profile-image').innerHTML = '<img src="' + res.data.url + '"/>';
                  socket.emit('user-photo', { n: number, url: res.data.url });
              });
          } else {
              document.getElementById('messages').innerText = 'User cancelled login or did not fully authorize.';
          }
      }, { scope: 'public_profile,email,publish_actions' });
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