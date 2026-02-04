//#region HTMLElements

/** @type {HTMLCanvasElement} */
const canvas = document.getElementById('wind-arrow')
const ctx = canvas.getContext("2d")
const angleDisplay = document.getElementById('angle')
const coordinatesDisplay = document.getElementById('coords')
const windMeter = document.getElementById('wind-value')
const windMeterX = document.getElementById('wind-x')
const windMeterY = document.getElementById('wind-y')

//#endregion

//#region Constants

const twoPi = 2 * Math.PI;
const eigths = {
    1: twoPi / 8,
    2: twoPi / 4,
    3: twoPi * (3 / 8),
    5: twoPi * (5 / 8),
};

const midPoint = 150.5
const radius = 101
const innerRadius = radius - 25;

//#endregion

//#region Methods

const degToRad = deg => deg * Math.PI / 180
const radToDeg = rad => (rad * 180) / Math.PI
const rounder = num => num.toFixed(1)

const parametricX = (originX, radius, radians) => {
    return originX + (radius * Math.cos(radians))
}

/**
 * N.B. we subtract instead of add due to the way the fact that y increases as it moves down on a webpage instead of up as on the Cartesian plane.
 * @param {number} originY 
 * @param {number} radius 
 * @param {number} radians 
 * @returns {number}
 */
const parametricY = (originY, radius, radians) => {
    return originY - (radius * Math.sin(radians))
}

const getAngle = () => {
    const text = angleDisplay.innerText;
    if (text === '-') return
    return Number(text)
}

const setAngle = (val = '-') => {
    angleDisplay.innerText = val === '-' ? '-' : rounder(val);
}

const setCoords = (x = '-', y = '-') => {
    coordinatesDisplay.innerText = `x: ${x} y: ${y}`
}

const setWindX = (val) => {
    windMeterX.value = typeof val === 'number' ? rounder(val) : '-';
}

const setWindY = val => {
    windMeterY.value = typeof val === 'number' ? rounder(val) : '-';
}

const getWindMeter = () => {
    const value = windMeter.value;
    if (value === '') return undefined
    return Number(windMeter.value);
}

const setWindMeter = (num = 5) => {
    windMeter.value = num;
}

const onWindInput = (_event) => {
    const wind = getWindMeter()
    const theta = getAngle()

    if (wind === undefined || theta === undefined) {
        setWindX()
        setWindY()
        return;
    }


    console.debug('wind change', wind, theta)

    const windX = wind * Math.cos(theta)
    const windY = wind * Math.sin(theta)
    setWindX(windX)
    setWindY(windY)
}

const calculateQuadrant = (x, y) => {
    if (x > midPoint) {
        if (y > midPoint) return 4
        return 1
    }

    if (y > midPoint) return 3
    return 2
}

/**
 * Counter-clockwise from +x
 * @param {number} theta radians from x axis
 * @param {1|2|3|4} quadrant 
 * @returns {number}
 */
const calculateRotationRadians = (theta, quadrant) => {
    if (quadrant === 1) return theta
    if (quadrant === 2) return Math.PI - theta
    if (quadrant === 3) return Math.PI + theta
    return twoPi - theta
}

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

/**
 * 
 * @param {number} tipX 
 * @param {number} tipY 
 */
const drawRotatedArrow = (tipX, tipY) => {
    const tipToWing = eigths[3]
    const tipToTip = eigths[2]
    ctx.beginPath()
    const horizontalDiff = Math.abs(tipX - midPoint)
    const vertDiff = Math.abs(tipY - midPoint)
    const theta = Math.atan(vertDiff / horizontalDiff)
    setAngle(theta)
    const quadrant = calculateQuadrant(tipX, tipY)
    const rotation = calculateRotationRadians(theta, quadrant)
    const windX = windMeter.value * Math.cos(theta)
    const windY = windMeter.value * Math.sin(theta)
    setWindX(windX)
    setWindY(windY)
    const nearestX = parametricX(midPoint, radius, rotation)
    const nearestY = parametricY(midPoint, radius, rotation)
    ctx.moveTo(nearestX, nearestY)
    const p1Rotation = rotation + tipToWing
    const p1X = parametricX(midPoint, radius, p1Rotation)
    const p1Y = parametricY(midPoint, radius, p1Rotation)
    ctx.lineTo(p1X, p1Y)
    const p2Rotation = p1Rotation + tipToTip
    const p2X = parametricX(midPoint, radius, p2Rotation)
    const p2Y = parametricY(midPoint, radius, p2Rotation)
    ctx.lineTo(p2X, p2Y)
    ctx.closePath()
    ctx.stroke()
}

const initialize = () => {
    drawCrosshair()
    drawCircle()
}

/** @param {MouseEvent} event */
const canvasClick = (event) => {
    // const pixel = ctx.getImageData(mousePos.x, mousePos.y, 1, 1).data;
    console.debug('canvas', event)
    const x = event.clientX - canvas.offsetLeft
    const y = event.clientY - canvas.offsetTop
    setCoords(x, y)
    ctx.beginPath()
    ctx.arc(x, y, 5, 0, twoPi, true)
    fillGreen()
    ctx.fill()
    drawRotatedArrow(x, y)
}

const resetClick = (_event) => {
    setCoords()
    setAngle()
    ctx.reset()
    initialize()
    setWindX()
    setWindY()
    setWindMeter()
}

//#endregion

strokeBlack()
initialize()
canvas.addEventListener('click', canvasClick)
document.getElementById('reset').addEventListener('click', resetClick)
windMeter.addEventListener('input', onWindInput)
