let nextCornerId = 1; // for identifying specific corners in the builder
window.localStorage.length > 0 ? restoreFromCache() : init();
document.getElementsByClassName("reset-design-button")[0].onclick = clearDesign;

function init() { // initialization
  const board = document.getElementsByClassName("room-builder-board")[0];
  while (nextCornerId < 5) {
    const corner = document.createElement("div");
    corner.id = "draggable";
    corner.classList.add("ui-widget-content");
    corner.classList.add("corner-" + nextCornerId++);
    dragElement(corner);
    board.appendChild(corner);
  }
  makeConnections();
}

function makeConnections() {  // removes the lines and recalculates them whenever a corner is added/moved/removed
    let arr = [...document.getElementsByClassName("ui-widget-content")];
    [...document.getElementsByClassName("diagonal")].forEach(elem => elem.remove());
    for (let i = 0; i < arr.length; ++i) {
        const div1 = arr[i];
        const div2 = i == arr.length-1 ? arr[0] : arr[i+1];
        connect(div1, div2, "black", "5");
    }
    cache();
}

function dragElement(elem) { // sets properties for dragging corners
  let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  elem.onmousedown = dragMouseDown;
  elem.oncontextmenu = removeElem; // right click

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    elem.style.cursor = 'grabbing';

    pos3 = e.pageX;
    pos4 = e.pageY;
    document.onmouseup = closeDragElement;
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    
    pos1 = pos3 - e.pageX;
    pos2 = pos4 - e.pageY;
    pos3 = e.pageX;
    pos4 = e.pageY;

    // stop from dragging a corner off of the builder
    if (elem.offsetLeft - pos1 < 303) {
      elem.style.left = 303 + "px";
      return;
    } else if (elem.offsetTop - pos2 < 217) {
      elem.style.top = 217 + "px";
      return;
    } else if (elem.offsetTop - pos1 > 900) {
      elem.style.top = 900 + "px";
      return;
    } else if (elem.offsetLeft - pos2 > 1870) {
      elem.style.left = 1870 + "px";
      return;
    }
    
    elem.style.top = (elem.offsetTop - pos2) + "px";
    elem.style.left = (elem.offsetLeft - pos1) + "px";
    makeConnections();
  }

  function closeDragElement() {
    document.onmouseup = null;
    document.onmousemove = null;
    elem.style.cursor = 'grab';
    cache();
  }

  function removeElem(e) {
    e = e || window.event;
    e.preventDefault();
    if (document.getElementsByClassName('ui-widget-content').length > 2) {
      elem.remove();
      makeConnections();
    }
    cache();
  }
}

function connect(div1, div2, color, thickness) { // creates a line between two divs
  
    let x1 = div1.offsetLeft + 15;
    let y1 = div1.offsetTop + 10;
    
    let x2 = div2.offsetLeft + 15;
    let y2 = div2.offsetTop + 10;
    
    let length = Math.sqrt(((x2-x1) * (x2-x1)) + ((y2-y1) * (y2-y1)));
    
    let cx = ((x1 + x2) / 2) - (length / 2);
    let cy = ((y1 + y2) / 2) - (thickness / 2);
    
    let angle = Math.atan2((y1-y2),(x1-x2))*(180/Math.PI);

    let elem = document.createElement("div");
    elem.id = 'diag';
    elem.classList.add("diagonal");
    elem.firstDiv = div1.className; // going to use this for adding new corners
    elem.secondDiv = div2.className; // this saves the ui-widget-content divs (corners) on either side of the line
    elem.style.cssText = 'padding:0px; margin:0px; line-height:1px; position:absolute; background-color: ' + color + ';';
    styleElem(elem, cx, cy, length, angle);

    elem.ondblclick = createCorner;

    document.getElementById('diagonal-list').appendChild(elem);

    function createCorner(e) {  // creates a new corner when the user double clicks on a line
      const prevDiv = document.getElementsByClassName(elem.firstDiv)[0];
      const newDiv = document.createElement("div");
      newDiv.id = "draggable";
      newDiv.classList.add("ui-widget-content");
      newDiv.classList.add("corner-" + nextCornerId++);
      newDiv.style.top = (e.pageY - 15) + "px";
      newDiv.style.left = (e.pageX - 15) + "px";

      prevDiv.after(newDiv);
      dragElement(newDiv);
      makeConnections();
      cache();
    }
}

function styleElem(elem, left, top, wid, angle) { // adds style elements to the line between divs that can't seem to be done properly through style.cssText
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

function cache() { // saves the current design in local storage, gets called after most types of edits
  const storage = window.localStorage;
  let corners = {};
  let cornerNum = 1;
  storage.setItem("corners", JSON.stringify([...document.getElementsByClassName("ui-widget-content")].reduce((a, c) => {
    a["corner-" + cornerNum++] = c.outerHTML;
    return a;
  }, {})));
}

function restoreFromCache() { // restores from the cached data if there is any
  const storage = window.localStorage;
  if (storage.length > 0) {
    const corners = JSON.parse(storage.corners);
    [...document.getElementsByClassName("ui-widget-content")].forEach(elem => elem.remove());
    const board = document.getElementsByClassName("room-builder-board")[0];
    for (const [key, value] of Object.entries(corners)) {
      const elem = htmlToElement(value);
      dragElement(elem);
      board.appendChild(elem);
    }
    nextCornerId = Object.keys(corners).length + 1;
    makeConnections();
  }
}

function htmlToElement(html) { // converts a stringified HTML element into an actual HTML element
  var template = document.createElement('template');
  html = html.trim();
  template.innerHTML = html;
  return template.content.firstChild;
}

function clearDesign() { // resets the design to the default and clears cache to prevent it from going back to the cached setup upon reload
  window.localStorage.clear();
  nextCornerId = 1;
  [...document.getElementsByClassName("ui-widget-content")].forEach(elem => elem.remove());
  init();
}

