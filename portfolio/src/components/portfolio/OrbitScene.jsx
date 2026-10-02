import { useEffect, useRef, useState } from 'react'

// The scene is decorative; every action and all content remain available without WebGL.
export default function OrbitScene({ paused }) {
  const mount = useRef(null)
  const [ready, setReady] = useState(false)
  useEffect(() => {
    const host = mount.current
    let disposed = false
    let cleanup = () => {}
    import('three').then(THREE => {
      if (disposed) return
      let renderer
      try { renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power' }) }
      catch { return }
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75))
      renderer.setClearColor(0x000000, 0)
      host.appendChild(renderer.domElement)
      const scene = new THREE.Scene()
      const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 50)
      camera.position.set(0, 0, 8.7)
      scene.add(new THREE.HemisphereLight(0xd7e7ff, 0x202e66, 3))
      const key = new THREE.DirectionalLight(0xf6f1df, 7)
      key.position.set(-3, 5, 5)
      scene.add(key)
      const rim = new THREE.PointLight(0x759aff, 55)
      rim.position.set(3, -1, 3)
      scene.add(rim)
      const sculpture = new THREE.Group()
      scene.add(sculpture)
      const metal = new THREE.MeshPhysicalMaterial({ color: 0x6889ee, metalness: 0.82, roughness: 0.23, clearcoat: 1 })
      const pale = new THREE.MeshPhysicalMaterial({ color: 0xe1e6f4, metalness: 0.64, roughness: 0.2 })
      const geometry = new THREE.TorusGeometry(1.55, 0.26, 32, 128)
      for (let i = 0; i < 3; i++) {
        const ring = new THREE.Mesh(geometry, i === 1 ? pale : metal)
        ring.rotation.set(i * Math.PI / 3 + 0.45, i * 0.8, i * 0.7)
        sculpture.add(ring)
      }
      const coreGeo = new THREE.IcosahedronGeometry(0.6, 1)
      const coreMat = new THREE.MeshPhysicalMaterial({ color: 0xf1a16a, metalness: 0.48, roughness: 0.29 })
      sculpture.add(new THREE.Mesh(coreGeo, coreMat))
      const moonGeo = new THREE.SphereGeometry(0.14, 20, 20)
      const moon = new THREE.Mesh(moonGeo, pale)
      scene.add(moon)
      const pointer = { x: 0, y: 0 }
      const move = e => {
        const box = host.getBoundingClientRect()
        pointer.x = ((e.clientX - box.left) / box.width - 0.5) * 0.6
        pointer.y = ((e.clientY - box.top) / box.height - 0.5) * 0.4
      }
      host.addEventListener('pointermove', move)
      const resize = () => {
        const { width, height } = host.getBoundingClientRect()
        renderer.setSize(width, height)
        camera.aspect = width / height
        camera.updateProjectionMatrix()
        renderer.render(scene, camera)
      }
      const observer = new ResizeObserver(resize)
      observer.observe(host)
      const media = window.matchMedia('(prefers-reduced-motion: reduce)')
      let frame, visible = true, time = 0
      const draw = () => {
        if (disposed) return
        if (visible && !document.hidden) {
          if (!paused && !media.matches) time += 0.006
          sculpture.rotation.set(0.18 + pointer.y, time * 0.33 + pointer.x, -0.22)
          sculpture.position.y = Math.sin(time) * 0.09
          moon.position.set(Math.cos(time) * 2.18, Math.sin(time) * 1.8, 0.8)
          renderer.render(scene, camera)
        }
        if (!paused && !media.matches) frame = requestAnimationFrame(draw)
      }
      const restart = () => { cancelAnimationFrame(frame); draw() }
      media.addEventListener('change', restart)
      const intersection = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting })
      intersection.observe(host)
      const lost = e => { e.preventDefault(); cancelAnimationFrame(frame); setReady(false) }
      renderer.domElement.addEventListener('webglcontextlost', lost)
      resize(); draw(); setReady(true)
      cleanup = () => {
        cancelAnimationFrame(frame)
        observer.disconnect(); intersection.disconnect()
        media.removeEventListener('change', restart)
        host.removeEventListener('pointermove', move)
        renderer.domElement.removeEventListener('webglcontextlost', lost)
        geometry.dispose(); coreGeo.dispose(); moonGeo.dispose()
        metal.dispose(); pale.dispose(); coreMat.dispose(); renderer.dispose()
        renderer.domElement.remove()
      }
    }).catch(() => {})
    return () => { disposed = true; cleanup() }
  }, [paused])
  return <div className="orbit-scene" aria-hidden="true">
    <div className={`orbit-fallback ${ready ? 'is-hidden' : ''}`}><i /><i /><i /><b /></div>
    <div className="orbit-canvas" ref={mount} />
  </div>
}
