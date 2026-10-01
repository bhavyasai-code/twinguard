import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { 
  Activity, 
  AlertTriangle, 
  CheckCircle2, 
  Cpu, 
  Eye, 
  Flame, 
  Gauge, 
  Layers, 
  RotateCw, 
  ShieldAlert, 
  Sliders, 
  Zap 
} from 'lucide-react';
import { MachineHealthStatus, SensorReading } from '../../types';
import { useTheme } from '../../context/ThemeContext';

interface DigitalTwinViewProps {
  sensor: SensorReading;
  healthScore: number;
  status: MachineHealthStatus;
  failureProbability: number;
  rulDays: number;
  onConditionChange: (condition: 'normal' | 'warning' | 'critical') => void;
  currentMode: 'normal' | 'warning' | 'critical';
}

export const DigitalTwinView: React.FC<DigitalTwinViewProps> = ({
  sensor,
  healthScore,
  status,
  failureProbability,
  rulDays,
  onConditionChange,
  currentMode,
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const mountRef = useRef<HTMLDivElement>(null);
  const [wireframe, setWireframe] = useState(false);
  const [viewMode, setViewMode] = useState<'3d' | 'blueprint'>('3d');
  const [explodedView, setExplodedView] = useState(false);

  // References for Three.js animation loop
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const motorGroupRef = useRef<THREE.Group | null>(null);
  const rotorRef = useRef<THREE.Mesh | null>(null);
  const statorRef = useRef<THREE.Mesh | null>(null);
  const bearingRef = useRef<THREE.Mesh | null>(null);
  const fanRef = useRef<THREE.Group | null>(null);
  const heatRingRef = useRef<THREE.Mesh | null>(null);
  const glowLightRef = useRef<THREE.PointLight | null>(null);
  const gridHelperRef = useRef<THREE.GridHelper | null>(null);

  // Keep latest sensor values in ref for frame loop without re-instantiating scene
  const sensorRef = useRef(sensor);
  sensorRef.current = sensor;
  const statusRef = useRef(status);
  statusRef.current = status;
  const explodedRef = useRef(explodedView);
  explodedRef.current = explodedView;
  const isDarkRef = useRef(isDark);
  isDarkRef.current = isDark;

  useEffect(() => {
    if (!mountRef.current || viewMode !== '3d') return;

    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight || 540;

    // Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 3.2, 7.5);
    camera.lookAt(0, 0, 0);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    rendererRef.current = renderer;

    mountRef.current.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, isDark ? 0.85 : 1.2);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(isDark ? 0x00f2fe : 0x0284c7, isDark ? 2.0 : 1.5);
    dirLight1.position.set(5, 8, 6);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(isDark ? 0xa855f7 : 0x818cf8, isDark ? 1.0 : 0.8);
    dirLight2.position.set(-6, -4, -4);
    scene.add(dirLight2);

    const glowLight = new THREE.PointLight(isDark ? 0x10b981 : 0x059669, isDark ? 2.5 : 1.8, 8);
    glowLight.position.set(0, 0, 0);
    scene.add(glowLight);
    glowLightRef.current = glowLight;

    // Ground Grid with engineering look (adapted for dark bright vs light pastel)
    const gridHelper = new THREE.GridHelper(12, 24, isDark ? 0x06b6d4 : 0x0284c7, isDark ? 0x1e293b : 0xcbd5e1);
    gridHelper.position.y = -1.5;
    scene.add(gridHelper);
    gridHelperRef.current = gridHelper;

    // Motor Assembly Root Group
    const motorGroup = new THREE.Group();
    scene.add(motorGroup);
    motorGroupRef.current = motorGroup;

    // 1. Stator Casing (Cylinder with cooling fins)
    const statorGeo = new THREE.CylinderGeometry(1.3, 1.3, 3.2, 32);
    const statorMat = new THREE.MeshStandardMaterial({
      color: isDark ? 0x1e293b : 0x334155,
      metalness: 0.85,
      roughness: 0.25,
      wireframe: false,
    });
    const statorMesh = new THREE.Mesh(statorGeo, statorMat);
    statorMesh.rotation.z = Math.PI / 2;
    statorMesh.castShadow = true;
    statorMesh.receiveShadow = true;
    motorGroup.add(statorMesh);
    statorRef.current = statorMesh;

    // Cooling Fins around stator
    const finsGroup = new THREE.Group();
    const finMat = new THREE.MeshStandardMaterial({ 
      color: isDark ? 0x0f172a : 0x475569, 
      metalness: 0.9, 
      roughness: 0.3 
    });
    for (let i = 0; i < 12; i++) {
      const finGeo = new THREE.BoxGeometry(0.12, 1.5, 3.0);
      const fin = new THREE.Mesh(finGeo, finMat);
      fin.rotation.x = (i * Math.PI) / 6;
      finsGroup.add(fin);
    }
    motorGroup.add(finsGroup);

    // 2. Central Rotor Shaft
    const shaftGeo = new THREE.CylinderGeometry(0.28, 0.28, 5.0, 24);
    const shaftMat = new THREE.MeshStandardMaterial({
      color: isDark ? 0x94a3b8 : 0x64748b,
      metalness: 0.95,
      roughness: 0.15,
    });
    const shaftMesh = new THREE.Mesh(shaftGeo, shaftMat);
    shaftMesh.rotation.z = Math.PI / 2;
    motorGroup.add(shaftMesh);
    rotorRef.current = shaftMesh;

    // 3. Drive End Bearings Housing (Flange)
    const bearingGeo = new THREE.TorusGeometry(0.85, 0.22, 16, 32);
    const bearingMat = new THREE.MeshStandardMaterial({
      color: isDark ? 0xf59e0b : 0xd97706,
      metalness: 0.9,
      roughness: 0.2,
    });
    const bearingMesh = new THREE.Mesh(bearingGeo, bearingMat);
    bearingMesh.rotation.y = Math.PI / 2;
    bearingMesh.position.x = 1.7;
    motorGroup.add(bearingMesh);
    bearingRef.current = bearingMesh;

    // 4. Non-Drive End Cooling Fan Impeller
    const fanGroup = new THREE.Group();
    fanGroup.position.x = -1.9;
    const fanHubGeo = new THREE.CylinderGeometry(0.5, 0.5, 0.3, 16);
    const fanHubMat = new THREE.MeshStandardMaterial({ 
      color: isDark ? 0x00f2fe : 0x0284c7, 
      metalness: 0.6, 
      roughness: 0.4 
    });
    const fanHub = new THREE.Mesh(fanHubGeo, fanHubMat);
    fanHub.rotation.z = Math.PI / 2;
    fanGroup.add(fanHub);

    for (let b = 0; b < 6; b++) {
      const bladeGeo = new THREE.BoxGeometry(0.08, 0.7, 0.25);
      const bladeMat = new THREE.MeshStandardMaterial({ 
        color: isDark ? 0x0284c7 : 0x38bdf8, 
        metalness: 0.5, 
        roughness: 0.3 
      });
      const blade = new THREE.Mesh(bladeGeo, bladeMat);
      blade.position.y = 0.5 * Math.cos((b * Math.PI) / 3);
      blade.position.z = 0.5 * Math.sin((b * Math.PI) / 3);
      blade.rotation.x = (b * Math.PI) / 3 + 0.3;
      fanGroup.add(blade);
    }
    motorGroup.add(fanGroup);
    fanRef.current = fanGroup;

    // 5. Terminal Box
    const termBoxGeo = new THREE.BoxGeometry(0.9, 0.7, 0.9);
    const termBoxMat = new THREE.MeshStandardMaterial({ 
      color: isDark ? 0x334155 : 0x64748b, 
      metalness: 0.7, 
      roughness: 0.35 
    });
    const termBox = new THREE.Mesh(termBoxGeo, termBoxMat);
    termBox.position.set(0, 1.6, 0);
    motorGroup.add(termBox);

    // 6. Base Mount Mounting Footing Plate
    const basePlateGeo = new THREE.BoxGeometry(3.6, 0.25, 2.4);
    const basePlateMat = new THREE.MeshStandardMaterial({ 
      color: isDark ? 0x0f172a : 0x1e293b, 
      metalness: 0.8, 
      roughness: 0.4 
    });
    const basePlate = new THREE.Mesh(basePlateGeo, basePlateMat);
    basePlate.position.set(0, -1.35, 0);
    motorGroup.add(basePlate);

    // 7. Thermal Glow Ring
    const heatGeo = new THREE.RingGeometry(1.35, 1.45, 32);
    const heatMat = new THREE.MeshBasicMaterial({
      color: isDark ? 0x10b981 : 0x059669,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.6,
    });
    const heatRing = new THREE.Mesh(heatGeo, heatMat);
    heatRing.rotation.y = Math.PI / 2;
    motorGroup.add(heatRing);
    heatRingRef.current = heatRing;

    // Mouse Drag Rotation
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging || !motorGroupRef.current) return;
      const deltaX = e.clientX - prevMouseX;
      const deltaY = e.clientY - prevMouseY;
      motorGroupRef.current.rotation.y += deltaX * 0.008;
      motorGroupRef.current.rotation.x += deltaY * 0.008;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    const domElement = renderer.domElement;
    domElement.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    // Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();
      const currentSensor = sensorRef.current;
      const currentStatus = statusRef.current;
      const isExploded = explodedRef.current;
      const activeDark = isDarkRef.current;

      // Shaft and Fan Rotation speed tied to real RPM
      const rotSpeed = (currentSensor.rotationalSpeed / 1780) * 0.25;
      if (rotorRef.current) rotorRef.current.rotation.x += rotSpeed;
      if (fanRef.current) fanRef.current.rotation.x += rotSpeed;

      // Subtle base rotation if not actively dragging
      if (!isDragging && motorGroupRef.current) {
        motorGroupRef.current.rotation.y += 0.003;
      }

      // Vibration oscillation effect (High vibration produces jitter)
      if (motorGroupRef.current) {
        const vibIntensity = Math.min(0.08, (currentSensor.vibration / 10) * 0.035);
        if (currentSensor.vibration > 3.0) {
          motorGroupRef.current.position.y = Math.sin(elapsedTime * 45) * vibIntensity;
          motorGroupRef.current.position.z = Math.cos(elapsedTime * 40) * vibIntensity * 0.8;
        } else {
          motorGroupRef.current.position.y = 0;
          motorGroupRef.current.position.z = 0;
        }
      }

      // Exploded View kinematics
      if (bearingRef.current) {
        bearingRef.current.position.x = isExploded ? 2.6 : 1.7;
      }
      if (fanRef.current) {
        fanRef.current.position.x = isExploded ? -2.8 : -1.9;
      }
      if (termBox) {
        termBox.position.y = isExploded ? 2.3 : 1.6;
      }

      // Dynamic Thermal & Status Material Shading (Bright in dark mode, pastel/vivid in light mode)
      let statusColor = activeDark ? 0x10b981 : 0x10b981; // Green
      let glowIntensity = activeDark ? 2.5 : 1.6;
      if (currentStatus === 'Warning') {
        statusColor = activeDark ? 0xf59e0b : 0xd97706; // Amber
        glowIntensity = activeDark ? 3.0 : 2.0;
      } else if (currentStatus === 'Critical') {
        statusColor = activeDark ? 0xff2a5f : 0xe11d48; // Bright Neon Red in Dark
        glowIntensity = activeDark ? 4.5 + Math.sin(elapsedTime * 8) * 2.0 : 2.8;
      }

      if (glowLightRef.current) {
        glowLightRef.current.color.setHex(statusColor);
        glowLightRef.current.intensity = glowIntensity;
      }

      if (heatRingRef.current) {
        (heatRingRef.current.material as THREE.MeshBasicMaterial).color.setHex(statusColor);
        (heatRingRef.current.material as THREE.MeshBasicMaterial).opacity = 0.5 + Math.sin(elapsedTime * 3) * 0.3;
      }

      if (statorRef.current) {
        const mat = statorRef.current.material as THREE.MeshStandardMaterial;
        // Thermal heat mapping: high temperature tints stator casing
        if (currentSensor.temperature > 75) {
          mat.color.setHex(activeDark ? 0x991b1b : 0xb91c1c);
        } else if (currentSensor.temperature > 55) {
          mat.color.setHex(activeDark ? 0x92400e : 0xb45309);
        } else {
          mat.color.setHex(activeDark ? 0x1e293b : 0x334155);
        }
        mat.wireframe = wireframe;
      }

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!mountRef.current || !rendererRef.current) return;
      const newW = mountRef.current.clientWidth;
      const newH = mountRef.current.clientHeight || 540;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      rendererRef.current.setSize(newW, newH);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      domElement.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [viewMode, wireframe, isDark]);

  const getStatusBadge = () => {
    switch (status) {
      case 'Healthy':
        return (
          <div className={`flex items-center gap-1.5 font-semibold text-sm ${
            isDark ? 'text-emerald-400' : 'text-emerald-700'
          }`}>
            <CheckCircle2 className={`w-4 h-4 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`} />
            <span>Optimal Operation</span>
          </div>
        );
      case 'Warning':
        return (
          <div className={`flex items-center gap-1.5 font-semibold text-sm ${
            isDark ? 'text-amber-400' : 'text-amber-700'
          }`}>
            <AlertTriangle className={`w-4 h-4 ${isDark ? 'text-amber-400' : 'text-amber-600'}`} />
            <span>Maintenance Inspection Advised</span>
          </div>
        );
      case 'Critical':
        return (
          <div className={`flex items-center gap-1.5 font-semibold text-sm animate-pulse ${
            isDark ? 'text-rose-400' : 'text-rose-700'
          }`}>
            <ShieldAlert className={`w-4 h-4 ${isDark ? 'text-rose-400' : 'text-rose-600'}`} />
            <span>Critical Anomaly / Failure Imminent</span>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Twin Header & Quick Condition Injector */}
      <div className={`flex flex-col lg:flex-row lg:items-center justify-between gap-4 rounded-xl p-5 backdrop-blur-md border transition-colors ${
        isDark 
          ? 'bg-slate-900/80 border-slate-800 text-slate-100' 
          : 'bg-white/90 border-slate-200 text-slate-900 shadow-xs'
      }`}>
        <div className="flex items-start gap-4">
          <div className={`p-3 rounded-lg shrink-0 border ${
            isDark 
              ? 'bg-cyan-950/60 border-cyan-500/30 text-cyan-400' 
              : 'bg-sky-50 border-sky-200 text-sky-600'
          }`}>
            <Cpu className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h2 className={`text-xl font-bold ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
                Industrial Induction Motor Twin (Unit M-01)
              </h2>
              <span className={`text-xs font-mono px-2 py-0.5 rounded border ${
                isDark 
                  ? 'bg-slate-800 text-slate-300 border-slate-700' 
                  : 'bg-slate-100 text-slate-700 border-slate-200'
              }`}>
                TWIN-ID: IND-MOT-415V-01
              </span>
            </div>
            <div className={`flex items-center gap-3 mt-1 text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              <span>Synchronized: Physics Simulation Layer</span>
              <span aria-hidden="true">·</span>
              <span>Class F Stator Insulation</span>
              <span aria-hidden="true">·</span>
              <span>Drive: Three-Phase Squirrel Cage</span>
            </div>
          </div>
        </div>

        {/* Simulation condition switcher with pastel tones in light mode and bright colors in dark mode */}
        <div className={`flex items-center gap-2 p-1.5 rounded-lg border ${
          isDark ? 'bg-slate-950/80 border-slate-800' : 'bg-slate-100 border-slate-200'
        }`}>
          <span className={`text-xs px-2 font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Condition Preset:
          </span>
          <button
            onClick={() => onConditionChange('normal')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              currentMode === 'normal'
                ? isDark 
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-xs shadow-emerald-500/30' 
                  : 'bg-emerald-200 text-emerald-900 font-bold border border-emerald-300 shadow-xs'
                : isDark 
                  ? 'text-slate-400 hover:text-slate-200' 
                  : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Normal
          </button>
          <button
            onClick={() => onConditionChange('warning')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              currentMode === 'warning'
                ? isDark 
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-xs shadow-amber-500/30' 
                  : 'bg-amber-200 text-amber-900 font-bold border border-amber-300 shadow-xs'
                : isDark 
                  ? 'text-slate-400 hover:text-slate-200' 
                  : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Warning
          </button>
          <button
            onClick={() => onConditionChange('critical')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              currentMode === 'critical'
                ? isDark 
                  ? 'bg-rose-500 text-white font-bold shadow-xs shadow-rose-500/30' 
                  : 'bg-rose-200 text-rose-900 font-bold border border-rose-300 shadow-xs'
                : isDark 
                  ? 'text-slate-400 hover:text-slate-200' 
                  : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Critical
          </button>
        </div>
      </div>

      {/* Main Digital Twin Visualizer Stage */}
      <div className={`relative rounded-2xl overflow-hidden shadow-2xl min-h-[580px] flex flex-col justify-between p-6 border transition-colors ${
        isDark 
          ? 'bg-slate-950 border-slate-800' 
          : 'bg-gradient-to-b from-slate-50 via-sky-50/20 to-slate-100 border-slate-200 shadow-md'
      }`}>
        {/* Background Subtle Radial Gradient */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-40 transition-colors duration-700"
          style={{
            background: isDark 
              ? status === 'Healthy'
                ? 'radial-gradient(circle at 50% 50%, rgba(16, 185, 129, 0.15) 0%, transparent 70%)'
                : status === 'Warning'
                ? 'radial-gradient(circle at 50% 50%, rgba(245, 158, 11, 0.18) 0%, transparent 70%)'
                : 'radial-gradient(circle at 50% 50%, rgba(239, 68, 68, 0.22) 0%, transparent 70%)'
              : status === 'Healthy'
                ? 'radial-gradient(circle at 50% 50%, rgba(187, 247, 208, 0.35) 0%, transparent 70%)'
                : status === 'Warning'
                ? 'radial-gradient(circle at 50% 50%, rgba(254, 240, 138, 0.35) 0%, transparent 70%)'
                : 'radial-gradient(circle at 50% 50%, rgba(254, 205, 211, 0.4) 0%, transparent 70%)'
          }}
        />

        {/* Top Floating Telemetry & Controls */}
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {getStatusBadge()}
            <span className={isDark ? 'text-slate-600' : 'text-slate-300'}>|</span>
            <div className={`flex items-center gap-1.5 text-xs font-mono ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              <span>Health:</span>
              <span className={`font-semibold ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>{healthScore}%</span>
            </div>
            <span className={isDark ? 'text-slate-600' : 'text-slate-300'}>|</span>
            <div className={`flex items-center gap-1.5 text-xs font-mono ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              <span>Failure Risk:</span>
              <span className={failureProbability > 0.3 
                ? (isDark ? 'text-rose-400 font-semibold' : 'text-rose-600 font-bold') 
                : (isDark ? 'text-slate-100 font-semibold' : 'text-slate-800 font-semibold')
              }>
                {(failureProbability * 100).toFixed(0)}%
              </span>
            </div>
          </div>

          {/* Visualization Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setExplodedView(!explodedView)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors cursor-pointer ${
                explodedView
                  ? isDark 
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40' 
                    : 'bg-sky-100 text-sky-800 border-sky-300'
                  : isDark 
                    ? 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200' 
                    : 'bg-white text-slate-600 border-slate-200 hover:text-slate-900 shadow-xs'
              }`}
              title="Disassemble components to inspect bearings and shaft"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>{explodedView ? 'Collapse Assembly' : 'Exploded View'}</span>
            </button>

            <button
              onClick={() => setWireframe(!wireframe)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors cursor-pointer ${
                wireframe
                  ? isDark 
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40' 
                    : 'bg-sky-100 text-sky-800 border-sky-300'
                  : isDark 
                    ? 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200' 
                    : 'bg-white text-slate-600 border-slate-200 hover:text-slate-900 shadow-xs'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>{wireframe ? 'Solid' : 'Wireframe'}</span>
            </button>

            <div className={`flex items-center rounded-lg p-0.5 border ${
              isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-100 border-slate-200'
            }`}>
              <button
                onClick={() => setViewMode('3d')}
                className={`px-2.5 py-1 text-xs font-medium rounded cursor-pointer transition-colors ${
                  viewMode === '3d' 
                    ? isDark ? 'bg-cyan-500 text-slate-950 font-bold' : 'bg-sky-600 text-white font-bold' 
                    : isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                3D Spatial
              </button>
              <button
                onClick={() => setViewMode('blueprint')}
                className={`px-2.5 py-1 text-xs font-medium rounded cursor-pointer transition-colors ${
                  viewMode === 'blueprint' 
                    ? isDark ? 'bg-cyan-500 text-slate-950 font-bold' : 'bg-sky-600 text-white font-bold' 
                    : isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                2D Schematic
              </button>
            </div>
          </div>
        </div>

        {/* Center: 3D Canvas OR 2D Blueprint */}
        {viewMode === '3d' ? (
          <div className="relative w-full h-[400px] flex items-center justify-center my-2">
            <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />
            <div className={`absolute bottom-2 left-4 text-[11px] font-mono pointer-events-none select-none ${
              isDark ? 'text-slate-500' : 'text-slate-500'
            }`}>
              Click &amp; drag to rotate 3D twin · Real-time thermal &amp; vibration displacement active
            </div>
          </div>
        ) : (
          /* 2D Schematic CAD Representation */
          <div className={`relative w-full h-[400px] flex items-center justify-center my-2 rounded-xl p-6 border transition-colors ${
            isDark 
              ? 'bg-slate-950/90 border-cyan-900/30' 
              : 'bg-sky-50/50 border-sky-200 shadow-xs'
          }`}>
            <svg viewBox="0 0 600 300" className="w-full h-full max-w-2xl">
              {/* Engineering Blueprint Grid */}
              <defs>
                <pattern id="cadGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path 
                    d="M 20 0 L 0 0 0 20" 
                    fill="none" 
                    stroke={isDark ? 'rgba(6, 182, 212, 0.08)' : 'rgba(2, 132, 199, 0.12)'} 
                    strokeWidth="0.8" 
                  />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#cadGrid)" />

              {/* Motor Stator Body */}
              <rect
                x="180"
                y="90"
                width="240"
                height="120"
                rx="8"
                fill={
                  sensor.temperature > 75 
                    ? (isDark ? '#450a0a' : '#fecdd3') 
                    : sensor.temperature > 55 
                    ? (isDark ? '#451a03' : '#fef3c7') 
                    : (isDark ? '#0f172a' : '#e2e8f0')
                }
                stroke={
                  status === 'Critical' 
                    ? (isDark ? '#ff3366' : '#e11d48') 
                    : status === 'Warning' 
                    ? (isDark ? '#f59e0b' : '#d97706') 
                    : (isDark ? '#06b6d4' : '#0284c7')
                }
                strokeWidth="2.5"
                className="transition-colors duration-500"
              />

              {/* Cooling Fins */}
              {[-30, -15, 0, 15, 30, 45].map((offset, idx) => (
                <line
                  key={idx}
                  x1={200 + idx * 36}
                  y1="75"
                  x2={200 + idx * 36}
                  y2="90"
                  stroke={isDark ? '#38bdf8' : '#0284c7'}
                  strokeWidth="2"
                  strokeDasharray="2 2"
                />
              ))}

              {/* Rotating Shaft */}
              <rect
                x="120"
                y="135"
                width="360"
                height="30"
                fill={isDark ? '#334155' : '#94a3b8'}
                stroke={isDark ? '#64748b' : '#475569'}
                strokeWidth="2"
              />

              {/* Bearing Blocks */}
              <rect
                x="410"
                y="120"
                width="40"
                height="60"
                rx="4"
                fill={sensor.vibration > 4.5 ? (isDark ? '#7f1d1d' : '#fecdd3') : (isDark ? '#1e293b' : '#f1f5f9')}
                stroke={sensor.vibration > 4.5 ? (isDark ? '#ff3366' : '#e11d48') : (isDark ? '#f59e0b' : '#d97706')}
                strokeWidth="2"
              />
              <text 
                x="430" 
                y="195" 
                fill={isDark ? '#f59e0b' : '#b45309'} 
                fontSize="10" 
                textAnchor="middle" 
                fontFamily="monospace"
                fontWeight="bold"
              >
                BEARING
              </text>

              {/* Fan Shroud */}
              <polygon
                points="140,80 180,95 180,205 140,220"
                fill={isDark ? '#0284c7' : '#bae6fd'}
                opacity={isDark ? '0.6' : '0.8'}
                stroke={isDark ? '#38bdf8' : '#0284c7'}
                strokeWidth="2"
              />
              <text 
                x="160" 
                y="240" 
                fill={isDark ? '#38bdf8' : '#0369a1'} 
                fontSize="10" 
                textAnchor="middle" 
                fontFamily="monospace"
                fontWeight="bold"
              >
                FAN
              </text>

              {/* Terminal Box */}
              <rect
                x="260"
                y="40"
                width="80"
                height="50"
                rx="4"
                fill={isDark ? '#1e293b' : '#f8fafc'}
                stroke={isDark ? '#06b6d4' : '#0284c7'}
                strokeWidth="2"
              />
              <text 
                x="300" 
                y="70" 
                fill={isDark ? '#94a3b8' : '#334155'} 
                fontSize="11" 
                textAnchor="middle" 
                fontFamily="monospace"
                fontWeight="bold"
              >
                VFD IN: {sensor.voltage.toFixed(0)}V
              </text>

              {/* Live Status Label */}
              <text 
                x="300" 
                y="155" 
                fill={isDark ? '#ffffff' : '#0f172a'} 
                fontSize="14" 
                fontWeight="bold" 
                textAnchor="middle" 
                fontFamily="sans-serif"
              >
                DIGITAL TWIN M-01
              </text>
              <text 
                x="300" 
                y="175" 
                fill={isDark ? '#94a3b8' : '#64748b'} 
                fontSize="11" 
                textAnchor="middle" 
                fontFamily="monospace"
              >
                SPEED: {sensor.rotationalSpeed} RPM · {status.toUpperCase()}
              </text>
            </svg>
          </div>
        )}

        {/* Circular Spatial Live Telemetry HUD */}
        <div className={`relative z-10 grid grid-cols-2 md:grid-cols-5 gap-3 pt-4 border-t ${
          isDark ? 'border-slate-800/80' : 'border-slate-200'
        }`}>
          {/* Temperature */}
          <div className={`rounded-xl p-3 flex flex-col items-center text-center border transition-colors ${
            isDark 
              ? 'bg-slate-900/90 border-slate-800' 
              : 'bg-orange-50/70 border-orange-200/80 text-orange-950 shadow-xs'
          }`}>
            <div className={`flex items-center gap-1.5 text-xs mb-1 ${isDark ? 'text-slate-400' : 'text-orange-700'}`}>
              <Flame className={`w-3.5 h-3.5 ${isDark ? 'text-orange-400' : 'text-orange-600'}`} />
              <span>Temperature</span>
            </div>
            <span className={`text-xl font-bold font-mono tabular-nums ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
              {sensor.temperature.toFixed(1)} <span className={`text-xs font-normal ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>°C</span>
            </span>
            <span className={`text-[10px] mt-0.5 ${
              sensor.temperature > 65 
                ? (isDark ? 'text-rose-400 font-semibold' : 'text-rose-700 font-bold') 
                : (isDark ? 'text-slate-400' : 'text-slate-600')
            }`}>
              {sensor.temperature > 85 ? 'Critical Overheat' : sensor.temperature > 65 ? 'Warning High' : 'Nominal (40-50°C)'}
            </span>
          </div>

          {/* Vibration */}
          <div className={`rounded-xl p-3 flex flex-col items-center text-center border transition-colors ${
            isDark 
              ? 'bg-slate-900/90 border-slate-800' 
              : 'bg-sky-50/70 border-sky-200/80 text-sky-950 shadow-xs'
          }`}>
            <div className={`flex items-center gap-1.5 text-xs mb-1 ${isDark ? 'text-slate-400' : 'text-sky-700'}`}>
              <Activity className={`w-3.5 h-3.5 ${isDark ? 'text-cyan-400' : 'text-sky-600'}`} />
              <span>Vibration</span>
            </div>
            <span className={`text-xl font-bold font-mono tabular-nums ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
              {sensor.vibration.toFixed(2)} <span className={`text-xs font-normal ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>mm/s</span>
            </span>
            <span className={`text-[10px] mt-0.5 ${
              sensor.vibration > 4.5 
                ? (isDark ? 'text-rose-400 font-semibold' : 'text-rose-700 font-bold') 
                : (isDark ? 'text-slate-400' : 'text-slate-600')
            }`}>
              {sensor.vibration > 7.1 ? 'Zone D (Destructive)' : sensor.vibration > 4.5 ? 'Zone C (Warning)' : 'Zone A/B (Normal)'}
            </span>
          </div>

          {/* Pressure */}
          <div className={`rounded-xl p-3 flex flex-col items-center text-center border transition-colors ${
            isDark 
              ? 'bg-slate-900/90 border-slate-800' 
              : 'bg-indigo-50/70 border-indigo-200/80 text-indigo-950 shadow-xs'
          }`}>
            <div className={`flex items-center gap-1.5 text-xs mb-1 ${isDark ? 'text-slate-400' : 'text-indigo-700'}`}>
              <Gauge className={`w-3.5 h-3.5 ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`} />
              <span>Pressure</span>
            </div>
            <span className={`text-xl font-bold font-mono tabular-nums ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
              {sensor.pressure.toFixed(2)} <span className={`text-xs font-normal ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>bar</span>
            </span>
            <span className={`text-[10px] mt-0.5 ${
              sensor.pressure > 3.2 
                ? (isDark ? 'text-amber-400' : 'text-amber-700 font-medium') 
                : (isDark ? 'text-slate-400' : 'text-slate-600')
            }`}>
              {sensor.pressure > 4.0 ? 'Overpressure' : sensor.pressure > 3.2 ? 'Slightly Abnormal' : 'Nominal (2.4 bar)'}
            </span>
          </div>

          {/* Voltage */}
          <div className={`rounded-xl p-3 flex flex-col items-center text-center border transition-colors ${
            isDark 
              ? 'bg-slate-900/90 border-slate-800' 
              : 'bg-amber-50/70 border-amber-200/80 text-amber-950 shadow-xs'
          }`}>
            <div className={`flex items-center gap-1.5 text-xs mb-1 ${isDark ? 'text-slate-400' : 'text-amber-700'}`}>
              <Zap className={`w-3.5 h-3.5 ${isDark ? 'text-yellow-400' : 'text-amber-600'}`} />
              <span>Voltage</span>
            </div>
            <span className={`text-xl font-bold font-mono tabular-nums ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
              {sensor.voltage.toFixed(0)} <span className={`text-xs font-normal ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>V</span>
            </span>
            <span className={`text-[10px] mt-0.5 ${
              sensor.voltage < 210 || sensor.voltage > 250 
                ? (isDark ? 'text-rose-400' : 'text-rose-700 font-medium') 
                : (isDark ? 'text-slate-400' : 'text-slate-600')
            }`}>
              {sensor.voltage < 210 ? 'Undervoltage Sag' : sensor.voltage > 250 ? 'Overvoltage Surge' : 'Stable Supply'}
            </span>
          </div>

          {/* Current */}
          <div className={`rounded-xl p-3 flex flex-col items-center text-center col-span-2 md:col-span-1 border transition-colors ${
            isDark 
              ? 'bg-slate-900/90 border-slate-800' 
              : 'bg-purple-50/70 border-purple-200/80 text-purple-950 shadow-xs'
          }`}>
            <div className={`flex items-center gap-1.5 text-xs mb-1 ${isDark ? 'text-slate-400' : 'text-purple-700'}`}>
              <Sliders className={`w-3.5 h-3.5 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} />
              <span>Current</span>
            </div>
            <span className={`text-xl font-bold font-mono tabular-nums ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
              {sensor.current.toFixed(2)} <span className={`text-xs font-normal ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>A</span>
            </span>
            <span className={`text-[10px] mt-0.5 ${
              sensor.current > 6.8 
                ? (isDark ? 'text-rose-400' : 'text-rose-700 font-medium') 
                : (isDark ? 'text-slate-400' : 'text-slate-600')
            }`}>
              {sensor.current > 8.5 ? 'Overcurrent Trip' : sensor.current > 6.8 ? 'High Motor Load' : 'Nominal Load'}
            </span>
          </div>
        </div>
      </div>

      {/* Subsystem Component Breakdown Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className={`rounded-xl p-4 border transition-colors ${
          isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
        }`}>
          <div className={`flex items-center justify-between text-xs mb-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            <span className={isDark ? 'text-slate-300' : 'text-slate-800 font-medium'}>Drive-End Bearings</span>
            <span className={`font-mono font-bold ${
              sensor.vibration > 4.5 
                ? (isDark ? 'text-amber-400' : 'text-amber-700') 
                : (isDark ? 'text-emerald-400' : 'text-emerald-600')
            }`}>
              {sensor.vibration > 4.5 ? 'Stressed' : 'Good'}
            </span>
          </div>
          <div className={`w-full rounded-full h-1.5 overflow-hidden ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`}>
            <div 
              className={`h-full transition-all duration-500 ${sensor.vibration > 4.5 ? 'bg-amber-500' : 'bg-emerald-500'}`}
              style={{ width: `${Math.max(10, Math.min(100, 100 - sensor.vibration * 10))}%` }}
            />
          </div>
          <p className={`text-[11px] mt-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Deep-groove SKF 6308 ceramic hybrid bearing telemetry
          </p>
        </div>

        <div className={`rounded-xl p-4 border transition-colors ${
          isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
        }`}>
          <div className={`flex items-center justify-between text-xs mb-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            <span className={isDark ? 'text-slate-300' : 'text-slate-800 font-medium'}>Stator Winding Heat</span>
            <span className={`font-mono font-bold ${
              sensor.temperature > 65 
                ? (isDark ? 'text-rose-400' : 'text-rose-700') 
                : (isDark ? 'text-emerald-400' : 'text-emerald-600')
            }`}>
              {sensor.temperature.toFixed(0)}°C
            </span>
          </div>
          <div className={`w-full rounded-full h-1.5 overflow-hidden ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`}>
            <div 
              className={`h-full transition-all duration-500 ${sensor.temperature > 65 ? 'bg-rose-500' : 'bg-emerald-500'}`}
              style={{ width: `${Math.min(100, (sensor.temperature / 95) * 100)}%` }}
            />
          </div>
          <p className={`text-[11px] mt-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Class F thermal insulation rating limit 155°C
          </p>
        </div>

        <div className={`rounded-xl p-4 border transition-colors ${
          isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
        }`}>
          <div className={`flex items-center justify-between text-xs mb-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            <span className={isDark ? 'text-slate-300' : 'text-slate-800 font-medium'}>Lubrication Hydro-Line</span>
            <span className={`font-mono font-bold ${isDark ? 'text-cyan-400' : 'text-sky-700'}`}>
              {sensor.pressure.toFixed(1)} bar
            </span>
          </div>
          <div className={`w-full rounded-full h-1.5 overflow-hidden ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`}>
            <div 
              className={`h-full transition-all duration-500 ${isDark ? 'bg-cyan-500' : 'bg-sky-500'}`}
              style={{ width: `${Math.min(100, (sensor.pressure / 4.5) * 100)}%` }}
            />
          </div>
          <p className={`text-[11px] mt-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            ISO VG 68 oil film thickness nominal
          </p>
        </div>

        <div className={`rounded-xl p-4 border transition-colors ${
          isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
        }`}>
          <div className={`flex items-center justify-between text-xs mb-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            <span className={isDark ? 'text-slate-300' : 'text-slate-800 font-medium'}>Remaining Useful Life</span>
            <span className={`font-mono font-bold ${isDark ? 'text-cyan-400' : 'text-sky-700'}`}>
              {rulDays} days
            </span>
          </div>
          <div className={`w-full rounded-full h-1.5 overflow-hidden ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`}>
            <div 
              className={`h-full transition-all duration-500 ${isDark ? 'bg-cyan-500' : 'bg-sky-500'}`}
              style={{ width: `${Math.min(100, (rulDays / 30) * 100)}%` }}
            />
          </div>
          <p className={`text-[11px] mt-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Est. {(rulDays * 24).toFixed(0)} operating hours before overhaul
          </p>
        </div>
      </div>
    </div>
  );
};
