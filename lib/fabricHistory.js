export default class FabricHistory {
  constructor(canvas, undoBtn, redoBtn) {
    this.canvas = canvas
    this.undoBtn = undoBtn
    this.redoBtn = redoBtn
    this.canvasState = []
    this.currentStateIndex = -1
    this.undoStatus = false
    this.redoStatus = false
  }

  undo() {
    if (this.currentStateIndex === -1) {
      this.undoStatus = false
    } else if (this.canvasState.length >= 1) {
      if (this.currentStateIndex !== 0) {
        this.undoStatus = true
        this.canvas.loadFromJSON(this.canvasState[this.currentStateIndex - 1], this.undoJsonLoad.bind(this))
      } else if (this.undoStackEmpty) {
        this.canvas.clear()
        this.undoBtn.disabled = true
        this.redoBtn.disabled = false
        this.currentStateIndex -= 1
      }
    }
  }

  redo() {
    if (this.redoStackEmpty) {
      this.redoBtn.disabled = true
    } else if (this.canvasState.length > this.currentStateIndex && this.canvasState.length !== 0) {
      this.redoStatus = true
      this.canvas.loadFromJSON(this.canvasState[this.currentStateIndex + 1], this.redoJsonLoad.bind(this))
    }
  }

  undoJsonLoad() {
    // let jsonData = JSON.parse(this.canvasState[this.currentStateIndex - 1])
    this.canvas.renderAll()
    this.undoStatus = false
    this.currentStateIndex -= 1
    this.undoBtn.disabled = false

    if (this.currentStateIndex !== this.canvasState.length - 1) {
      this.redoBtn.disabled = false
    }
  }

  redoJsonLoad() {
    // let jsonData = JSON.parse(this.canvasState[this.currentStateIndex + 1])
    this.canvas.renderAll()
    this.redoStatus = false
    this.currentStateIndex += 1

    if (this.currentStateIndex !== -1) {
      this.undoBtn.disabled = false
    }

    if (this.redoStackEmpty) {
      this.redoBtn.disabled = true
    }
  }

  updateCanvasState() {
    if (!this.undoStatus && !this.redoStatus) {
      let jsonData = this.canvas.toJSON(['id'])
      let canvasAsJson = JSON.stringify(jsonData)

      if (this.currentStateIndex < this.canvasState.length - 1) {
        let indexToBeInserted = this.currentStateIndex + 1
        this.canvasState[indexToBeInserted] = canvasAsJson
        let numberOfElementsToRetain = indexToBeInserted + 1
        this.canvasState = this.canvasState.splice(0, numberOfElementsToRetain)
      } else {
        this.canvasState.push(canvasAsJson)
      }

      this.currentStateIndex = this.canvasState.length - 1

      if (this.redoStackEmpty) {
        this.redoBtn.disabled = true
      }
    }
  }

  get undoStackEmpty() {
    return this.currentStateIndex === 0
  }

  get redoStackEmpty() {
    return this.currentStateIndex === this.canvasState.length - 1 && this.currentStateIndex !== -1
  }
}
