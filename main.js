import './style.css'
import FabricHistory from './lib/fabricHistory'
import NewFabricHistory from './lib/newFabricHistory'
import { uuid } from './helpers/uuid'

let canvas = new fabric.Canvas('canvas', { backgroundColor: '#f5deb3' })
let undoBtn = document.getElementById('undoBtn')
let redoBtn = document.getElementById('redoBtn')
// let history = new FabricHistory(canvas, undoBtn, redoBtn)
let history = new NewFabricHistory(canvas)

canvas.on('object:added', function (event) {
  // history.updateCanvasState()
  if (typeof event.target.id === 'undefined') {
    event.target.set('id', uuid())
  }

  history.saveCanvasState()
})

canvas.on('object:modified', function (event) {
  if (typeof event.target.id === 'undefined') {
    event.target.set('id', uuid())
  }

  // const object = event.target.toJSON(['id'])
  // console.log(object)
  history.saveCanvasState()
})

undoBtn.addEventListener('click', function () {
  history.undo()
})
//
redoBtn.addEventListener('click', function () {
  history.redo()
})
//
canvas.add(
  new fabric.Circle({
    radius: 30,
    fill: '#f55',
    top: 10,
    left: 10,
    name: 'pink',
    id: uuid(),
  })
)

canvas.add(
  new fabric.Circle({
    radius: 30,
    fill: '#000',
    top: 10,
    left: 100,
    name: 'black',
    id: uuid(),
  })
)

canvas.add(
  new fabric.Circle({
    radius: 30,
    fill: '#e1e',
    top: 10,
    left: 200,
    name: 'purple',
    id: uuid(),
  })
)

canvas.renderAll()
