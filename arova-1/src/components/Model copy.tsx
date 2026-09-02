import { useGLTF } from "@react-three/drei";
import { useEffect } from "react";
import gsap from "gsap";

export default function Model() {
  const { scene } = useGLTF("/models/arova-4.glb");

  useEffect(() => {
    // ============================================================
    // FIND COLOR PLANE
    // ============================================================

    const colorPlane = scene.getObjectByName("color-plane");

    if (!colorPlane) {
      console.log("Could not find color-plane");
      return;
    }

    // ============================================================
    // DEBUG
    // ============================================================


    colorPlane.position.x = -11;
    console.log("COLOR PLANE:", colorPlane);

    // ============================================================
    // START COLOR PLANE OFF TO THE LEFT
    // ============================================================

    // We'll establish this position once we see exactly
    // where the Blender plane is sitting.

    // ============================================================
    // ANIMATE COLOR PLANE
    // ============================================================

    gsap.to(colorPlane.position, {
      x: 0.1,
      duration: 2,
      
    });

    // ============================================================
    // CLEAN UP
    // ============================================================

    return () => {
      gsap.killTweensOf(colorPlane.position);
    };
  }, [scene]);

  return <primitive object={scene} />;
}

useGLTF.preload("/models/arova-4.glb");
