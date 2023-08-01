'use client'
import { useMemo, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Perf } from 'r3f-perf'
import styles from './page.module.css'
import { OrbitControls, PerspectiveCamera } from '@react-three/drei'
import checkGPU from '../utils/checkGPU'


const rowNum = 10;

export default function Home() {
  const [frameloop, setFrameloop] = useState<
    "never" | "always" | "demand" | undefined
  >("never");
  const [rendererType, setRenderType] = useState("");

  
  const boxes = useMemo(() => {
    return getBoxes()
  },[])

  return (
    <main className={styles.main}>
      {rendererType}
      <Canvas
        id="r3fCanvas"
        frameloop={frameloop}
        gl={ async (canvas) => {

          const renderer: any = await checkGPU(canvas);
          if (renderer) {
            setRenderType("WEBGPU Renderer")
            setFrameloop("always");
            return renderer;
          } else {
            setRenderType("WEBGL Renderer")
            setFrameloop("always");
          }          
        }}
      >
        <PerspectiveCamera makeDefault position={[0,0,50]} />
        <ambientLight />
        <directionalLight position={[10, 10, 10]} />
        {boxes}
        <Perf />
        <OrbitControls />
      </Canvas>
    </main>
  )
}

const getBoxes = () => {
  let boxes = []
  for(let i = 0;i<rowNum;i++) {
    const boxRow = (
      <>
        <Box key={`box_1_${i}`} position={[-14, i * 4 - 18, 0]} />
        <Box key={`box_2_${i}`} position={[-10, i * 4 - 18, 0]} />
        <Box key={`box_3_${i}`} position={[-6, i * 4 - 18, 0]} />
        <Box key={`box_4_${i}`} position={[-2, i * 4 - 18, 0]} />
        <Box key={`box_5_${i}`} position={[2, i * 4 - 18, 0]} />
        <Box key={`box_6_${i}`} position={[6, i * 4 - 18, 0]} />
        <Box key={`box_7_${i}`} position={[10, i * 4 - 18, 0]} />
        <Box key={`box_8_${i}`} position={[14, i * 4 - 18, 0]} />
      </>
    )
    boxes.push(boxRow)
  }
  return boxes
}

const Box = (props) => {
  // This reference gives us direct access to the THREE.Mesh object
  const ref = useRef()
  // Hold state for hovered and clicked events
  const [hovered, hover] = useState(false)
  const [clicked, click] = useState(false)
  // Subscribe this component to the render-loop, rotate the mesh every frame
  useFrame((state, delta) => (ref.current.rotation.x += delta))
  // Return the view, these are regular Threejs elements expressed in JSX
  return (
    <mesh
      {...props}
      ref={ref}
      scale={clicked ? 1.5 : 1}
      onClick={(event) => click(!clicked)}
      onPointerOver={(event) => hover(true)}
      onPointerOut={(event) => hover(false)}>
      <boxGeometry args={[2, 2, 2]} />
      <meshPhysicalMaterial color={hovered ? 'hotpink' : 'orange'} />
    </mesh>
  )
}
