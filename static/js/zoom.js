function magnify(imgID, zoom, init_x, init_y) {
    var img = document.getElementById(imgID);
    // 如果元素带有 no-zoom，就不启用放大镜
    if (img.classList.contains('no-zoom')) return;

    var glass, w, h, bw;
    /* Create magnifier glass: */
    glass = document.createElement("DIV");
    glass.setAttribute("class", "img-magnifier-glass");
    glass.setAttribute("id", "img-magnifier-glass");

    /* Insert magnifier glass: */
    img.parentElement.insertBefore(glass, img);

    /* Set background properties for the magnifier glass: */
    glass.style.backgroundImage = "url('" + img.src + "')";
    glass.style.backgroundRepeat = "no-repeat";
    glass.style.backgroundSize = (img.width * zoom) + "px " + (img.height * zoom) + "px";
    bw = -5;
    w = glass.offsetWidth / 2;
    h = glass.offsetHeight / 2;

    var x = img.width * init_x;
    var y = img.height * init_y;
    /* Prevent the magnifier glass from being positioned outside the image: */
    if (x > img.width - (w / zoom)) { x = img.width - (w / zoom); }
    if (x < w / zoom) { x = w / zoom; }
    if (y > img.height - (h / zoom)) { y = img.height - (h / zoom); }
    if (y < h / zoom) { y = h / zoom; }
    /* Set the position of the magnifier glass: */
    glass.style.left = (x - w) + "px";
    glass.style.top = (y - h) + "px";
    /* Display what the magnifier glass "sees": */
    glass.style.backgroundPosition = "-" + ((x * zoom) - w + bw) + "px -" +
                                     ((y * zoom) - h + bw) + "px";

    /* Execute a function when someone moves the magnifier glass over the image: */
    glass.addEventListener("mousemove", moveMagnifier);
    img.addEventListener("mousemove", moveMagnifier);

    /* and also for touch screens: */
    glass.addEventListener("touchmove", moveMagnifier);
    img.addEventListener("touchmove", moveMagnifier);

    function moveMagnifier(e) {
      var pos, x, y;
      e.preventDefault();
      pos = getCursorPos(e);
      x = pos.x;
      y = pos.y;
      if (x > img.width - (w / zoom)) { x = img.width - (w / zoom); }
      if (x < w / zoom) { x = w / zoom; }
      if (y > img.height - (h / zoom)) { y = img.height - (h / zoom); }
      if (y < h / zoom) { y = h / zoom; }
      glass.style.left  = (x - w) + "px";
      glass.style.top   = (y - h) + "px";
      glass.style.backgroundPosition = "-" + ((x * zoom) - w + bw) +
                                       "px -" + ((y * zoom) - h + bw) + "px";
    }

    function getCursorPos(e) {
      var a, x = 0, y = 0;
      e = e || window.event;
      a = img.getBoundingClientRect();
      x = e.pageX - a.left - window.pageXOffset;
      y = e.pageY - a.top  - window.pageYOffset;
      return { x: x, y: y };
    }
}

window.addEventListener('load', function () {
    var scale = 3;
    magnify("zoom-in", scale, 0.615, 0.70);
});