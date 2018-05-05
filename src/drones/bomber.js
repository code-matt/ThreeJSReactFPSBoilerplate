export default class Bomber {
  constructor (world) {
    this.world = world
    this.clonable = undefined
    this.loader = new window.THREE.OBJLoader()
    this.texLoader = new window.THREE.TextureLoader()
    this.functions2bind = {
      shoot: this.shoot,
      damage: this.damage,
      deallocate: this.deallocate,
      onAllocate: this.onAllocate
    }
  }

  createClonable () {
    let texDiffuse = this.texLoader.load('assets/Diffuse.png')

    this.loader.load('assets/bomber.obj', (data) => {
      let bomberMaterial = new window.THREE.MeshPhongMaterial({
        map: texDiffuse
      })
      data.children[0].material = bomberMaterial
      this.clonable = data
      data.position.y = 1.4
      data.position.z = 2
      this.world.scene.add(this.clonable)
    })
  }

  onAllocate () {

  }

  deallocate () {

  }

  shoot () {

  }

  damage () {

  }

  update () {

  }
}