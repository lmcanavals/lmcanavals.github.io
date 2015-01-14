!(function(document, window) {
  window.onload = function() {
    var generate = document.getElementById("generate");
    generate.onclick = function() {
      var product = document.getElementById("product");
      var upp = document.getElementById("upp");
      var low = document.getElementById("low");
      var num = document.getElementById("num");
      var cusval = document.getElementById("cus").value;
      var lenval = document.getElementById("len").value;
      var s = "";
      if (upp.checked) {
        s += "AOEUISNTHDQJKXZVWMBPYLCGRF";
      }
      if (low.checked) {
        s += "aoeuisnthdqjkxzvwmbpylrcgf";
      }
      if (num.checked) {
        s += "6549873210";
      }
      s += cusval.replace(/ /g, "");
      var a = "";
      while (a.length < lenval) {
        a += s.charAt(Math.floor(Math.random() * s.length));
      }
      product.textContent = a;
    }
  }
})(document, window);
