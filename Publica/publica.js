$(function() {

    /*
    Singleton do publica, com as funções.
    */
    $.Publica = {

        /*
        
        */
        getData : function(options) {
        },

        /*
        getJSON para domínio crusado.

        Utiliza JSONP para IE versão < 8.
        */
        XDomainJSON : function(url, dados, success) {
            if ($.browser.msie && window.XDomainRequest) {
                // Use Microsoft XDR for IE8+
                var xdr = new XDomainRequest();
                var query_string = ""
                $.each(data, function(k, v) {
                       query_string += k + "=" + escape(v) + "&"
                });
                var separator = url.search("[?]") > -1 ? "&" : "?"
                url = url + separator + query_string
                xdr.open("get", url);
                xdr.onload = function() {
                    var resposta = xdr.responseText;
                    var json = $.parseJSON(resposta);
                    success(json);
                };
                xdr.send();
            } else if ($.browser.msie) {
                // JSONP will change the URL, it's needed to configure the 
                // cache to ignore it as it will change the url in each call. 
                // This block is for IE version < 8
                $.getJSON(url + "?callback=?",
                          dados,
                          function(data){
                              success(data);
                          });
            } else {
                // Other modern browsers support cross-origin resource sharing
                $.getJSON(url, 
                          dados, 
                          function(data){
                              success(data);
                          });
            }
        },

        

        

    };

});



























