/* eslint-disable @typescript-eslint/no-explicit-any */

import { deg2rad, timeoutFrame, timeoutFrameScalar } from '../variables'

type CarProps = {
  image: CanvasImageSource
  startCenterCoords: any
  controls: Controls
  mass?: any
}

type Controls = {
  up?: KeyboardEvent['code']
  down?: KeyboardEvent['code']
  left?: KeyboardEvent['code']
  right?: KeyboardEvent['code']
}

export class Car {
  acceleration = 100 // px/s^2
  image
  coordsCenter: number[] = []
  prevCoords: Car['coordsCenter'] = []
  currentMoveDir = 0
  currentSlowdownRate = 1
  isSlowing = false
  maxrotationDeg = 10 // deg
  maxSpeed = 500 // px per sec
  mass
  movingTimer: NodeJS.Timeout | null = null
  rotationDeg? = 0 // deg
  rotationSpeed = 200 // deg per sec
  rotationTimer: NodeJS.Timeout | null = null
  width = 22 // px
  height = 40 // px
  slowdown = -50 // px/s^2
  slowdownRate = 8
  speed = 0 // px per sec
  speedReset = -20 // px

  constructor({
    image,
    startCenterCoords,
    controls = {},
    mass = 10,
  }: CarProps) {
    this.coordsCenter = startCenterCoords

    this.prevCoords = [...this.coordsCenter]

    this.image = image
    this.mass = mass

    this.addControls(controls)
  }

  getPathCoords(offsetX = 0, offsetY = 0) {
    const [cx, cy] = this.coordsCenter
    // центр ротации смещен к задней части
    const x1 = cx - this.width / 2 - offsetX
    const y1 = cy - (this.height - (this.width * 2) / 3) - offsetY
    return [
      [x1, y1],
      [x1 + this.width, y1],
      [x1 + this.width, y1 + this.height],
      [x1, y1 + this.height],
    ]
  }

  makeCoords() {
    // S = V0 * t + a * t^2 / 2
    const step =
      this.currentMoveDir *
      (this.speed * timeoutFrameScalar +
        (this.acceleration * Math.pow(timeoutFrameScalar, 2)) / 2)
    this.coordsCenter[0] += Math.sin(deg2rad(-(this.rotationDeg ?? 0))) * step
    this.coordsCenter[1] += Math.cos(deg2rad(-(this.rotationDeg ?? 0))) * step

    // V = a * t
    if (this.speed >= this.maxSpeed) {
      this.speed = this.maxSpeed
    }
    const a = this.isSlowing
      ? this.slowdown * this.currentSlowdownRate
      : this.acceleration
    this.speed += a * timeoutFrameScalar

    if (this.speed < 0) {
      this.speed = 0
      this.isSlowing = false
    }
  }

  move(dir = 1) {
    // начало движения
    if (!this.currentMoveDir || this.speed <= 0) {
      this.currentMoveDir = dir
    }

    // тормоз
    if (this.currentMoveDir && this.currentMoveDir !== dir) {
      this.currentSlowdownRate = this.slowdownRate
    } else {
      this.isSlowing = false
    }

    // if (this.isEngineBlocked) return;

    if (!this.movingTimer) {
      this.movingTimer = setInterval(() => {
        this.makeCoords()
      }, timeoutFrame)
    }
  }

  rotate(dir = 1) {
    if (dir === 0) {
      this.rotationTimer && clearInterval(this.rotationTimer)
      this.rotationTimer = null
    } else if (!this.rotationTimer) {
      this.rotationTimer = setInterval(() => {
        if (this.speed > 0) {
          this.rotationDeg =
            (this.rotationDeg ?? 0) +
            (dir * this.rotationSpeed * timeoutFrame) / 1000
        }
      }, timeoutFrame)
    }
  }

  stop() {
    this.isSlowing = true
    this.currentSlowdownRate = 1

    if (this.movingTimer) {
      clearInterval(this.movingTimer)
      this.movingTimer = null
    }

    this.movingTimer = setInterval(() => {
      this.makeCoords()

      if (this.speed <= 0) {
        this.movingTimer && clearInterval(this.movingTimer)
        this.movingTimer = null
      }
    }, timeoutFrame)
  }

  addControls({ up, down, left, right }: Controls) {
    window.addEventListener('keydown', (e) => {
      switch (e.code) {
        case up:
          this.move(-1)
          break
        case down:
          this.move(1)
          break
        case left:
          this.rotate(-1)
          break
        case right:
          this.rotate(1)
          break
        default:
      }
    })

    window.addEventListener('keyup', (e) => {
      switch (e.code) {
        case up:
        case down:
          this.stop()
          break
        case left:
        case right:
          this.rotate(0)
          break
        default:
      }
    })
  }

  draw(ctx: CanvasRenderingContext2D) {
    const [[x0, y0]] = this.getPathCoords(...this.coordsCenter)
    ctx.drawImage(this.image, x0, y0, this.width, this.height)
  }
}
