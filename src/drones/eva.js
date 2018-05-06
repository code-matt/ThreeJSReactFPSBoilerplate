export default class Eva {
  constructor (world) {
    this.world = world
    this.clonable = undefined
    this.loader = new window.THREE.OBJLoader()
    this.texLoader = new window.THREE.TextureLoader()
    this.functions2bind = {
      shoot: this.shoot,
      damage: this.damage
    }
  }

  createClonable () {
    return new Promise((resolve, reject) => {
      let texDiffuse = this.texLoader.load('assets/Diffuse.png')

      this.loader.load('assets/eva.obj', (data) => {
        let bomberMaterial = new window.THREE.MeshPhongMaterial({
          map: texDiffuse
        })
        data.children[0].material = bomberMaterial
        data.children[1].material = bomberMaterial
        this.clonable = data
        resolve(true)
      })
    })
  }

  onCreate (initialState) {
    this.state = initialState
    this.clone.position.copy(this.state.initialPosition)
    this.world.app.scene.add(this.clone)
    this.world.enemies.push(this)
    this.move = new window.THREE.Vector3()
    this.health = 100
  }

  destroySelf () {
    this.world.removeEnemy(this)
  }
 
  shoot () {

  }

  damage (amount) {
    this.health -= amount
    if (this.health <= 0) {
      this.destroySelf()
    }
  }

  update (dtSeconds) {
    this.clone.rotation.y += 0.25 * dtSeconds
    // this.clone.lookAt(this.state.target.position)
  }
}