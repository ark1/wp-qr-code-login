(function($){    
	$(document).ready(function(){
        
        // check to see if we're on the login pages
		if ($('body').hasClass('login') && $('body').hasClass('wp-core-ui') && $('#login').length > 0) {
            
            // set width for qrcode
            var qrWidth = 201,
            wpInstallUrl = qrLoginAjaxRequest.ajaxurl.replace("wp-admin/admin-ajax.php", ""),
            hashUrl = wpInstallUrl + 'unlock.digital/?qrHash=' + qrLoginAjaxRequest.qrHash,
            regex = new RegExp("[\\?&]redirect_to=([^&#]*)"),
            results = regex.exec(location.search);
            
            // append the qr code to the login form
			$('#loginform').append('<div id="qrHash" style="display:block;width:' + qrWidth + 'px;height:auto;margin: 0 auto;"><img></div>').css({'padding-bottom':0});
			$('#qrHash img').attr('src', hashUrl);
            
            // longpoll the db to see if someone used the qr code to log in
			var sendAjax = function() {
				$.post(qrLoginAjaxRequest.ajaxurl, { 
					action : 'ajax-qrLogin',
			        qrHash : qrLoginAjaxRequest.qrHash,
			        QRnonce : qrLoginAjaxRequest.qrLoginNonce
			    },function( response ){
                    // Will return the qrHash if user logs in
			    	if (response === qrLoginAjaxRequest.qrHash){
                        var hasQuery = window.location.href.indexOf("?") > -1;
                        // reload the page so user can be logged in
                        window.location = null !== results ? decodeURIComponent(results[1]) : wpInstallUrl;
				    } else if(response === 'hash gone') {
                        // too much time has passed reload and get a new qrcode
                        window.location.reload();
                    } else {
                        // if the response is negative poll again
				    	sendAjax();
				    }
			    });
			};
            // initiate long poll
			sendAjax();
            
	    }
	});
})(jQuery);