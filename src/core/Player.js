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

    this.clone = {position: new V3()}
    this.move = new V3()
    this.type = 'player'
  }

  setState = (nextState) => {
    this.state = {
      ...this.state,
      ...nextState
    }
  }

  getPosition () {
    return this.position
  }

  getLookVector () {
    return new V3(this.mtxWorld.elements[2], this.mtxWorld.elements[6], this.mtxWorld.elements[10])
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
