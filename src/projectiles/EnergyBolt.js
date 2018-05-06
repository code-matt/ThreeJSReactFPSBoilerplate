var V3 = window.THREE.Vector3

export default class EnergyBolt {
  constructor () {
    this.type = 'Smart'
    this.poolObject = true

    this.createClonable = this.createClonable.bind(this)
    this.clonable = undefined
    this.functions2bind = {
      collide: this.collide
    }
  }

  createClonable () {
    let geometry = new window.THREE.SphereGeometry(0.03, 32, 32)
    let material = new window.THREE.MeshBasicMaterial({ color: 0x0000ff })
    var cube = new window.THREE.Mesh(geometry, material)
    this.clonable = cube  
  }

  onCreate (initialState) {
    this.state = initialState
    this.clone.position.copy(this.state.initialPosition)
    this.clone.rotation.copy(this.state.initialRotation)
    this.world.app.scene.add(this.clone)
    this.world.projectiles.push(this)
    this.speed = 5
    this.timeAlive = 0
    this.world.projectiles.push(this)
  }

  destroySelf () {
    this.world.removeProjectile(this)
  }

  collide (target, pos) {
    if (target.type !== 'player') {
      console.log('drone hit')
    } else {
      console.log('player hit')
    }
    pos.sub(target.clone.position)
    target.move.x += pos.x * -0.025
    target.move.y += pos.z * -0.025
    target.damage(15)
    this.clone.position.x = 10000
    this.clone.position.y = 10000
    this.clone.position.z = 10000
    this.destroySelf()
  }

  update (dtSeconds) {
    this.timeAlive = this.timeAlive + dtSeconds

    if (this.timeAlive > 1.5) {
      this.state.deInit = true
      this.destroySelf()
      return
    } else if (this.clone.position.y < this.world.groundHeight) {
      console.log('ground hit')
      this.destroySelf()
      return
    }

    this.world.enemies.forEach((enemy) => {
      if (enemy === this.state.shooter) return true
      let d = enemy.clone.position.distanceTo(this.clone.position)
      if (d < 0.3) {
        this.collide(enemy, enemy.clone.position.clone())
        return false
      }
    })

    this.clone.translateZ(this.speed * dtSeconds)
  }
}
