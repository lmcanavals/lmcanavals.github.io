!((document, window) => {
  window.onload = () => {
    const generate = document.getElementById("generate");
    generate.onclick = function() {
      const product = document.getElementById("product"),
            upp = document.getElementById("upp"),
            low = document.getElementById("low"),
            num = document.getElementById("num"),
            cusval = document.getElementById("cus").value,
            lenval = document.getElementById("len").value;
      let s = "";
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
      let a = "";
      while (a.length < lenval) {
        a += s.charAt(Math.floor(Math.random() * s.length));
      }
      product.textContent = a;
    }
  }
})(document, window);
