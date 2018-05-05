import SmartObject from './SmartObject'
import Player from './Player'

export default class TestGame {
  constructor (app) {
    this.app = this
    this.enemies = []
    this.update = this.update.bind(this)
  }

  init = () => {
    // let bomber = new Bomber(this)
    // bomber.createClonable()
  }

  update (deltaTime) {
    this.enemies.forEach(e => e.update())
  }
}