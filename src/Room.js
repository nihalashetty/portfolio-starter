import { useGLTF, useTexture, Center, OrbitControls, Html } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { gsap } from 'gsap'
import { useControls } from "leva";
import { useEffect, useRef, useState } from "react";
import * as THREE from 'three'

export default function Room (props) {
  const { nodes } = useGLTF("/my-portfolio-new.glb");
  const baked = useTexture('./baked.jpg');
  const baked2 = useTexture('./baked2.jpg');
  const baked3 = useTexture('./baked3.jpg');
  baked.flipY = false;
  baked2.flipY = false;
  baked3.flipY = false;
  const meshRef = useRef()
  const poster1 = useRef()
  const poster2 = useRef()
  const poster3 = useRef()
  const poster4 = useRef()
  const computer1 = useRef()
  const computer2 = useRef()
  const computer3 = useRef()
  const mobile = useRef()
  const orbitRef = useRef();

  const { camera, mouse } =  useThree();
  let animationRunning = false;

  const raycasterHelper = useRef();
  useFrame(() => {
    const raycaster = new THREE.Raycaster();
    const mouseNDC = new THREE.Vector2(mouse.x * 2 - 1, -mouse.y * 2 + 1);
    raycaster.setFromCamera(mouseNDC, camera);
  
    // Update the position and direction of the raycaster helper
    raycasterHelper.current.position.copy(raycaster.ray.origin);
    raycasterHelper.current.setDirection(raycaster.ray.direction);
  });
  
  let {position, target, orbEnabled} = useControls('Camera', {
    position: {value: {x: 0, y: 50, z: 0}, step: 1},
    target: {value: {x: 0, y: 1.56, z: -1.4}, step: 0.1},
    orbEnabled: {
        value: true,
        onChange: (value) => {toggleOrbitControls(value)},
        transient: false
    }
  })

  function toggleOrbitControls(value) {
    console.log(value)
    if (value) {
        camera.position.set(0, 50, 0);
        orbitRef.current.target.set(-108.67, 18.09, -108.84)
    } else {
        camera.position.set(-20, 35, -10)
        camera.lookAt(-108.67, 18.09, -108.84)
    }
  }

  useEffect(() => {
    camera.position.set(-20, 35, -10)
    camera.lookAt(-108.67, 18.09, -108.84)
  }, [])

  function viewCameraAt(x, y, z, a, b, c) {
      animationRunning = true;
      gsap.to(camera.position, {
          x: () => x,
          y: () => y,
          z: () => z,
          duration: 3,
          // onUpdate: () => {
          //     animationRunning= true;
          // },
          onComplete: () => {
              animationRunning = false;
          },
      });

      if (orbEnabled) {
          orbitRef.current.target.set(a, b, c)
      } else {
          gsap.to(camera.rotation, {
            x: () => a,
            y: () => b,
            z: () => c,
            duration: 3
          });
      }
  }

  function animateToPosters (posterNumber) {
      animationRunning = true;
      let posterPos = {
          'poster1': [0, 1.5, 0, -70, 65, -80],
          'poster2': [0, 0, 0, -95, 65, -75],
          'poster3': [0, 0, 0, -72, 65, -75],
          'poster4': [0, 0, 0, -28, 72, -75],
          'outside': [0, 0.7, 0, -20, 35, -10],
          'computer1': [0, 1.6, 0, -80, 30, -70],
          'computer2': [-0.2, 0.3, 0, -55, 40, -84],
          'computer3': [-0.4, -0.2, -0.2, -45, 40, -88],
          'mobile': [-1.8, 0.3, 1.2, -104, 25, -62]
      }

      let selectedPoster = posterPos[posterNumber];
      viewCameraAt(selectedPoster[3], selectedPoster[4], selectedPoster[5], selectedPoster[0], selectedPoster[1], selectedPoster[2])
    }

    return (<>
    <group position-y={-0.5}>
      <Center top>
        <OrbitControls enabled={orbEnabled} ref={orbitRef} />
        <arrowHelper
      ref={raycasterHelper}
      args={[new THREE.Vector3(), new THREE.Vector3(0, 0, -1), 1, 0xff0000]}
        />
        <group ref={meshRef} dispose={null} position={[50, -30, 60]} >
          <mesh
            ref={computer1}
            castShadow
            receiveShadow
            geometry={nodes.Cube018.geometry}
            material={nodes.Cube018.material}
            position={[-112.54, 29.87, -70.28]}
          ><meshBasicMaterial map={baked} />
            <Html occlude={'blending'} transform wrapperClass="htmlScreen" distanceFactor={36} position={[0.35, 0.2, 0.1]} rotation-y={1.57}>
              <iframe onPointerLeave={(e) => {console.log(e.target)}} onPointerEnter={(e) => {console.log(e); animateToPosters('computer1')}} src="https://threejs.org/" />
            </Html>
          </mesh>
          <mesh
            castShadow
            onPointerMissed={(e) => animateToPosters('outside')}
            receiveShadow
            geometry={nodes.Cube014.geometry}
            material={nodes.Cube014.material}
            position={[-116.15, 83.93, -76.74]}
            rotation={[-Math.PI, -Math.PI / 2, 0]}
          ><meshBasicMaterial map={baked} /></mesh>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Cube013.geometry}
            material={nodes.Cube013.material}
            position={[-83.76, 83.93, -116.38]}
            rotation={[-Math.PI, 0, 0]}
          ><meshBasicMaterial map={baked} /></mesh>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Cube020.geometry}
            material={nodes.Cube020.material}
            position={[-28.64, 83.93, -116.38]}
            rotation={[-Math.PI, 0, 0]}
          ><meshBasicMaterial map={baked} /></mesh>
          <mesh
            ref={mobile}
            onClick={(e) => animateToPosters('mobile')}
            castShadow
            receiveShadow
            geometry={nodes.MobileScreen.geometry}
            material={nodes.MobileScreen.material}
            position={[-106.19, 18.27, -62.93]}
            rotation={[0, -0.33, 0]}
          ><meshBasicMaterial map={baked} /></mesh>
          <mesh
            ref={computer2}
            onClick={(e) => animateToPosters('computer2')}
            castShadow
            receiveShadow
            geometry={nodes.Comuter2Screen.geometry}
            material={nodes.Comuter2Screen.material}
            position={[-59.58, 33.87, -108.3]}
            rotation={[-0.25, 0.44, 0.11]}
          ><meshBasicMaterial map={baked} />
            <Html occlude={'blending'} transform wrapperClass="htmlScreen" distanceFactor={31} position={[0.1, -0.2, 0.2]} rotation-y={0}>
              <iframe onPointerLeave={(e) => {console.log(e.target)}} onPointerEnter={(e) => {console.log(e); animateToPosters('computer2')}} src="https://bruno-simon.com/html" height={192} width={303}/>
            </Html>
          </mesh>
          <mesh
            ref={computer3}
            onClick={(e) => animateToPosters('computer3')}
            castShadow
            receiveShadow
            geometry={nodes.Computer3Screen.geometry}
            material={nodes.Computer3Screen.material}
            position={[-38.07, 30.11, -107.99]}
            rotation={[-0.5, -0.34, -0.18]}
          ><meshBasicMaterial map={baked} /></mesh>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Main_light.geometry}
            material={nodes.Main_light.material}
            position={[-74.52, 115.43, -67.61]}
            scale={3.98}
          ><meshBasicMaterial map={baked} /></mesh>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Main_Light_side.geometry}
            material={nodes.Main_Light_side.material}
            position={[-74.52, 113.94, -67.61]}
            scale={3.98}
          ><meshBasicMaterial map={baked} /></mesh>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Cube060.geometry}
            material={nodes.Cube060.material}
            position={[-15.24, 20.47, -107.67]}
            rotation={[0, Math.PI / 2, 0]}
          ><meshBasicMaterial map={baked} /></mesh>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Cube065.geometry}
            material={nodes.Cube065.material}
            position={[-15.24, 29.81, -107.67]}
            rotation={[0, Math.PI / 2, 0]}
          ><meshBasicMaterial map={baked} /></mesh>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Cube066.geometry}
            material={nodes.Cube066.material}
            position={[-15.24, 39.7, -107.67]}
            rotation={[0, Math.PI / 2, 0]}
          ><meshBasicMaterial map={baked} /></mesh>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Cube067.geometry}
            material={nodes.Cube067.material}
            position={[-15.24, 52.75, -107.67]}
            rotation={[0, Math.PI / 2, 0]}
          ><meshBasicMaterial map={baked} /></mesh>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Cube068.geometry}
            material={nodes.Cube068.material}
            position={[-4.5, 34.76, -107.67]}
            rotation={[0, Math.PI / 2, 0]}
          ><meshBasicMaterial map={baked} /></mesh>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Cube069.geometry}
            material={nodes.Cube069.material}
            position={[-26.01, 35.52, -107.67]}
            rotation={[0, Math.PI / 2, 0]}
          ><meshBasicMaterial map={baked} /></mesh>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Cube070.geometry}
            material={nodes.Cube070.material}
            position={[-20.51, 34.76, -98.87]}
            rotation={[0, Math.PI / 2, 0]}
          ><meshBasicMaterial map={baked} /></mesh>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Cube071.geometry}
            material={nodes.Cube071.material}
            position={[-9.91, 34.76, -98.87]}
            rotation={[0, Math.PI / 2, 0]}
          ><meshBasicMaterial map={baked} /></mesh>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Cube072.geometry}
            material={nodes.Cube072.material}
            position={[-15.24, 11.05, -107.67]}
            rotation={[0, Math.PI / 2, 0]}
          ><meshBasicMaterial map={baked} /></mesh>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Cube061.geometry}
            material={nodes.Cube061.material}
            position={[-4.28, 26.75, -99.75]}
          ><meshBasicMaterial map={baked} /></mesh>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Cube062.geometry}
            material={nodes.Cube062.material}
            position={[-4.28, 26.75, -115.58]}
          ><meshBasicMaterial map={baked} /></mesh>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Cube063.geometry}
            material={nodes.Cube063.material}
            position={[-26.21, 26.75, -115.58]}
          ><meshBasicMaterial map={baked} /></mesh>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Cube012.geometry}
            material={nodes.Cube012.material}
            position={[-20.51, 34.76, -98.87]}
            rotation={[0, Math.PI / 2, 0]}
          ><meshBasicMaterial map={baked} /></mesh>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Cube025.geometry}
            material={nodes.Cube025.material}
            position={[-26.22, 26.75, -99.75]}
          ><meshBasicMaterial map={baked} /></mesh>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Cube027.geometry}
            material={nodes.Cube027.material}
            position={[-107.29, 20.46, -32.61]}
            rotation={[0, -0.35, 0]}
          ><meshBasicMaterial map={baked} /></mesh>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Cube098.geometry}
            material={nodes.Cube098.material}
            position={[-107.29, 20.46, -32.61]}
            rotation={[0, -0.35, 0]}
          ><meshBasicMaterial map={baked} /></mesh>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Cube029.geometry}
            material={nodes.Cube029.material}
            position={[-106.75, 21.37, -32.99]}
            rotation={[0, 0.01, 0]}
          ><meshBasicMaterial map={baked} /></mesh>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Cube058.geometry}
            material={nodes.Cube058.material}
            position={[-106.75, 21.37, -32.99]}
            rotation={[0, 0.01, 0]}
          ><meshBasicMaterial map={baked} /></mesh>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Cube073.geometry}
            material={nodes.Cube073.material}
            position={[-107.29, 22.23, -32.61]}
            rotation={[0, -0.25, 0]}
          ><meshBasicMaterial map={baked} /></mesh>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Cube074.geometry}
            material={nodes.Cube074.material}
            position={[-107.29, 22.23, -32.61]}
            rotation={[0, -0.25, 0]}
          ><meshBasicMaterial map={baked} /></mesh>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Cube075.geometry}
            material={nodes.Cube075.material}
            position={[-106.42, 23.15, -33.22]}
            rotation={[0, -0.11, 0]}
          ><meshBasicMaterial map={baked} /></mesh>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Cube089.geometry}
            material={nodes.Cube089.material}
            position={[-106.42, 23.15, -33.22]}
            rotation={[0, -0.11, 0]}
          ><meshBasicMaterial map={baked} /></mesh>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Cube076.geometry}
            material={nodes.Cube076.material}
            position={[-17.44, 24.71, -104.33]}
            rotation={[-Math.PI, 0, -Math.PI / 2]}
          ><meshBasicMaterial map={baked} /></mesh>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Cube077.geometry}
            material={nodes.Cube077.material}
            position={[-17.44, 24.71, -104.39]}
            rotation={[-Math.PI, 0, -1.57]}
          ><meshBasicMaterial map={baked} /></mesh>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Cube078.geometry}
            material={nodes.Cube078.material}
            position={[-16.41, 23.84, -104.49]}
            rotation={[-Math.PI, 0, -Math.PI / 2]}
          ><meshBasicMaterial map={baked} /></mesh>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Cube079.geometry}
            material={nodes.Cube079.material}
            position={[-16.38, 23.84, -104.49]}
            rotation={[-Math.PI, 0, -1.57]}
          ><meshBasicMaterial map={baked} /></mesh>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Cube080.geometry}
            material={nodes.Cube080.material}
            position={[-18.47, 23.56, -103.96]}
            rotation={[-Math.PI, 0, -Math.PI / 2]}
          ><meshBasicMaterial map={baked} /></mesh>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Cube081.geometry}
            material={nodes.Cube081.material}
            position={[-18.47, 23.56, -103.96]}
            rotation={[-Math.PI, 0, -1.57]}
          ><meshBasicMaterial map={baked} /></mesh>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Cube084.geometry}
            material={nodes.Cube084.material}
            position={[-9.88, 21.51, -106.29]}
            rotation={[0, -0.68, 0]}
          ><meshBasicMaterial map={baked} /></mesh>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Cube085.geometry}
            material={nodes.Cube085.material}
            position={[-9.88, 21.51, -106.29]}
            rotation={[0, -0.68, 0]}
          ><meshBasicMaterial map={baked} /></mesh>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Cube086.geometry}
            material={nodes.Cube086.material}
            position={[-9.86, 22.42, -105.25]}
            rotation={[0, -1.36, 0]}
          ><meshBasicMaterial map={baked} /></mesh>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Cube087.geometry}
            material={nodes.Cube087.material}
            position={[-9.86, 22.42, -105.25]}
            rotation={[0, -1.36, 0]}
          ><meshBasicMaterial map={baked} /></mesh>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Cube088.geometry}
            material={nodes.Cube088.material}
            position={[-9.88, 23.28, -106.29]}
            rotation={[Math.PI, -1.47, Math.PI]}
          ><meshBasicMaterial map={baked} /></mesh>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Cube097.geometry}
            material={nodes.Cube097.material}
            position={[-9.88, 23.28, -106.29]}
            rotation={[Math.PI, -1.47, Math.PI]}
          ><meshBasicMaterial map={baked} /></mesh>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Cube082.geometry}
            material={nodes.Cube082.material}
            position={[-20.87, 24.38, -103.96]}
            rotation={[-Math.PI, 0, -Math.PI / 2]}
          ><meshBasicMaterial map={baked} /></mesh>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Cube083.geometry}
            material={nodes.Cube083.material}
            position={[-20.87, 24.38, -103.96]}
            rotation={[-Math.PI, 0, -1.57]}
          ><meshBasicMaterial map={baked} /></mesh>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Cube099.geometry}
            material={nodes.Cube099.material}
            position={[-19.75, 23.97, -103.44]}
            rotation={[-Math.PI, 0, -Math.PI / 2]}
          ><meshBasicMaterial map={baked} /></mesh>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Cube100.geometry}
            material={nodes.Cube100.material}
            position={[-19.71, 23.97, -103.44]}
            rotation={[-Math.PI, 0, -1.57]}
          ><meshBasicMaterial map={baked} /></mesh>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Cube101.geometry}
            material={nodes.Cube101.material}
            position={[-22.1, 23.51, -103.86]}
            rotation={[-Math.PI, 0, -Math.PI / 2]}
          ><meshBasicMaterial map={baked} /></mesh>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Cube102.geometry}
            material={nodes.Cube102.material}
            position={[-22.1, 23.51, -103.86]}
            rotation={[-Math.PI, 0, -1.57]}
          ><meshBasicMaterial map={baked} /></mesh>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Cube105.geometry}
            material={nodes.Cube105.material}
            position={[-12.52, 15.26, -103.61]}
            rotation={[-Math.PI, 0, -Math.PI / 2]}
          ><meshBasicMaterial map={baked} /></mesh>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Cube106.geometry}
            material={nodes.Cube106.material}
            position={[-12.52, 15.26, -103.61]}
            rotation={[-Math.PI, 0, -1.57]}
          ><meshBasicMaterial map={baked} /></mesh>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Cube107.geometry}
            material={nodes.Cube107.material}
            position={[-13.81, 14.11, -103.96]}
            rotation={[-Math.PI, 0, -Math.PI / 2]}
          ><meshBasicMaterial map={baked} /></mesh>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Cube108.geometry}
            material={nodes.Cube108.material}
            position={[-13.81, 14.11, -103.96]}
            rotation={[-Math.PI, 0, -1.57]}
          ><meshBasicMaterial map={baked} /></mesh>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Cube109.geometry}
            material={nodes.Cube109.material}
            position={[-17.82, 14.94, -103.53]}
            rotation={[-Math.PI, 0, -Math.PI / 2]}
          ><meshBasicMaterial map={baked} /></mesh>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Cube110.geometry}
            material={nodes.Cube110.material}
            position={[-17.82, 14.94, -103.53]}
            rotation={[-Math.PI, 0, -1.57]}
          ><meshBasicMaterial map={baked} /></mesh>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Cube111.geometry}
            material={nodes.Cube111.material}
            position={[-15.47, 14.52, -103.19]}
            rotation={[-Math.PI, 0, -Math.PI / 2]}
          ><meshBasicMaterial map={baked} /></mesh>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Cube112.geometry}
            material={nodes.Cube112.material}
            position={[-15.42, 14.52, -103.19]}
            rotation={[-Math.PI, 0, -1.57]}
          ><meshBasicMaterial map={baked} /></mesh>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Cube059.geometry}
            material={nodes.Cube059.material}
            position={[-13.06, 40.7, -108.6]}
            rotation={[0, -0.99, 0]}
          ><meshBasicMaterial map={baked} /></mesh>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Cube090.geometry}
            material={nodes.Cube090.material}
            position={[-13.06, 40.7, -108.6]}
            rotation={[0, -0.99, 0]}
          ><meshBasicMaterial map={baked} /></mesh>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Cube091.geometry}
            material={nodes.Cube091.material}
            position={[-12.4, 41.61, -108.59]}
            rotation={[0, -0.63, 0]}
          ><meshBasicMaterial map={baked} /></mesh>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Cube092.geometry}
            material={nodes.Cube092.material}
            position={[-12.4, 41.61, -108.59]}
            rotation={[0, -0.63, 0]}
          ><meshBasicMaterial map={baked} /></mesh>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Cube093.geometry}
            material={nodes.Cube093.material}
            position={[-13.06, 42.47, -108.6]}
            rotation={[0, -0.89, 0]}
          ><meshBasicMaterial map={baked} /></mesh>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Cube094.geometry}
            material={nodes.Cube094.material}
            position={[-13.06, 42.47, -108.6]}
            rotation={[0, -0.89, 0]}
          ><meshBasicMaterial map={baked} /></mesh>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Cube095.geometry}
            material={nodes.Cube095.material}
            position={[-12, 43.4, -108.58]}
            rotation={[0, -0.75, 0]}
          ><meshBasicMaterial map={baked} /></mesh>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Cube096.geometry}
            material={nodes.Cube096.material}
            position={[-12, 43.4, -108.58]}
            rotation={[0, -0.75, 0]}
          ><meshBasicMaterial map={baked} /></mesh>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Cube103.geometry}
            material={nodes.Cube103.material}
            position={[-20.59, 15.48, -102.69]}
            rotation={[-Math.PI, 0, -Math.PI / 2]}
          ><meshBasicMaterial map={baked} /></mesh>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Cube104.geometry}
            material={nodes.Cube104.material}
            position={[-20.59, 15.5, -102.69]}
            rotation={[-Math.PI, 0, -1.57]}
          ><meshBasicMaterial map={baked} /></mesh>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Cube021.geometry}
            material={nodes.Cube021.material}
            position={[-24.16, 24.83, -102.69]}
            rotation={[-Math.PI, 0, -Math.PI / 2]}
          ><meshBasicMaterial map={baked} /></mesh>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Cube022.geometry}
            material={nodes.Cube022.material}
            position={[-24.16, 24.86, -102.69]}
            rotation={[-Math.PI, 0, -1.57]}
          ><meshBasicMaterial map={baked} /></mesh>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Poster1.geometry}
            material={nodes.Poster1.material}
            position={[-118.06, 65.74, -76.82]}
          ><meshBasicMaterial map={baked} /></mesh>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Poster3.geometry}
            material={nodes.Poster3.material}
            position={[-95.76, 65.74, -118.23]}
            rotation={[0, -Math.PI / 2, 0]}
          ><meshBasicMaterial map={baked} /></mesh>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Poster4.geometry}
            material={nodes.Poster4.material}
            position={[-71.91, 65.74, -118.23]}
            rotation={[0, -Math.PI / 2, 0]}
          ><meshBasicMaterial map={baked} /></mesh>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Poster5.geometry}
            material={nodes.Poster5.material}
            position={[-28.74, 71.56, -118.24]}
            rotation={[-Math.PI / 2, 0, -Math.PI / 2]}
          ><meshBasicMaterial map={baked} /></mesh>
          <mesh
            ref={poster4}
            onClick={(e) => animateToPosters('poster4')}
            castShadow
            receiveShadow
            geometry={nodes.Poster5001.geometry}
            material={nodes.Poster5001.material}
            position={[-28.74, 71.56, -118.24]}
            rotation={[-Math.PI / 2, 0, -Math.PI / 2]}
          ><meshBasicMaterial map={baked} /></mesh>
          <mesh
            ref={poster1}
            onClick={(e) => animateToPosters('poster1')}
            castShadow
            receiveShadow
            geometry={nodes.Poster1001.geometry}
            material={nodes.Poster1001.material}
            position={[-118.06, 65.74, -76.82]}
          ><meshBasicMaterial map={baked} /></mesh>
          <mesh
            ref={poster2}
            onClick={(e) => animateToPosters('poster2')}
            castShadow
            receiveShadow
            geometry={nodes.Poster3001.geometry}
            material={nodes.Poster3001.material}
            position={[-95.76, 65.74, -118.23]}
            rotation={[0, -Math.PI / 2, 0]}
          ><meshBasicMaterial map={baked} /></mesh>
          <mesh
            ref={poster3}
            onClick={(e) => animateToPosters('poster3')}
            castShadow
            receiveShadow
            geometry={nodes.Poster4001.geometry}
            material={nodes.Poster4001.material}
            position={[-71.91, 65.74, -118.23]}
            rotation={[0, -Math.PI / 2, 0]}
          ><meshBasicMaterial map={baked} /></mesh>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Tubelightstand1.geometry}
            material={nodes.Tubelightstand1.material}
            position={[-116.27, 84.06, -76.76]}
            rotation={[Math.PI, 0, Math.PI]}
          ><meshBasicMaterial map={baked} /></mesh>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Tubelightstand2.geometry}
            material={nodes.Tubelightstand2.material}
            position={[-83.73, 84.06, -116.5]}
            rotation={[0, 1.57, 0]}
          ><meshBasicMaterial map={baked} /></mesh>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Tubelightstand3.geometry}
            material={nodes.Tubelightstand3.material}
            position={[-28.61, 84.06, -116.5]}
            rotation={[0, 1.57, 0]}
          ><meshBasicMaterial map={baked} /></mesh>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Computer2.geometry}
            material={nodes.Computer2.material}
            position={[-59.56, 33.87, -108.22]}
            rotation={[-0.25, 0.44, 0.11]}
          ><meshBasicMaterial map={baked} /></mesh>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Computer2stand.geometry}
            material={nodes.Computer2stand.material}
            position={[-59.04, 22.79, -107.21]}
            rotation={[0, 0.45, 0]}
          ><meshBasicMaterial map={baked} /></mesh>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Computer3Stand.geometry}
            material={nodes.Computer3Stand.material}
            position={[-38.25, 23.2, -107.73]}
            rotation={[0, -0.39, 0]}
          ><meshBasicMaterial map={baked} /></mesh>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Computer3standstand.geometry}
            material={nodes.Computer3standstand.material}
            position={[-37.95, 25.75, -108.24]}
            rotation={[0.38, -0.36, 0.14]}
          ><meshBasicMaterial map={baked} /></mesh>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Computer3.geometry}
            material={nodes.Computer3.material}
            position={[-38.07, 30.11, -107.99]}
            rotation={[-0.5, -0.34, -0.18]}
          ><meshBasicMaterial map={baked} /></mesh>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Printer001.geometry}
            material={nodes.Printer001.material}
            position={[-75.41, 22.28, -108.62]}
            rotation={[0, Math.PI / 2, 0]}
          ><meshBasicMaterial map={baked} /></mesh>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Printer002.geometry}
            material={nodes.Printer002.material}
            position={[-75.41, 22.28, -108.62]}
            rotation={[0, Math.PI / 2, 0]}
          ><meshBasicMaterial map={baked} /></mesh>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Printer003.geometry}
            material={nodes.Printer003.material}
            position={[-75.41, 22.28, -108.62]}
            rotation={[0, Math.PI / 2, 0]}
          ><meshBasicMaterial map={baked} /></mesh>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Cube015.geometry}
            material={nodes.Cube015.material}
            position={[-112.54, 29.87, -70.28]}
          ><meshBasicMaterial map={baked} /></mesh>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Cube016.geometry}
            material={nodes.Cube016.material}
            position={[-111.77, 20.92, -70.4]}
            rotation={[0, 0, 0.44]}
          ><meshBasicMaterial map={baked} /></mesh>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Cube017.geometry}
            material={nodes.Cube017.material}
            position={[-111.03, 18.64, -70.53]}
          ><meshBasicMaterial map={baked} /></mesh>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Left_Table_Box.geometry}
            material={nodes.Left_Table_Box.material}
            position={[-106.9, 27.59, -17.38]}
            rotation={[0, 0, 0.48]}
          ><meshBasicMaterial map={baked} /></mesh>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Left_Table001.geometry}
            material={nodes.Left_Table001.material}
            position={[-108.7, 0.45, -7.16]}
            rotation={[Math.PI, 0, Math.PI]}
          ><meshBasicMaterial map={baked} /></mesh>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Left_Table002.geometry}
            material={nodes.Left_Table002.material}
            position={[-108.73, 0.53, -7.22]}
            rotation={[Math.PI, 0, Math.PI]}
          ><meshBasicMaterial map={baked} /></mesh>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.KeyboardSimple.geometry}
            material={nodes.KeyboardSimple.material}
            position={[-53.88, 33.83, -111.81]}
            rotation={[1.38, 0.1, -0.47]}
          ><meshBasicMaterial map={baked} /></mesh>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.KeyboardKeysSimple.geometry}
            material={nodes.KeyboardKeysSimple.material}
            position={[-53.88, 33.83, -111.81]}
            rotation={[1.38, 0.1, -0.47]}
          ><meshBasicMaterial map={baked} /></mesh>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Mouse1.geometry}
            material={nodes.Mouse1.material}
            position={[-106.25, 18.86, -88.96]}
          ><meshBasicMaterial map={baked} /></mesh>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Mouse2.geometry}
            material={nodes.Mouse2.material}
            position={[-40.89, 23.2, -98.05]}
            rotation={[0, Math.PI / 2, 0]}
          ><meshBasicMaterial map={baked} /></mesh>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.DrawDoor.geometry}
            material={nodes.DrawDoor.material}
            position={[-34.78, 13.36, -92.92]}
            rotation={[0, -1.48, 0]}
          ><meshBasicMaterial map={baked} /></mesh>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Mobile.geometry}
            material={nodes.Mobile.material}
            position={[-106.19, 18.27, -62.93]}
            rotation={[0, -0.33, 0]}
          ><meshBasicMaterial map={baked} /></mesh>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Left_Table_Box001.geometry}
            material={nodes.Left_Table_Box001.material}
            position={[-7.04, 16.68, -107.79]}
            rotation={[0, 0, 0.48]}
          ><meshBasicMaterial map={baked} /></mesh>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Cube002.geometry}
            material={nodes.Cube002.material}
            position={[-101.62, 11.24, -60.72]}
          ><meshBasicMaterial map={baked} /></mesh>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Cube004.geometry}
            material={nodes.Cube004.material}
            position={[-101.62, 7.32, -60.72]}
          ><meshBasicMaterial map={baked} /></mesh>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Cube006.geometry}
            material={nodes.Cube006.material}
            position={[-97.68, 3.42, -60.72]}
          ><meshBasicMaterial map={baked} /></mesh>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Cube.geometry}
            material={nodes.Cube.material}
            position={[-103.53, 15.65, -54.36]}
          ><meshBasicMaterial map={baked} /></mesh>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Cube007.geometry}
            material={nodes.Cube007.material}
            position={[-92.29, 17.61, -107.44]}
            rotation={[0, Math.PI / 2, 0]}
          ><meshBasicMaterial map={baked} /></mesh>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Cube010.geometry}
            material={nodes.Cube010.material}
            position={[-115.52, 15.65, -54.36]}
          ><meshBasicMaterial map={baked} /></mesh>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Mesh001.geometry}
            material={nodes.Mesh001.material}
            position={[-65.63, 19.33, -104.81]}
            rotation={[0, Math.PI / 2, 0]}
          ><meshBasicMaterial map={baked} /></mesh>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Mesh002.geometry}
            material={nodes.Mesh002.material}
            position={[-65.63, 19.33, -104.81]}
            rotation={[0, Math.PI / 2, 0]}
          ><meshBasicMaterial map={baked} /></mesh>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Cube028.geometry}
            material={nodes.Cube028.material}
            position={[-103.99, 18.7, -71.44]}
            rotation={[2.53, 1.4, -2.55]}
            scale={0.77}
          ><meshBasicMaterial map={baked} /></mesh>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Cube031.geometry}
            material={nodes.Cube031.material}
            position={[-103.37, 18.64, -71.99]}
            rotation={[2.53, 1.4, -2.55]}
            scale={0.76}
          ><meshBasicMaterial map={baked} /></mesh>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Cube032.geometry}
            material={nodes.Cube032.material}
            position={[-104.65, 18.76, -71.13]}
            rotation={[2.53, 1.4, -2.55]}
            scale={0.75}
          ><meshBasicMaterial map={baked} /></mesh>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Cube033.geometry}
            material={nodes.Cube033.material}
            position={[-105.22, 18.83, -69.98]}
            rotation={[2.53, 1.4, -2.55]}
            scale={0.77}
          ><meshBasicMaterial map={baked} /></mesh>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Cube034.geometry}
            material={nodes.Cube034.material}
            position={[-104.54, 18.77, -70.18]}
            rotation={[2.53, 1.4, -2.55]}
          ><meshBasicMaterial map={baked} /></mesh>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Cube035.geometry}
            material={nodes.Cube035.material}
            position={[-103.86, 18.71, -70.37]}
            rotation={[2.53, 1.4, -2.55]}
          ><meshBasicMaterial map={baked} /></mesh>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Cube036.geometry}
            material={nodes.Cube036.material}
            position={[-103.21, 18.64, -70.7]}
            rotation={[2.53, 1.4, -2.55]}
          ><meshBasicMaterial map={baked} /></mesh>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Cube037.geometry}
            material={nodes.Cube037.material}
            position={[-106.65, 18.77, -80.81]}
            rotation={[2.53, 1.4, -2.55]}
            scale={0.75}
          ><meshBasicMaterial map={baked} /></mesh>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Cube038.geometry}
            material={nodes.Cube038.material}
            position={[-105.31, 18.65, -80.83]}
            rotation={[2.53, 1.4, -2.55]}
          ><meshBasicMaterial map={baked} /></mesh>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Cube039.geometry}
            material={nodes.Cube039.material}
            position={[-104.54, 18.59, -80.74]}
            rotation={[2.53, 1.4, -2.55]}
          ><meshBasicMaterial map={baked} /></mesh>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Cube040.geometry}
            material={nodes.Cube040.material}
            position={[-102.46, 18.58, -70.41]}
            rotation={[2.53, 1.4, -2.55]}
            scale={0.78}
          ><meshBasicMaterial map={baked} /></mesh>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Cube041.geometry}
            material={nodes.Cube041.material}
            position={[-103.15, 18.56, -75.39]}
            rotation={[2.53, 1.4, -2.55]}
          ><meshBasicMaterial map={baked} /></mesh>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Cube042.geometry}
            material={nodes.Cube042.material}
            position={[-103.5, 18.54, -77.87]}
            rotation={[2.53, 1.4, -2.55]}
            scale={0.85}
          ><meshBasicMaterial map={baked} /></mesh>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Cube043.geometry}
            material={nodes.Cube043.material}
            position={[-105.74, 18.88, -69.9]}
            rotation={[2.53, 1.4, -2.55]}
          ><meshBasicMaterial map={baked} /></mesh>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Cube044.geometry}
            material={nodes.Cube044.material}
            position={[-105.84, 18.87, -70.72]}
            rotation={[2.53, 1.4, -2.55]}
            scale={0.92}
          ><meshBasicMaterial map={baked} /></mesh>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Cube045.geometry}
            material={nodes.Cube045.material}
            position={[-106.73, 18.77, -81.83]}
            rotation={[2.53, 1.4, -2.55]}
            scale={0.8}
          ><meshBasicMaterial map={baked} /></mesh>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Cube046.geometry}
            material={nodes.Cube046.material}
            position={[-106.03, 18.69, -81.92]}
            rotation={[2.53, 1.4, -2.55]}
            scale={0.83}
          ><meshBasicMaterial map={baked} /></mesh>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Cube047.geometry}
            material={nodes.Cube047.material}
            position={[-105.46, 18.64, -82.01]}
            rotation={[2.53, 1.4, -2.55]}
            scale={0.83}
          ><meshBasicMaterial map={baked} /></mesh>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Cube048.geometry}
            material={nodes.Cube048.material}
            position={[-107.36, 18.81, -81.71]}
            rotation={[2.53, 1.4, -2.55]}
            scale={0.79}
          ><meshBasicMaterial map={baked} /></mesh>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Cube049.geometry}
            material={nodes.Cube049.material}
            position={[-106.09, 18.66, -84.52]}
            rotation={[2.53, 1.4, -2.55]}
          ><meshBasicMaterial map={baked} /></mesh>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Cube050.geometry}
            material={nodes.Cube050.material}
            position={[-104.72, 18.54, -84.73]}
            rotation={[2.53, 1.4, -2.55]}
          ><meshBasicMaterial map={baked} /></mesh>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Cube051.geometry}
            material={nodes.Cube051.material}
            position={[-104.9, 18.59, -82.09]}
            rotation={[2.53, 1.4, -2.55]}
            scale={0.83}
          ><meshBasicMaterial map={baked} /></mesh>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Cube052.geometry}
            material={nodes.Cube052.material}
            position={[-104.08, 18.52, -82.72]}
            rotation={[3.14, -0.14, -3.05]}
          ><meshBasicMaterial map={baked} /></mesh>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Cube053.geometry}
            material={nodes.Cube053.material}
            position={[-104.27, 18.51, -83.96]}
            rotation={[2.53, 1.4, -2.55]}
          ><meshBasicMaterial map={baked} /></mesh>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Cube054.geometry}
            material={nodes.Cube054.material}
            position={[-103.81, 18.55, -79.73]}
            rotation={[2.53, 1.4, -2.55]}
            scale={0.86}
          ><meshBasicMaterial map={baked} /></mesh>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Cube055.geometry}
            material={nodes.Cube055.material}
            position={[-104, 18.54, -81.29]}
            rotation={[2.53, 1.4, -2.55]}
            scale={0.86}
          ><meshBasicMaterial map={baked} /></mesh>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Cube056.geometry}
            material={nodes.Cube056.material}
            position={[-103.91, 18.54, -80.52]}
            rotation={[2.53, 1.4, -2.55]}
            scale={0.86}
          ><meshBasicMaterial map={baked} /></mesh>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Cube057.geometry}
            material={nodes.Cube057.material}
            position={[-103.35, 18.51, -79.71]}
            rotation={[2.53, 1.4, -2.55]}
            scale={0.79}
          ><meshBasicMaterial map={baked} /></mesh>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Big_Keyboard_Holder.geometry}
            material={nodes.Big_Keyboard_Holder.material}
            position={[-105.38, 18.42, -77.32]}
            rotation={[0, 0.14, -0.05]}
          ><meshBasicMaterial map={baked} /></mesh>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Cube114.geometry}
            material={nodes.Cube114.material}
            position={[-100.54, 14.67, -21.1]}
          ><meshBasicMaterial map={baked} /></mesh>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Cube116.geometry}
            material={nodes.Cube116.material}
            position={[-100.58, 7.11, -21.1]}
          ><meshBasicMaterial map={baked} /></mesh>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Cube115.geometry}
            material={nodes.Cube115.material}
            position={[-100.9, 14.86, -21.1]}
            rotation={[0, 0, -Math.PI / 2]}
          ><meshBasicMaterial map={baked} /></mesh>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Cube117.geometry}
            material={nodes.Cube117.material}
            position={[-100.94, 7.3, -21.1]}
            rotation={[0, 0, -Math.PI / 2]}
          ><meshBasicMaterial map={baked} /></mesh>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Cube001.geometry}
            material={nodes.Cube001.material}
            position={[-109.14, 7.39, -60.72]}
          ><meshBasicMaterial map={baked} /></mesh>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Left_Table.geometry}
            material={nodes.Left_Table.material}
            position={[-111.12, -1.34, -5.79]}
            rotation={[Math.PI, 0, Math.PI]}
          ><meshBasicMaterial map={baked} /></mesh>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Left_Table004.geometry}
            material={nodes.Left_Table004.material}
            position={[-111.12, -1.34, -5.79]}
            rotation={[Math.PI, 0, Math.PI]}
          ><meshBasicMaterial map={baked} /></mesh>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Cube003.geometry}
            material={nodes.Cube003.material}
            position={[-38.44, 13.32, -91.89]}
          ><meshBasicMaterial map={baked} /></mesh>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Cube005.geometry}
            material={nodes.Cube005.material}
            position={[-65.71, 12.45, -86.13]}
            rotation={[0, 0, -Math.PI / 2]}
          ><meshBasicMaterial map={baked} /></mesh>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Cube008.geometry}
            material={nodes.Cube008.material}
            position={[-81.46, 8.59, -107.4]}
            rotation={[0, Math.PI / 2, 0]}
          ><meshBasicMaterial map={baked} /></mesh>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Cube009.geometry}
            material={nodes.Cube009.material}
            position={[-88.11, 7.97, -98.46]}
          ><meshBasicMaterial map={baked} /></mesh>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Cube011.geometry}
            material={nodes.Cube011.material}
            position={[-81.46, 8.59, -107.4]}
            rotation={[0, Math.PI / 2, 0]}
          ><meshBasicMaterial map={baked} /></mesh>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Cube019.geometry}
            material={nodes.Cube019.material}
            position={[-65.71, 17.02, -90.61]}
            rotation={[0, 0, -Math.PI / 2]}
          ><meshBasicMaterial map={baked} /></mesh>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Mesh003.geometry}
            material={nodes.Mesh003.material}
            position={[-65.63, 19.28, -104.81]}
            rotation={[0, Math.PI / 2, 0]}
          ><meshBasicMaterial map={baked} /></mesh>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Soda.geometry}
            material={nodes.Soda.material}
            position={[-63.13, 22.76, -99.25]}
            rotation={[Math.PI / 2, 0, 0]}
          ><meshBasicMaterial map={baked} /></mesh>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Plant.geometry}
            material={nodes.Plant.material}
            position={[-108.67, 18.09, -108.84]}
          ><meshBasicMaterial map={baked2} /></mesh>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Plant001.geometry}
            material={nodes.Plant001.material}
            position={[-108.67, 18.09, -108.84]}
          ><meshBasicMaterial map={baked2} /></mesh>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Lamp1.geometry}
            material={nodes.Lamp1.material}
            position={[-105.86, 20.55, -44.66]}
            rotation={[0, 0.33, 0]}
          ><meshBasicMaterial map={baked2} /></mesh>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Cube113.geometry}
            material={nodes.Cube113.material}
            position={[-23.22, 40.63, -110.59]}
          ><meshBasicMaterial map={baked2} /></mesh>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Cube024.geometry}
            material={nodes.Cube024.material}
            position={[-21.4, 49.95, -110.13]}
            rotation={[0, -0.38, -0.27]}
          ><meshBasicMaterial map={baked2} /></mesh>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Lamp2sides.geometry}
            material={nodes.Lamp2sides.material}
            position={[-21.69, 49.95, -110.17]}
            rotation={[0, -0.38, -0.27]}
          ><meshBasicMaterial map={baked2} /></mesh>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Cube023.geometry}
            material={nodes.Cube023.material}
            position={[-23.22, 45.32, -110.59]}
            rotation={[0, 0, -0.3]}
            scale={[0.09, 11.66, 0.09]}
          ><meshBasicMaterial map={baked2} /></mesh>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Mug.geometry}
            material={nodes.Mug.material}
            position={[-105.4, 19.34, -54.97]}
            rotation={[0, -0.32, 0]}
          ><meshBasicMaterial map={baked2} /></mesh>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Mug_Handle.geometry}
            material={nodes.Mug_Handle.material}
            position={[-104.9, 19.54, -56.55]}
            rotation={[0, -0.32, 0]}
          ><meshBasicMaterial map={baked2} /></mesh>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Plane.geometry}
            material={nodes.Plane.material}
            position={[0.1, 0.05, -0.09]}
          ><meshBasicMaterial map={baked3} /></mesh>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Plane002.geometry}
            material={nodes.Plane002.material}
            position={[-118.4, 59.27, -0.08]}
            rotation={[Math.PI / 2, 0, -Math.PI / 2]}
          ><meshBasicMaterial map={baked3} /></mesh>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Plane003.geometry}
            material={nodes.Plane003.material}
            position={[0.11, 118.53, -0.08]}
          ><meshBasicMaterial map={baked3} /></mesh>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Plane001.geometry}
            material={nodes.Plane001.material}
            position={[0.11, 59.31, -118.58]}
            rotation={[Math.PI / 2, 0, Math.PI]}
          ><meshBasicMaterial map={baked3} /></mesh>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Chair004.geometry}
            material={nodes.Chair004.material}
            position={[-48.02, 0.24, -85.46]}
            rotation={[Math.PI / 2, 0, -0.37]}
          ><meshBasicMaterial map={baked2} /></mesh>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Chair005.geometry}
            material={nodes.Chair005.material}
            position={[-48.02, 0.24, -85.46]}
            rotation={[Math.PI / 2, 0, -0.37]}
          ><meshBasicMaterial map={baked2} /></mesh>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Chair006.geometry}
            material={nodes.Chair006.material}
            position={[-48.02, 0.24, -85.46]}
            rotation={[Math.PI / 2, 0, -0.37]}
          ><meshBasicMaterial map={baked2} /></mesh>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Chair007.geometry}
            material={nodes.Chair007.material}
            position={[-48.02, 0.24, -85.46]}
            rotation={[Math.PI / 2, 0, -0.37]}
          ><meshBasicMaterial map={baked2} /></mesh>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Chair004.geometry}
            material={nodes.Chair004.material}
            position={[-83.08, 0.2, -60]}
            rotation={[Math.PI / 2, 0, -2.41]}
          ><meshBasicMaterial map={baked2} /></mesh>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Chair005.geometry}
            material={nodes.Chair005.material}
            position={[-83.08, 0.2, -60]}
            rotation={[Math.PI / 2, 0, -2.41]}
          ><meshBasicMaterial map={baked2} /></mesh>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Chair006.geometry}
            material={nodes.Chair006.material}
            position={[-83.08, 0.2, -60]}
            rotation={[Math.PI / 2, 0, -2.41]}
          ><meshBasicMaterial map={baked2} /></mesh>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Chair007.geometry}
            material={nodes.Chair007.material}
            position={[-83.08, 0.2, -60]}
            rotation={[Math.PI / 2, 0, -2.41]}
          ><meshBasicMaterial map={baked2} /></mesh>
        </group>
      </Center>
    </group>
  </>)
}