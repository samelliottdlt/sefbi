let initializedFB;
export const asyncFB = new Promise((resolve, reject) => {
  initializedFB = resolve;
})

export let FB = window.FB;

export const initFbSdk = function() {
  window.fbAsyncInit = function() {
    window.FB.init({
      appId      : '1198409206939333',
      xfbml      : true,
      version    : 'v2.8'
    });
    window.FB.AppEvents.logPageView();
    FB = window.FB;
    initializedFB(window.FB);
  };

  (function(d, s, id){
     var js, fjs = d.getElementsByTagName(s)[0];
     if (d.getElementById(id)) {return;}
     js = d.createElement(s); js.id = id;
     js.src = "//connect.facebook.net/en_US/sdk.js";
     fjs.parentNode.insertBefore(js, fjs);
   }(document, 'script', 'facebook-jssdk'));
}
