function canvas(selector, options) {
  const canvas = document.querySelector(selector);
  canvas.classList.add('canvas')
  canvas.setAttribute('width', `${options.width || 400}px`)
  canvas.setAttribute('height', `${options.height || 300}px`)


  // отримання контексту для малювання
  const context = canvas.getContext('2d')
  // отримуємо координати canvas відносно viewport
  const rect = canvas.getBoundingClientRect();

  let isPaint = false // чи активно малювання
  let points = [] //масив з точками

  // об’являємо функцію додавання точок в масив
  const addPoint = (x, y, dragging) => {
    // преобразуємо координати події кліка миші відносно canvas
    points.push({
      x: (x - rect.left),
      y: (y - rect.top),
      dragging: dragging
    })
  }

  // головна функція для малювання
  const redraw = () => {
    //очищуємо  canvas
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);

    context.strokeStyle = options.strokeColor;
    context.lineJoin = "round";
    context.lineWidth = options.strokeWidth;
    let prevPoint = null;
    // console.log(points);
    for (let point of points) {
      context.beginPath();
      if (point.dragging && prevPoint) {
        context.moveTo(prevPoint.x, prevPoint.y)
      } else {
        context.moveTo(point.x - 1, point.y);
      }
      context.lineTo(point.x, point.y)
      context.closePath()
      context.stroke();
      prevPoint = point;
    }
  }

  // функції обробники подій миші
  const mouseDown = event => {
    isPaint = true
    addPoint(event.pageX, event.pageY);
    redraw();
  }

  const mouseMove = event => {
    if (isPaint) {
      addPoint(event.pageX, event.pageY, true);
      redraw();
    }
  }

  // додаємо обробку подій
  canvas.addEventListener('mousemove', mouseMove)
  canvas.addEventListener('mousedown', mouseDown)
  canvas.addEventListener('mouseup', () => {
    isPaint = false;
  });
  canvas.addEventListener('mouseleave', () => {
    isPaint = false;
  });
  // TOOLBAR
  const toolBar = document.getElementById('toolbar');

  // clear button
  const clearBtn = document.createElement('button');
  clearBtn.classList.add('btn');
  let clearIcon = document.createElement('i');
  clearIcon.classList.add('fas');
  clearIcon.classList.add('fa-broom');
  clearBtn.appendChild(clearIcon);

  clearBtn.addEventListener('click', () => {
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    points = [];
  })
  toolBar.insertAdjacentElement('afterbegin', clearBtn);


  // download image button
  const downloadBtn = document.createElement('button');
  downloadBtn.classList.add('btn');
  let downloadIcon = document.createElement('i');
  downloadIcon.classList.add('fas');
  downloadIcon.classList.add('fa-cloud-download-alt');
  downloadBtn.appendChild(downloadIcon);

  downloadBtn.addEventListener('click', () => {
    const dataUrl = canvas.toDataURL("image/png").replace(/^data:image\/[^;]/, 'data:application/octet-stream');
    const newTab = window.open('about:blank', 'image from canvas');
    newTab.document.write("<img src='" + dataUrl + "' alt='from canvas'/>");
  })
  toolBar.insertAdjacentElement('afterbegin', downloadBtn);

  // save button
  const saveBtn = document.createElement('button')
  saveBtn.classList.add('btn')
  let saveIcon = document.createElement('i');
  saveIcon.classList.add('fas');
  saveIcon.classList.add('fa-save');
  saveBtn.appendChild(saveIcon);

  saveBtn.addEventListener('click', () => {
    localStorage.setItem('points', JSON.stringify(points));
  })
  toolBar.insertAdjacentElement('afterbegin', saveBtn);

  // restore button
  const restoreBtn = document.createElement('button')
  restoreBtn.classList.add('btn')
  let restoreIcon = document.createElement('i');
  restoreIcon.classList.add('far');
  restoreIcon.classList.add('fa-window-restore');
  restoreBtn.appendChild(restoreIcon);

  restoreBtn.addEventListener('click', () => {
    let stringified_points = localStorage.getItem('points');
    points = JSON.parse(stringified_points);
    console.log(points);
    isPaint= true;
    redraw();
    isPaint = false;
  })
  toolBar.insertAdjacentElement('afterbegin', restoreBtn);

  // timestamp button
  const timeBtn = document.createElement('button');
  timeBtn.classList.add('btn');
  let timeIcon = document.createElement('i');
  timeIcon.classList.add('far');
  timeIcon.classList.add('fa-clock');
  timeBtn.appendChild(timeIcon);

  timeBtn.addEventListener('click', () => {
    let date = new Date();
    context.fillText(date.toString(), context.canvas.width - 330, context.canvas.height - 285);
  });
  toolBar.insertAdjacentElement('afterbegin', timeBtn);

  // color picker
  const colorPicker = document.getElementById("color-picker");
  colorPicker.addEventListener("change", () => {
    options.strokeColor = colorPicker.value;
  });

  // brush picker
  const brushPicker = document.getElementById("brush-picker");
  brushPicker.addEventListener("change", () => {
    options.strokeWidth = brushPicker.value;
  });

  // background
  const setBackBtn = document.createElement('button')
  setBackBtn.classList.add('btn')
  let backIcon = document.createElement('i');
  backIcon.classList.add('far');
  backIcon.classList.add('fa-images');
  setBackBtn.appendChild(backIcon);

  setBackBtn.addEventListener('click', () => {
    const img = new Image;
    img.src = `https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/Python_logo_and_wordmark.svg/1200px-Python_logo_and_wordmark.svg.png`;
    img.onload = () => {
      context.drawImage(img, 0, 0);
    };
  });
  toolBar.insertAdjacentElement('afterbegin', setBackBtn);
}
