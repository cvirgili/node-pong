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
              FB.api('/me', { fields: 'name, email, picture.width(200).height(200)' }, function(res) {
                  console.log(JSON.stringify(res, null, 1));
                  document.getElementById('name').innerText = res.name;
                  socket.emit('user-photo', { n: number, url: res.picture.data.url });
                  document.getElementById('profile-image').innerHTML = '<img src="' + res.picture.data.url + '"/>';
              });
              //////////////////////////////////////////////////////////////////////////////////////////////////////
              //POST SU FB DOPO IL LOGIN
              //////////////////////////////////////////////////////////////////////////////////////////////////////

              FB.api('/me/feed', 'post', {
                      message: "Sto giocando a Pong! ;)",
                      name: 'NodeJS-Pong',
                      description: ''
                  },
                  function(resp) {
                      if (!resp || resp.error) {
                          console.log(resp.error);
                      } else {
                          console.log('Post ID: ' + resp.id);
                      }
                  });
              //   FB.api('/me/picture', { width: 200, height: 200 }, function(res) {
              //     socket.emit('user-photo', { n: number, url: res.data.url });
              //     document.getElementById('profile-image').innerHTML = '<img src="' + res.data.url + '"/>';
              //   });
              //////////////////////////////////////////////////////////////////////////////////////////////////////
              var p = new player(number, socket);
              //////////////////////////////////////////////////////////////////////////////////////////////////////
          } else {
              document.getElementById('messages').innerText = 'Ups :( ';
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
  }(document, 'script', 'facebook-jssdk'));