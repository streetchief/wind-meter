const degToRad = deg => deg * Math.PI / 180
const parametricX = (originX, radius, radians) => originX + (radius * Math.cos(radians))
const parametricY = (originY, radius, radians) => originY - (radius * Math.sin(radians))
const twoPi = 2 * Math.PI;
const midPoint = 150.5
const radius = 101
const innerRadius = radius - 25;

/** @type {HTMLCanvasElement} */
const canvas = document.getElementById('wind-meter')
const ctx = canvas.getContext("2d")

const setStroke = color => () => ctx.strokeStyle = color
const strokeBlack = setStroke('black')
const strokeRed = setStroke('red')
const setFill = color => () => ctx.fillStyle = color
const fillRed = setFill('red')
const fillGreen = setFill('green')

const drawCircle = () => {
    ctx.beginPath();
    const x = midPoint;
    const y = midPoint
    ctx.arc(x, y, radius, 0, twoPi, true)
    ctx.stroke()
}

const drawCrosshair = () => {
    const length = 9
    const halfLength = length / 2
    ctx.beginPath()
    ctx.moveTo(midPoint, midPoint - halfLength)
    ctx.lineTo(midPoint, midPoint + halfLength)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(midPoint - halfLength, midPoint)
    ctx.lineTo(midPoint + halfLength, midPoint)
    ctx.stroke()
}

const drawArrow = () => {
    ctx.beginPath()
    ctx.moveTo(midPoint, midPoint - innerRadius)
    const fiveEighths = twoPi * (5/8)
    const pointOneX = parametricX(midPoint, innerRadius, fiveEighths)
    const pointOneY = parametricY(midPoint, innerRadius, fiveEighths)
    ctx.lineTo(pointOneX, pointOneY)
    const secondX = parametricX(midPoint, innerRadius, (-1 * Math.PI) / 4 )
    ctx.lineTo(secondX, pointOneY)
    ctx.closePath()
    ctx.stroke()
}

const initialize = () => {
    drawCrosshair()
    drawCircle()
    drawArrow()
}

/** @param {MouseEvent} event */
const canvasClick = (event) => {
    console.log('canvas', event)
    const x = event.clientX - canvas.offsetLeft
    const y = event.clientY - canvas.offsetTop
    // const pixel = ctx.getImageData(mousePos.x, mousePos.y, 1, 1).data;
    ctx.beginPath()
    ctx.arc(x, y, 10, 0, twoPi, true)
    fillGreen()
    ctx.fill()
}

const resetClick = (event) => {
    console.log('reset', event)
    ctx.reset()
    initialize()
}

strokeBlack()
initialize()
canvas.addEventListener('click', canvasClick)
document.getElementById('reset')?.addEventListener('click', resetClick)