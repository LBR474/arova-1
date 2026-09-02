import { Canvas, useThree } from "@react-three/fiber";
import {
  OrbitControls,
  Environment,
  OrthographicCamera,
} from "@react-three/drei";
import { Suspense } from "react";

import Model from "./components/Model";

function Camera() {
  const { size } = useThree();

  const zoom = window.innerWidth < 768 ? 15 : 30;

  console.log(
    "R3F SIZE:",
    size.width,
    "x",
    size.height,
    "| WINDOW:",
    window.innerWidth,
    "| ZOOM:",
    zoom,
  );

  return <OrthographicCamera makeDefault position={[0, 0, 4]} zoom={zoom} />;
}

function App() {
  return (
    <Canvas>
      <Camera />

      <Suspense fallback={null}>
        <ambientLight intensity={1} />

        <directionalLight position={[5, 5, 5]} intensity={2} />

        <Model />

        <Environment preset="city" />

        <OrbitControls />
      </Suspense>
    </Canvas>
  );
}

export default App;
