function canvas(selector, options){
    const canvas = document.querySelector(selector);
    canvas.classList.add('canvas')
    canvas.setAttribute('width', `${options.width || 400}px`)
    canvas.setAttribute('height', `${options.height || 300}px`)
 
 
    // отримання контексту для малювання
    const context = canvas.getContext('2d')
    // отримуємо координати canvas відносно viewport
    const rect = canvas.getBoundingClientRect();
 
    // ...
    let isPaint = false // чи активно малювання
    let points = [] //масив з точками

    // об’являємо функцію додавання точок в масив
    const addPoint = (x, y, dragging, color, size) => {
        // преобразуємо координати події кліка миші відносно canvas
        points.push({
            x: (x - rect.left),
            y: (y - rect.top),
            dragging: dragging,
            color: color,
            size: size,
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
        for (let point of points){
            context.beginPath();
            context.strokeStyle=point.color;
            context.lineWidth=point.size;
            if (point.dragging && prevPoint){
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
        addPoint(event.pageX, event.pageY, false, bcolorBtn.value, bsizeBtn.value);
        redraw();
    }

    const mouseMove = event => {
        if(isPaint){
            addPoint(event.pageX, event.pageY, true, bcolorBtn.value, bsizeBtn.value);
            redraw();
        }
    }

    // додаємо обробку подій
    canvas.addEventListener('mousemove', mouseMove)
    canvas.addEventListener('mousedown', mouseDown)
    canvas.addEventListener('mouseup',() => {
        isPaint = false;
    });
    canvas.addEventListener('mouseleave',() => {
        isPaint = false;
    });

    // TOOLBAR
    const toolBar = document.getElementById('toolbar')
    // clear button
    const clearBtn = document.createElement('button')
    clearBtn.classList.add('btn')
    clearBtn.textContent = 'Clear'

    clearBtn.addEventListener('click', () => {
    // тут необхідно додати код очистки canvas та масиву точок (clearRect)
        context.clearRect(0, 0, context.canvas.width, context.canvas.height);
        var del=1;
        while(del!=undefined) del = points.pop();
    })
    

    // download button
    const downlBtn = document.createElement('button')
    downlBtn.classList.add('btn')
    downlBtn.textContent = 'Download'
    
    downlBtn.addEventListener('click', () => {
        const dataUrl = canvas.toDataURL("image/png").replace(/^data:image\/[^;]/, 'data:application/octet-stream');
        const newTab = window.open('about:blank','image from canvas');
        newTab.document.write("<img src='" + dataUrl + "' alt='from canvas'/>");
    })

    // save button
    const saveBtn = document.createElement('button')
    saveBtn.classList.add('btn')
    saveBtn.textContent = 'Save'

    saveBtn.addEventListener('click', () => {
        localStorage.setItem('points', JSON.stringify(points));
    })

    // restore button
    const restoreBtn = document.createElement('button')
    restoreBtn.classList.add('btn')
    restoreBtn.textContent = 'Restore'
    
    restoreBtn.addEventListener('click', () => {
        points = JSON.parse(localStorage.getItem('points'));
        redraw();
    })

    // timestamp button
    const timeBtn = document.createElement('button')
    timeBtn.classList.add('btn')
    timeBtn.textContent = 'Timestamp'

    timeBtn.addEventListener('click', () => {
        context.fillStyle="black";
        context.fillText(new Date().toLocaleTimeString(), 10, 20, 80);
    })

    // brush color button
    const bcolorBtn = document.getElementById("color-picker")
    
    bcolorBtn.addEventListener('input', () => {
        points.color=bcolorBtn.value;
    })


    // brush size button
    const bsizeBtn = document.getElementById("size-picker")
    //bsizeBtn.classList.add('btn')
    //bsizeBtn.textContent = 'Brush Size'

    bsizeBtn.addEventListener('input', () => {
        points.size=bsizeBtn.value;
    })

    // background button
    const backgrBtn = document.createElement('button')
    backgrBtn.classList.add('btn')
    backgrBtn.textContent = 'Background'

    backgrBtn.addEventListener('click', () => {
        const img = new Image;
        img.src =`https://www.fillmurray.com/200/300)`;
        img.onload = () => {
            context.drawImage(img, 0, 0);}
    })

    toolBar.insertAdjacentElement('afterbegin', backgrBtn)
    toolBar.insertAdjacentElement('afterbegin', bsizeBtn)
    toolBar.insertAdjacentElement('afterbegin', bcolorBtn)
    toolBar.insertAdjacentElement('afterbegin', timeBtn)
    toolBar.insertAdjacentElement('afterbegin', restoreBtn)
    toolBar.insertAdjacentElement('afterbegin', saveBtn)
    toolBar.insertAdjacentElement('afterbegin', downlBtn)
    toolBar.insertAdjacentElement('afterbegin', clearBtn)
 }