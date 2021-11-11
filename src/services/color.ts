export const colors = [
  '#6929c4',
  '#1192e8',
  '#005d5d',
  '#9f1853',
  '#fa4d56',
  '#570408',
  '#198038',
  '#002d9c',
  '#ee538b',
  '#b28600',
  '#009d9a',
  '#012749',
  '#8a3800',
  '#a56eff',
]

let colorIndex = 0;

export function getProjectColor() {
  const index = colorIndex
  colorIndex += 1
  colorIndex %= colors.length
  return colors[index]
}