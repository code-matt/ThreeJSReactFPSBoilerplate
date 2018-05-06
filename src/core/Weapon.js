var TWEEN = require('@tweenjs/tween.js')

const V3 = window.THREE.Vector3
export default class Launcher {
  constructor (world) {
    this.world = world
    this.loader = new window.THREE.OBJLoader()
    this.texLoader = new window.THREE.TextureLoader()
    this.ammoCount = 20
  }

  createClonable = () => {
    return new Promise((resolve, reject) => {
      var texDiffuse = this.texLoader.load('assets/launcher/Diffuse.png')
      this.loader.load('assets/launcher/launcher.obj', (data) => {
        let material = new window.THREE.MeshPhongMaterial({
          map: texDiffuse
        })
        data.children[0].material = material
        this.clone = data
        this.clone.layers.mask = 0x1
        this.clone.position.x = 0.02
        this.clone.position.z = -0.045
        this.clone.position.y = -0.07
        this.clone.rotation.y = -Math.PI
        this.clone.rotation.x = -Math.PI / 2
        this.active = false
        this.world.player.addWeapon(this)
        resolve(true)
      })
    })
  }

  activate = () => {
    console.log('activating weapon')
    const _this = this
    var target = new window.THREE.Vector3(0, -Math.PI, 0)
    window.animateVector3(this.clone.rotation, target, {
      duration: 375,
      easing: TWEEN.Easing.Quadratic.InOut,
      update: function (d) {
        _this.clone.rotation.x = d.x
      },
      callback: () => {
        // _this.world.watchTower.setState({
        //   forceUpdate: _this.world.watchTower.state.forceUpdate + 1
        // })
        _this.active = true
      }
    })

    var target2 = new window.THREE.Vector3(0.02, -0.05, -0.015)
    window.animateVector3(this.clone.position, target2, {
      duration: 375,
      easing: TWEEN.Easing.Quadratic.InOut,
      update: function (d) {
        _this.clone.position.z = d.z
        _this.clone.position.y = d.y
      }
    })
  }

  deactivate = () => {
    this.active = false
    const _this = this
    var target = new window.THREE.Vector3(-Math.PI / 2, -Math.PI, 0)
    window.animateVector3(this.clone.rotation, target, {
      duration: 375,
      easing: TWEEN.Easing.Quadratic.InOut,
      update: function (d) {
        _this.clone.rotation.x = d.x
      }
    })

    var target2 = new window.THREE.Vector3(0.02, -0.1, -0.025)
    window.animateVector3(this.clone.position, target2, {
      duration: 375,
      easing: TWEEN.Easing.Quadratic.InOut,
      update: function (d) {
        _this.clone.position.z = d.z
        _this.clone.position.y = d.y
      }
    })
  }

  fire = () => {
    const _this = this
    var target2 = new window.THREE.Vector3(0.02, -0.05, -0.050)
    window.animateVector3(this.clone.position, target2, {
      duration: 100,
      easing: TWEEN.Easing.Quadratic.InOut,
      update: function (d) {
        _this.clone.position.z = d.z
      },
      callback: function () {
        _this.fireCycle2()
      }
    })
  }

  fireCycle2 = () => {
    const _this = this
    var target2 = new window.THREE.Vector3(0.02, -0.05, -0.065)
    window.animateVector3(this.clone.position, target2, {
      duration: 200,
      easing: TWEEN.Easing.Quadratic.InOut,
      update: function (d) {
        _this.clone.position.z = d.z
      }
    })
  }

  shoot = () => {
    // const player = this.world.player
    // var pos = new V3(-0.02, -0.08, -0.17)
    // pos.applyMatrix4(player.mtxWorld)

    // this.world.addObject('EnergyBolt', {
    //   initialPosition: pos,
    //   initialRotation: player.rotation,
    //   shooter: player,
    //   lifetime: 1.6
    // })
    // this.fire()

    // if (!this.world.watchTower.state.tutorial) {
    //   --this.ammoCount
    // }
    // this.world.soundManager.playSound('game1', 'rocket')
    // this.world.watchTower.setState({
    //   forceUpdate: this.world.watchTower.state.forceUpdate + 1
    // })
  }
}

window.animateVector3 = function (vectorToAnimate, target, options) {
  options = options || {}
  // get targets from options or set to defaults
  var to = target || window.THREE.Vector3()
  var easing = options.easing || TWEEN.Easing.Quadratic.In
  var duration = options.duration || 2000
  // create the tween
  var tweenVector3 = new TWEEN.Tween(vectorToAnimate)
    .to({ x: to.x, y: to.y, z: to.z }, duration)
    .easing(easing)
    .onUpdate(function (d) {
      if (options.update) {
        options.update(d)
      }
    })
    .onComplete(function () {
      if (options.callback) options.callback()
    })
  // start the tween
  tweenVector3.start()
  // return the tween in case we want to manipulate it later on
  return tweenVector3
}


window.animateVector2 = function (vectorToAnimate, target, options) {
  options = options || {}
  // get targets from options or set to defaults
  var to = target || window.THREE.Vector2()
  var easing = options.easing || TWEEN.Easing.Quadratic.In
  var duration = options.duration || 2000
  // create the tween
  var tweenVector3 = new TWEEN.Tween(vectorToAnimate)
    .to({ x: to.x, y: to.y }, duration)
    .easing(easing)
    .onUpdate(function (d) {
      if (options.update) {
        options.update(d)
      }
    })
    .onComplete(function () {
      if (options.callback) options.callback()
    })
  // start the tween
  tweenVector3.start()
  // return the tween in case we want to manipulate it later on
  return tweenVector3
}