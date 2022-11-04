// dragElement(document.getElementById("draggable"));
[...document.getElementsByClassName("ui-widget-content")].forEach(elem => dragElement(elem));
makeConnections();

function makeConnections() {
    let arr = [...document.getElementsByClassName("ui-widget-content")];
    [...document.getElementsByClassName("diagonal")].forEach(elem => elem.remove());
    for (let i = 0; i < arr.length; ++i) {
        const div1 = arr[i];
        const div2 = i == arr.length-1 ? arr[0] : arr[i+1];
        connect(div1, div2, "black", "5");
    }
}

function dragElement(elmnt) {
  let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  elmnt.onmousedown = dragMouseDown;

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position:
    elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
    elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
    makeConnections();
  }

  function closeDragElement() {
    // stop moving when mouse button is released:
    document.onmouseup = null;
    document.onmousemove = null;
    // makeConnections();
  }
}

function connect(div1, div2, color, thickness) { // draw a line connecting elements
    // bottom right
    let x1 = div1.offsetLeft + 15;
    let y1 = div1.offsetTop + 15;
    // top right
    let x2 = div2.offsetLeft + 15;
    let y2 = div2.offsetTop + 15;
    // distance
    let length = Math.sqrt(((x2-x1) * (x2-x1)) + ((y2-y1) * (y2-y1))) - 20;
    // center
    let cx = ((x1 + x2) / 2) - (length / 2);
    let cy = ((y1 + y2) / 2) - (thickness / 2);
    // angle
    let angle = Math.atan2((y1-y2),(x1-x2))*(180/Math.PI);
    // make hr

    let elem = document.createElement("div");
    elem.id = 'diag';
    elem.classList.add("diagonal");
    elem.style.cssText = 'padding:0px; margin:0px; height:" + thickness + "px; line-height:1px; position:absolute; background-color: ' + color + ';';
    styleElem(elem, cx, cy, length, angle);

    // document.body.appendChild(elem);
    document.getElementById('container').appendChild(elem);
}

function styleElem(elem, left, top, wid, angle) {
    elem.style.background = 'black';
    elem.style.height = '15px';
    elem.style.left = left + 'px';
    elem.style.top = top + 'px';
    elem.style.width = wid + 'px';
    elem.style.MozTransform = 'rotate(' + angle + 'deg)';
    elem.style.WebkitTransform = 'rotate(' + angle + 'deg)';
    elem.style.OTransform = 'rotate(' + angle + 'deg)';
    elem.style.msTransform = 'rotate(' + angle + 'deg)';
    elem.style.transform = 'rotate(' + angle + 'deg)';
}