"use client";
import React, { useEffect, useRef, useState } from "react";
import { useMotionValue, useSpring, motion } from "framer-motion";
import { Canvas, useFrame } from "@react-three/fiber";
import { Point, PointMaterial, Points } from "@react-three/drei";
import * as THREE from "three";
import { cn } from "@/lib/utils";

const Globe = ({
  className,
  globeConfig,
  data,
}: {
  className?: string;
  globeConfig: any;
  data: any[];
}) => {
  const [globe, setGlobe] = useState<any>(null);
  const canvasRef = useRef<any>(null);

  const {
    pointSize,
    globeColor,
    showAtmosphere,
    atmosphereColor,
    atmosphereAltitude,
    emissive,
    emissiveIntensity,
    shininess,
    polygonColor,
    ambientLight,
    directionalLeftLight,
    directionalTopLight,
    pointLight,
    arcTime,
    arcLength,
    rings,
    maxRings,
    initialPosition,
    initialZoom,
  } = globeConfig;

  let numbers = [];
  for (let i = 0; i < data.length; i++) {
    let arcs = data[i].arcs;
    for (let j = 0; j < arcs.length; j++) {
      let arc = arcs[j];
      if (arc.order > numbers.length) {
        numbers.push(arc.order);
      }
    }
  }

  useEffect(() => {
    if (globe) {
      globe.pointsData(data);
    }
  }, [globe, data]);

  useEffect(() => {
    if (globe) {
      globe.pointAltitude(0);
      globe.pointRadius(pointSize);
      globe.globeColor(globeColor);
      showAtmosphere
        ? globe.atmosphereColor(atmosphereColor)
        : globe.atmosphereColor("transparent");
      globe.atmosphereAltitude(atmosphereAltitude);
    }
  }, [
    globe,
    pointSize,
    globeColor,
    showAtmosphere,
    atmosphereColor,
    atmosphereAltitude,
  ]);

  return (
    <div className={cn("absolute inset-0 h-full w-full", className)}>
      <Canvas
        ref={canvasRef}
        camera={{ position: [0, 0, initialZoom], fov: 75 }}
      >
        <ambientLight color={ambientLight} intensity={0.5} />
        <directionalLight color={directionalLeftLight} position={[1, 0, 1]} />
        <directionalLight color={directionalTopLight} position={[0, 1, 0]} />
        <pointLight color={pointLight} position={[0, 0, 0]} />
        <motion.group
          animate={{
            x: 0,
            y: 0,
            z: 0,
          }}
          transition={{
            duration: 1,
            ease: "linear",
          }}
        >
          <World
            globeConfig={globeConfig}
            data={data}
            globeRef={setGlobe}
          />
        </motion.group>
      </Canvas>
    </div>
  );
};

const World = ({
  globeConfig,
  data,
  globeRef,
}: {
  globeConfig: any;
  data: any[];
  globeRef: any;
}) => {
  const { initialPosition } = globeConfig;

  const [ThreeGlobe, setThreeGlobe] = useState<any>(null);

  useEffect(() => {
    import("three-globe").then((module) => {
      setThreeGlobe(() => module.default);
    });
  }, []);

  const ref = useRef<any>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.controls().enableZoom = true;
      ref.current.controls().autoRotate = true;
      ref.current.controls().autoRotateSpeed = 0.5;
      ref.current.controls().enablePan = false;

      // Pan to initial position
      const { lat, lng } = initialPosition;
      ref.current.pointOfView({ lat, lng }, 500);
    }
  }, [ref.current, initialPosition]);

  if (!ThreeGlobe) {
    return null;
  }
  return <ThreeGlobe ref={(globe: any) => { ref.current = globe; globeRef(globe); }} pointsData={data} />;
};

export { Globe };
