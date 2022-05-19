/* eslint-disable no-console */
import { useEffect } from 'react'
import { Car } from './classes/Car'
import { deg2rad, rand, resources, resourcesCount } from './variables'

export const CarView: React.FC = () => {
  useEffect(() => {
    const canvas = window.document.getElementById(
      'app-canvas'
    ) as HTMLCanvasElement | null
    const loadingContainer = window.document.getElementById('loading')

    if (!canvas || !loadingContainer) {
      return
    }

    const ctx = canvas.getContext('2d')

    if (!ctx) {
      return
    }

    canvas.width = 1240
    canvas.height = 840

    ctx.fillStyle = '#EFEFEF'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // init
    let loaded = resourcesCount
    for (const n in resources) {
      const key = n as keyof typeof resources

      const src = resources[key]

      if (typeof src === 'string') {
        const image = new Image()
        image.src = src
        image.onload = function () {
          loadingContainer.innerHTML = `Загрузка: ${loaded}/${resourcesCount}`
          loaded--

          if (loaded === 0) {
            loadingContainer.innerHTML = ''
            drawFrame()
          }
        }

        resources[key] = image
      }
    }

    const renderObjects = [
      {
        coordsCenter: [rand(0, canvas.width / 2), rand(0, canvas.height / 2)],
        radius: rand(10, 60),
        fill: '#9e9e9e',
        draw(ctx: CanvasRenderingContext2D) {
          ctx.beginPath()
          ctx.arc(
            this.coordsCenter[0],
            this.coordsCenter[1],
            this.radius,
            0,
            2 * Math.PI,
            false
          )
          ctx.fillStyle = this.fill
          ctx.fill()
        },
        rotationDeg: undefined,
      },
      {
        coordsCenter: [rand(0, canvas.width / 2), rand(0, canvas.height / 2)],
        radius: rand(10, 60),
        fill: '#9e9e9e',
        draw(ctx: CanvasRenderingContext2D) {
          ctx.beginPath()
          ctx.arc(
            this.coordsCenter[0],
            this.coordsCenter[1],
            this.radius,
            0,
            2 * Math.PI,
            false
          )
          ctx.fillStyle = this.fill
          ctx.fill()
        },
        rotationDeg: undefined,
      },
      new Car({
        image: resources.car as HTMLImageElement,
        startCenterCoords: [620, 420],
        controls: {
          up: 'KeyW',
          down: 'KeyS',
          left: 'KeyA',
          right: 'KeyD',
        },
      }),
    ]

    function drawFrame() {
      if (!ctx || !canvas) {
        return
      }

      // рендер полотна
      ctx.save()
      ctx.resetTransform()
      ctx.fillStyle = '#EFEFEF'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.restore()

      renderObjects.forEach((obj) => {
        ctx.save()
        ctx.translate(obj.coordsCenter[0], obj.coordsCenter[1])
        if (obj.rotationDeg) {
          ctx.rotate(deg2rad(obj.rotationDeg))
        }
        obj.draw(ctx)
        ctx.restore()
      })

      ctx.save()
      ctx.fillStyle = 'green'
      ctx.fillRect(canvas.width / 2 - 3, canvas.height / 2 - 3, 6, 6)
      ctx.restore()

      requestAnimationFrame(drawFrame)
    }
  }, [])

  return (
    <>
      <p
        style={{
          position: 'absolute',
        }}
      >
        Use A,W,S,D buttons for control car.
      </p>

      <div id="loading"></div>

      <canvas id="app-canvas"></canvas>
    </>
  )
}

export default CarView
