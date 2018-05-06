import SmartObject from './SmartObject'
import Player from './Player'
import Bomber from '../drones/bomber'
import Assault from '../drones/assault'
import Eva from '../drones/eva'
import Launcher from './Weapon'

var TWEEN = require('@tweenjs/tween.js')

export default class TestGame {
  constructor (app) {
    this.app = app
    this.enemies = []
    this.update = this.update.bind(this)
    this.player = new Player(this, app.camera)
    this.weapon = new Launcher(this)
  }

  init = () => {
    this.weapon.createClonable()
    .then(done => {
      this.bomber = new Bomber(this)
      this.bomber.createClonable()
      .then(done => {
        let bomber = new SmartObject('bomber', this, {
          initialPosition: new window.THREE.Vector3(0, 1, 0),
          target: this.player
        })
        this.assault = new Assault(this)
        this.assault.createClonable()
        .then(done => {
          let assault = new SmartObject('assault', this, {
            initialPosition: new window.THREE.Vector3(-2, 1, 0),
            target: this.player
          })
          this.eva = new Eva(this)
          this.eva.createClonable()
          .then(done => {
            let eva = new SmartObject('eva', this, {
              initialPosition: new window.THREE.Vector3(2, 1, 0),
              target: this.player
            })
            this.player.activateWeapon(0)
          })
        })
      })
    })
  }

  update (dtSeconds, tFrame) {
    TWEEN.update(tFrame)
    this.player.update()
    this.enemies.forEach(e => e.update(dtSeconds))
  }
}