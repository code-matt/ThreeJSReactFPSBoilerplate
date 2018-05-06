import SmartObject from './SmartObject'
import Player from './Player'
import Bomber from '../drones/bomber'

export default class TestGame {
  constructor (app) {
    this.app = app
    this.enemies = []
    this.update = this.update.bind(this)
    this.player = new Player(this, app.camera)
  }
s
  init = () => {
    this.bomber = new Bomber(this)
    this.bomber.createClonable()
    .then(done => {
      let bomber = new SmartObject('bomber', this, {
        initialPosition: new window.THREE.Vector3(0, 1, 0),
        target: this.player
      })
    })
  }

  update (dtSeconds) {
    this.player.update()
    this.enemies.forEach(e => e.update(dtSeconds))
  }
}