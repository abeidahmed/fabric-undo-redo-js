export default class NewFabricHistory {
  constructor(canvas) {
    this.canvas = canvas
    this.undoHistory = []
    this.redoHistory = []
    // This is important to remove first node
    this.nextState = this.getNextCanvasHistory
    this.processing = false
  }

  saveCanvasState() {
    if (this.processing) return

    this.undoHistory.push(this.nextState)
    this.nextState = this.getNextCanvasHistory
  }

  undo() {
    this.processing = true

    let history = this.undoHistory.pop()
    if (history) {
      this.redoHistory.push(this.getNextCanvasHistory)
      this.nextState = history
      this.canvas.loadFromJSON(history, this.render.bind(this))
    }

    this.processing = false
  }

  redo() {
    this.processing = true

    let history = this.redoHistory.pop()
    if (history) {
      this.undoHistory.push(this.getNextCanvasHistory)
      this.nextState = history
      this.canvas.loadFromJSON(history, this.render.bind(this))
    }

    this.processing = false
  }

  clear() {
    this.undoHistory = []
    this.redoHistory = []
    this.processing = false
  }

  render() {
    this.canvas.requestRenderAll()
  }

  get getNextCanvasHistory() {
    this.canvas.includeDefaultValues = false
    return this.canvas.toJSON()
  }
}
