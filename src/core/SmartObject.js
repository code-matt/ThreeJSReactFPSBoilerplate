window.cloneMaterials = (object3D) => {
  object3D.traverse((o) => {
    if (o.isMesh && o.geometry !== undefined) {
      if (o.material) {
        o.material = o.material.clone()
      }
    }
  })
}
export default class SmartObject {
  constructor (templateName, world, initialState) {
    this.templateName = templateName
    this.world = world
    // debugger
    this.clone = this.world[templateName].clonable.clone()

    this.clone.traverse((obj) => {
      obj.userData = {
        type: templateName,
        root: this.clone,
        wrapper: this
      }
    })
    this.ObjectClass = this.world[templateName]
    var templateFuncs2bindKeys = Object.keys(this.ObjectClass.functions2bind)
    var wtf = this
    templateFuncs2bindKeys.forEach((key) => {
      this[key] = this.ObjectClass.functions2bind[key]
      this[key] = this[key].bind(wtf)
    })
    this.setState = this.setState.bind(this)

    // rebinding both these from their templates! important!
    // TODO: copy the template binding config scheme from elements3d
    this.onCreate = this.ObjectClass.onCreate
    this.onCreate = this.onCreate.bind(this)
    this.update = this.ObjectClass.update
    this.update = this.update.bind(this)
    this.destroySelf = this.ObjectClass.destroySelf
    this.destroySelf = this.destroySelf.bind(this)
    this.onCreate(initialState)
  }

  setState (newState) {
    this.state = {
      ...this.state,
      newState
    }
  }
}
