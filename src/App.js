import React, { Component } from 'react'
import logo from './logo.svg'
import './App.css'
import Bomber from './drones/bomber'
import TestGame from './core/TestGame'

class App extends Component {

  constructor () {
    super()
    this.mainLoopStarted = false
    this.tPrevFrame = undefined
    this.animate = this.animate.bind(this)
  }

  componentDidMount () {
    this.camera = new window.THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 100 )
    this.camera.weaponMount = new window.THREE.Group()
    this.camera.add(this.camera.weaponMount)
    this.testGame = new TestGame(this, this.camera)
    this.camera.position.z = 1
    this.scene = new window.THREE.Scene()
    this.objects2hittest = []
    var size = 50
    var divisions = 20
    var gridHelper = new window.THREE.GridHelper( size, divisions )
    this.scene.add( gridHelper )
    this.raycaster = new window.THREE.Raycaster( new window.THREE.Vector3(), new window.THREE.Vector3( 0, - 1, 0 ), 0, 10 )
    this.renderer = new window.THREE.WebGLRenderer( { antialias: true } )
    this.renderer.setSize( window.innerWidth, window.innerHeight )
    document.addEventListener( 'keydown', this.onKeyDown, false )
    document.addEventListener( 'keyup', this.onKeyUp, false )
    var light = new window.THREE.HemisphereLight( 0xeeeeff, 0x777788, 0.75 )
    light.position.set( 0.5, 1, 0.75 )
    this.scene.add( light )
    this.controlsEnabled = false
    this.moveForward = false
    this.moveBackward = false
    this.moveLeft = false
    this.moveRight = false
    this.canJump = false
    this.prevTime = performance.now()
    this.velocity = new window.THREE.Vector3()
    this.direction = new window.THREE.Vector3()
    this.vertex = new window.THREE.Vector3()
    this.color = new window.THREE.Color()
    this.controls = new window.THREE.PointerLockControls( this.camera )
    this.scene.add(this.controls.getObject())
    var havePointerLock = 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document
    var element = document.body
    var pointerlockchange = ( event ) => {
      console.log('poitner lock change')
      if ( document.pointerLockElement === element || document.mozPointerLockElement === element || document.webkitPointerLockElement === element ) {
        this.controlsEnabled = true
        this.controls.enabled = true
      } else {
        this.controls.enabled = false
      }
    }
    document.addEventListener( 'pointerlockchange', pointerlockchange, false )
    document.addEventListener( 'mozpointerlockchange', pointerlockchange, false )
    document.addEventListener( 'webkitpointerlockchange', pointerlockchange, false )
    element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock
    document.addEventListener('click', () => {
      if (havePointerLock) {
        element.requestPointerLock()
        console.log('request plocks')
      } else {
        element.requestPointerLock()
        console.log('request plocks')
      }
    })

    this.testGame.init()
    document.body.appendChild( this.renderer.domElement )
    window.requestAnimationFrame(this.animate)
  }

  animate (tFrame) {
    // ******************************************************************
    // ***************** UPDATES CONTROLS *******************************
    // ******************************************************************

    this.raycaster.ray.origin.copy( this.controls.getObject().position )
    this.raycaster.ray.origin.y -= 10

    var intersections = this.raycaster.intersectObjects(this.objects2hittest )

    var onObject = intersections.length > 0

    var time = performance.now()
    var delta = ( time - this.prevTime ) / 1000

    this.velocity.x -= this.velocity.x * 10.0 * delta
    this.velocity.z -= this.velocity.z * 10.0 * delta

    this.velocity.y -= 9.8 * 20.0 * delta // 100.0 = mass

    this.direction.z = Number( this.moveForward ) - Number( this.moveBackward )
    this.direction.x = Number( this.moveLeft ) - Number( this.moveRight )
    this.direction.normalize() // this ensures consistent movements in all this.directions

    if ( this.moveForward || this.moveBackward ) this.velocity.z -= this.direction.z * 50.0 * delta
    if ( this.moveLeft || this.moveRight ) this.velocity.x -= this.direction.x * 50.0 * delta

    if ( onObject === true ) {

      this.velocity.y = Math.max( 0, this.velocity.y )
      this.canJump = true

    }

    this.controls.getObject().translateX( this.velocity.x * delta )
    this.controls.getObject().translateY( this.velocity.y * delta )
    this.controls.getObject().translateZ( this.velocity.z * delta )

    if ( this.controls.getObject().position.y < 1.4 ) {

      this.velocity.y = 0
      this.controls.getObject().position.y = 1.4

      this.canJump = true

    }

    this.prevTime = time
    // ******************************************************************
    // ***************** UPDATES CONTROLS *******************************
    // ******************************************************************


    this.testGame.update(delta, tFrame)
 
    this.renderer.render( this.scene, this.camera )
    window.requestAnimationFrame( this.animate )
  }

  render() {
    return (
      <div />
    )
  }

  onKeyDown = (e) => {
    switch ( e.keyCode ) {

      case 38: // up
      case 87: // w
        this.moveForward = true
        break

      case 37: // left
      case 65: // a
        this.moveLeft = true
        break

      case 40: // down
      case 83: // s
        this.moveBackward = true
        break

      case 39: // right
      case 68: // d
        this.moveRight = true
        break

      case 32: // space
        if ( this.canJump === true ) this.velocity.y += 50
        this.canJump = false
        break

    }
  }

  onKeyUp = (e) => {
    switch( e.keyCode ) {

      case 38: // up
      case 87: // w
        this.moveForward = false
        break

      case 37: // left
      case 65: // a
        this.moveLeft = false
        break

      case 40: // down
      case 83: // s
        this.moveBackward = false
        break

      case 39: // right
      case 68: // d
        this.moveRight = false
        break

    }
  }
}

export default App
