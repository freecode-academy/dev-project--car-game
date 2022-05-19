export const timeoutFrame = 25
export const timeoutFrameScalar = 0.025

export const resources: {
  car: string | HTMLImageElement
} = {
  car: 'images/car.webp',
}
export const resourcesCount = Object.keys(resources).length

export const deg2rad = (deg: number) => (deg * Math.PI) / 180
export const rad2deg = (rad: number) => (180 * rad) / Math.PI

export const rand = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min)) + min

export const pointInRect: (
  [px, py]: [number, number],
  [[ax, ay], [bx, by], [cx, cy], [dx, dy]]: [
    [number, number],
    [number, number],
    [number, number],
    [number, number]
  ]
) => boolean = ([px, py], [[ax, ay], [bx, by], [cx, cy], [dx, dy]]) =>
  [
    (bx - ax) * (py - ay) - (by - ay) * (px - ax),
    (cx - bx) * (py - by) - (cy - by) * (px - bx),
    (dx - cx) * (py - cy) - (dy - cy) * (px - cx),
    (ax - bx) * (py - dy) - (ay - dy) * (px - dx),
  ].every((n) => n <= 0)
