$(function(){
  var id_location = $.cookie("location");
  var url =  BASE_AJAX + "apps,1,2/segmentacao";
  var obrigatorios = OBG;
  if (id_location){
    var relevantes = OBG + ',' + id_location;
  } else {
    var relevantes = OBG
  }
  var limit=3;

  var template = $("#tpl_not").html()
  var ind = 0
  function getClass(){
    ind++;
    if (ind % 3 == 1){
      return "alpha"
    } else if (ind % 3 == 2) {
      return ""
    } else {
      return "omega"
    }
  }
  
  function correctLink(){
    return function(text, render){
      return render(text).split("/").slice(1).join("/")
    }
  }

  function gerarDestaque(data) {
    var dados = data.ok;
    var view = {getClass:getClass,
                correctLink:correctLink,
                dados:dados}
    html = Mustache.to_html(template, view);
    $("#not_dest").html(html)
    $("#load_noticias").hide();
    $("#box_noticias").fadeIn(1000);
  }

  var x_domain = true;

  if (x_domain) {
    if ($.browser.msie && window.XDomainRequest) {
      // Use Microsoft XDR for IE8+
      var xdr = new XDomainRequest();
      xdr.open("get", url + "?obrigatorios=" + obrigatorios + "&relevantes=" + relevantes);
      xdr.onload = function() {
        var resposta = xdr.responseText;
        var json = $.parseJSON(resposta);
        gerarDestaque(json);
      };
      xdr.send();
    } else if ($.browser.msie) {
      // JSONP will change the URL, it's needed to configure the cache 
      // to ignore it. This block is for IE version < 8
      $.getJSON(url + "?obrigatorios=" + obrigatorios + "&relevantes=" + relevantes + "&callback=?",
                  function(data){
                    gerarDestaque(data);
                  });
    } else {
      // Other modern browsers support cross-origin resource sharing
      $.getJSON(url, 
                {obrigatorios:obrigatorios,
                 relevantes:relevantes}, 
                 function(data){
                   gerarDestaque(data);
                 });
    }
  } else {
    $.getJSON(url, 
                {obrigatorios:obrigatorios,
                 relevantes:relevantes,
                 limit:limit}, 
                 function(data){
                   gerarDestaque(data);
                 });
  }
});
