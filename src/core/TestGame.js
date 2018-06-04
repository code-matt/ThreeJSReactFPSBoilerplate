import Player from './Player'

var TWEEN = require('@tweenjs/tween.js')

export default class TestGame {
  constructor (app) {
    this.app = app
    this.enemies = []
    this.projectiles = []
    this.update = this.update.bind(this)
    this.player = new Player(this, app.camera)
  }

  init = () => {

  }

  update (dtSeconds, tFrame) {
    TWEEN.update(tFrame)
    this.player.update()
  }
}