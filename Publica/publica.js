$(function() {

    /*
    Singleton do publica, com as funções.
    */
    $.Publica = {

        /*
        Checa os campos vazios do formulário marcados através do atributo data.

        data-req é 1 se o campo for requirido.
        data-verbose é o nome verbal do campo.
        */
        checkForm : function(form, erro, sucesso) {
            dados = {};
            erros = [];
            $.each(form.find("input, textarea"), function() {
                $this = $(this);
                if ($this.attr("id") == "recaptcha_challenge_field") {
                    dados.challenge = $this.val();
                } else if ($this.attr("id") == "recaptcha_response_field") {
                    dados.response = $this.val();
                } else {
                    if (($this.val() == "" || $this.val() == "- selecione -" || $this.val() == "DDD") && $this.data("req") == 1) {
                        erros.push($this.data("verbose"));
                    }
                    dados[$this.data("verbose")] = $this.val();
                }
            });
            if (erros.length > 0) {
                erro(erros);
            } else {
                sucesso(dados);
            }
        }, 

        /*
        getJSON para domínio cruzado.

        Utiliza JSONP para IE versão < 8.
        */
        XDomainJSON2 : function(url, dados, success) {
            if ($.browser.msie && window.XDomainRequest) {
                // Use Microsoft XDR for IE8+
                var xdr = new XDomainRequest();
                var query_string = ""
                $.each(dados, function(k, v) {
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

        /*
        Utiliza JSONP para dados x-domain com cache
        */
        XDomainJSON : function(url, dados, success) {
                if (window.counter == undefined) {
                    window.counter = 0;
                }
                $.getScript = function(url2, data) {
                    $.ajax({
                                type: "GET",
                                url: url2,
                                data: data,
                                dataType: "script",
                                cache: true
                    });
                };
                function publica(data) {
                    success(data);
                }
                window["publica" + counter] = publica;
                $.getScript(url + "?callback=publica" + counter++,
                            dados);
                /*$.getJSON(url + "?callback=?",
                          dados,
                          function(data){
                              success(data);
                          });*/
        },
        

        /*
        Conserta um link removendo o id do site, para ser usado com o
        mustache.js
        */
        correctLink: function(link) {
            return function(text, render){
                return render(text).split("/").slice(1).join("/")
            }
        },

        /*
        Funcao simples que retorna a string com tamanho 10 para retirar
         as horas
        */        
        retornaData:function(data) {
            return function(text, render){
                return render(text).substring(0,10)
            }      
      }

    };

});
