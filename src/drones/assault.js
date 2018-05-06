export default class Assault {
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

      this.loader.load('assets/assault.obj', (data) => {
        let bomberMaterial = new window.THREE.MeshPhongMaterial({
          map: texDiffuse
        })
        data.children[0].material = bomberMaterial
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
  }

  destroySelf () {

  }
 
  shoot () {

  }

  damage () {

  }

  update (dtSeconds) {
    this.clone.rotation.y += 0.25 * dtSeconds
    // this.clone.lookAt(this.state.target.position)
  }
}