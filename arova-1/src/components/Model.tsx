
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";

export default function Model() {

  const { scene } = useGLTF(`${import.meta.env.BASE_URL}models/arova-1.glb`);

  const progressRef =
    useRef(0);


  // ============================================================
  // CREATE SHADERS
  // ============================================================

  useEffect(() => {

    // ==========================================================
    // ANIMATION ORDER
    // ==========================================================

    const letterOrder: Record<string, number> = {

      a: 0,
      r: 1,
      o: 2,
      v: 3,
      a2: 4,
      registered: 5,

    };


    // ==========================================================
    // FIND LETTERS
    // ==========================================================

    scene.traverse((object) => {

      if (!(object instanceof THREE.Mesh)) {
        return;
      }


      const mesh =
        object;

      const name =
        mesh.name.toLowerCase();


      // ========================================================
      // IS THIS ONE OF OUR LETTERS?
      // ========================================================

      if (!(name in letterOrder)) {
        return;
      }


      console.log(
        "LETTER FOUND:",
        mesh.name
      );


      // ========================================================
      // LETTER INDEX
      // ========================================================

      const letterIndex =
        letterOrder[name];


      // ========================================================
      // FIND GEOMETRY BOUNDING BOX
      // ========================================================

      mesh.geometry.computeBoundingBox();

      const boundingBox =
        mesh.geometry.boundingBox;


      if (!boundingBox) {
        return;
      }


      const minX =
        boundingBox.min.x;

      const maxX =
        boundingBox.max.x;


      console.log(
        mesh.name,
        "MIN X:",
        minX,
        "MAX X:",
        maxX,
        "INDEX:",
        letterIndex
      );


      // ========================================================
      // CREATE SHADER MATERIAL
      // ========================================================

      const material = new THREE.ShaderMaterial({
        side: THREE.DoubleSide,

        uniforms: {
          progress: {
            value: 0,
          },

          minX: {
            value: minX,
          },

          maxX: {
            value: maxX,
          },

          letterIndex: {
            value: letterIndex,
          },
        },

        // ====================================================
        // VERTEX SHADER
        // ====================================================

        vertexShader: `

            uniform float minX;
            uniform float maxX;

            varying float vLetterPosition;


            void main() {

              // ================================================
              // NORMALIZE X POSITION
              // ================================================

              vLetterPosition =
                (position.x - minX)
                /
                (maxX - minX);


              // ================================================
              // POSITION
              // ================================================

              gl_Position =
                projectionMatrix *
                modelViewMatrix *
                vec4(
                  position,
                  1.0
                );

            }

          `,

        // ====================================================
        // FRAGMENT SHADER
        // ====================================================

        fragmentShader: `

            uniform float progress;
            uniform float letterIndex;

            varying float vLetterPosition;


            void main() {


// ================================================
// LOCAL PROGRESS FOR THIS LETTER
// ================================================

float localProgress =
  progress - letterIndex;


// ================================================
// RED SWEEP
// ================================================

float mask = 0.0;


// Letter hasn't started yet
if (localProgress <= 0.0) {

  mask = 0.0;

}


// Letter has completely finished
else if (localProgress >= 1.0) {

  mask = 1.0;

}


// Letter is currently sweeping
else {

  mask =
    1.0 -
    smoothstep(
      localProgress - 0.1,
      localProgress + 0.1,
      vLetterPosition
    );

}



              // ================================================
              // COLOURS
              // ================================================

              vec3 white =
                vec3(
                  1.0,
                  1.0,
                  1.0
                );

              vec3 red =
                vec3(
                  0.749,
                  0.345,
                  0.271
                );

              // ================================================
              // MIX
              // ================================================

              vec3 colour =
                mix(
                  white,
                  red,
                  mask
                );


              gl_FragColor =
                vec4(
                  colour,
                  1.0
                );

            }

          `,
      });


      // ========================================================
      // APPLY MATERIAL
      // ========================================================

      mesh.material =
        material;


      // ========================================================
      // STORE MATERIAL
      // ========================================================

      mesh.userData.shaderMaterial =
        material;

    });


    // ==========================================================
    // CLEANUP
    // ==========================================================

    return () => {

      scene.traverse((object) => {

        if (!(object instanceof THREE.Mesh)) {
          return;
        }


        const material =
          object.userData.shaderMaterial;


        if (
          material instanceof THREE.ShaderMaterial
        ) {

          material.dispose();

          delete object.userData.shaderMaterial;

        }

      });

    };

  }, [scene]);


  // ============================================================
  // ANIMATE A → R → O → V → A → REGISTERED
  // ============================================================

  useFrame(() => {

    // ----------------------------------------------------------
    // ANIMATION SPEED
    // ----------------------------------------------------------

    progressRef.current += 0.03;


    // ==========================================================
    // UPDATE ALL LETTERS
    // ==========================================================

    scene.traverse((object) => {

      if (!(object instanceof THREE.Mesh)) {
        return;
      }


      const material =
        object.userData.shaderMaterial;


      if (
        material instanceof THREE.ShaderMaterial
      ) {

        material.uniforms.progress.value =
          progressRef.current;

      }

    });


    // ==========================================================
    // STOP AFTER REGISTERED
    // ==========================================================

    if (progressRef.current > 6) {

      progressRef.current = 6;

    }

  });


  // ============================================================
  // RENDER
  // ============================================================

  return (
    <primitive object={scene} />
  );

}


useGLTF.preload(`${import.meta.env.BASE_URL}models/arova-1.glb`);

