import _ from 'lodash'

var V3 = window.THREE.Vector3
var M4 = window.THREE.Matrix4

export default class Player {
  constructor (world, camera) {
    this.world = world
    this.camera = camera
    this.position = new V3()
    this.rotation = new window.THREE.Euler()
    this.mtxWorld = new M4()
    this.frustum = new window.THREE.Frustum() // you can use frustum.containsPoint(THREE.vector3())
    this.frustumMatrix = this.frustumMatrix = new M4()

    this.statusEffects = {}
    this.setState = this.setState.bind(this)

    this.getPosition = this.getPosition.bind(this)
    this.damage = this.damage.bind(this)

    this.ammoCount = 30
    this.health = 100
    this.shield = 100

    this.clone = {position: new V3()}
    this.move = new V3()
    this.type = 'player'
    // this.world.spheres.push(this)

    this.weapons = []
    this.activeWeapon = null


    this.healthElement = document.createElement('div')
    this.healthElement.style.color = 'white'
    this.healthElement.style.position = 'absolute'
    this.healthElement.innerText = `Health ${this.health}`
    document.body.appendChild(this.healthElement)
  }

  // ///////////////////////////////////////////////////////////////////////////
  // TODO: Move below into an ARCoObject class that this class and others will extend.
  // ////////////////////////////////////////////////////////////////////////

  setState = (nextState) => {
    this.state = {
      ...this.state,
      ...nextState
    }
  }
  // ////////////////////////////////////////////////////////////////////////
  // ////////////////////////////////////////////////////////////////////////

  addWeapon = (weapon) => {
    this.weapons.push(weapon)
    weapon.deactivate()
  }

  activateWeapon = (idx) => {
    const nextWeapon = this.weapons[idx]
    if (this.activeWeapon) {
      this.deactivateWeapon()
    }
    setTimeout(() => {
      if (this.activeWeapon) {
        this.camera.weaponMount.remove(this.activeWeapon.clone)
      }
      this.activeWeapon = nextWeapon
      this.camera.weaponMount.add(this.activeWeapon.clone)
      this.activeWeapon.activate()
    }, this.activeWeapon ? 375 : 0)
  }

  addStatusEffect = (name, value) => {
    this.statusEffects[name] = value
  }

  removeStatusEffect = (name) => {
    this.statusEffects[name] = null
  }

  updateStatusEffect = (name, value) => {
    this.statusEffects[name] = value
  }

  deactivateWeapon = () => {
    this.activeWeapon.deactivate()
  }

  cycleWeapon = () => {
    if (!this.activeWeapon) {
      this.activateWeapon(0)
    } else {
      const idx = this.weapons.findIndex(w => w === this.activeWeapon)
      if (idx + 1 === this.weapons.length) {
        this.activateWeapon(0)
      } else {
        this.activateWeapon(idx + 1)
      }
    }
  }

  getPosition () {
    return this.position
  }

  getLookVector () {
    return new V3(this.mtxWorld.elements[2], this.mtxWorld.elements[6], this.mtxWorld.elements[10])
  }

  shoot (dtSeconds) {
    if (this.activeWeapon && this.activeWeapon.active && this.activeWeapon.ammoCount > 0) {
      this.activeWeapon.shoot(dtSeconds)
    } else {
      console.log('no ammo or no active weapon')
    }
    if (this.activeWeapon) {
      setTimeout(this.checkForNoAmmo, 1000)
    }
  }

  checkForNoAmmo = () => {
    let ammo = false
    this.weapons.forEach(w => {
      if (w.ammoCount > 0) {
        ammo = true
      }
    })
    if (!ammo) {
      this.world.enqueEvent('GameOver', 0, {})
    } else {
      if (this.activeWeapon.ammoCount <= 0) {
        this.cycleWeapon()
      }
    }
  }

  toggleShieldActive () {
    if (this.state.shieldEnabled) {
      this.world.disableShield()
      this.world.setState({
        shieldEnabled: false
      })
    } else {
      this.world.enableShield()
      this.world.setState({
        shieldEnabled: true
      })
    }
  }

  damage (amount) {
    this.health = _.clamp(this.health - amount, 0, 100)
    this.healthElement.innerText = `Health ${this.health}`
  }

  update (dtSeconds) {
    this.camera.updateMatrixWorld();
    this.camera.updateProjectionMatrix();

    this.mtxWorld = new window.THREE.Matrix4().makeRotationY(Math.PI)
    this.mtxWorld.premultiply(this.camera.matrixWorld)

    this.camera.parent.getWorldPosition(this.position) // !the browserlock controls
    this.camera.parent.getWorldPosition(this.clone.position)
    this.rotation.setFromRotationMatrix(this.mtxWorld)

    this.camera.getWorldPosition(this.position)
    this.camera.getWorldPosition(this.clone.position)
    this.rotation.setFromRotationMatrix(this.mtxWorld)
    this.frustum.setFromMatrix(this.frustumMatrix.multiplyMatrices(this.camera.projectionMatrix, this.camera.matrixWorldInverse))
  }
}
