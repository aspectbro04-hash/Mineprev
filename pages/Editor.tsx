import React, { useEffect, useRef, useState } from 'react';
import { Download, Upload, RotateCw, Pause, Play, Layers, Wand2, Accessibility } from 'lucide-react';
import { AnimationType } from '../types';

const FILTERS = [
  { name: 'Normal', value: 'none', label: 'Normal' },
  { name: 'Vintage', value: 'sepia(0.5) contrast(0.8) brightness(1.1)', label: 'Vintage' },
  { name: 'Noir', value: 'grayscale(1) contrast(1.2)', label: 'Noir' },
  { name: 'Vivid', value: 'saturate(2) contrast(1.1)', label: 'Vivid' },
  { name: 'Sepia', value: 'sepia(1)', label: 'Sepia' },
  { name: 'Cinematic', value: 'contrast(1.2) saturate(1.1) brightness(1.1)', label: 'Kino' }, 
];

// Pose Definitions
interface PoseConfig {
  id: string;
  name: string;
  type: 'animation' | 'static';
  anim?: any; // skinview3d animation class
  limbs?: {
    head?: { x?: number; y?: number; z?: number };
    leftArm?: { x?: number; y?: number; z?: number };
    rightArm?: { x?: number; y?: number; z?: number };
    leftLeg?: { x?: number; y?: number; z?: number };
    rightLeg?: { x?: number; y?: number; z?: number };
    body?: { x?: number; y?: number; z?: number };
  };
}

const Editor: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const viewerRef = useRef<any>(null);
  
  const [username, setUsername] = useState('Notch');
  const [selectedPoseId, setSelectedPoseId] = useState<string>('idle');
  const [isRotating, setIsRotating] = useState(true);
  const [bgColor, setBgColor] = useState('#18181b');
  const [selectedFilter, setSelectedFilter] = useState(FILTERS[0]);

  // Define Poses inside component to access window.skinview3d if needed, 
  // or just use string references and instantiate inside useEffect
  const POSES: PoseConfig[] = [
    { id: 'idle', name: 'Turish (Idle)', type: 'animation', anim: null },
    { id: 'walk', name: 'Yurish (Walking)', type: 'animation', anim: 'walk' },
    { id: 'run', name: 'Yugurish (Running)', type: 'animation', anim: 'run' },
    { id: 'fly', name: 'Uchish (Flying)', type: 'animation', anim: 'fly' },
    { 
      id: 'sit', name: "O'tirish (Sitting)", type: 'static', 
      limbs: { 
        leftLeg: { x: -1.5 }, rightLeg: { x: -1.5 },
        leftArm: { x: -0.2 }, rightArm: { x: -0.2 }
      } 
    },
    { 
      id: 'zombie', name: 'Zombi (Zombie)', type: 'static', 
      limbs: { 
        leftArm: { x: -1.57 }, rightArm: { x: -1.57 } 
      } 
    },
    { 
      id: 'tpose', name: 'T-Pose', type: 'static', 
      limbs: { 
        leftArm: { z: -1.57 }, rightArm: { z: 1.57 } 
      } 
    },
    { 
      id: 'dab', name: 'Dab', type: 'static', 
      limbs: { 
        head: { x: 0.5, y: 0.5 },
        leftArm: { x: -0.5, y: 0.5, z: -0.5 }, 
        rightArm: { x: -2.5, y: 1, z: 1 } 
      } 
    },
    { 
      id: 'hug', name: 'Quchoqlash (Hug)', type: 'static', 
      limbs: { 
        leftArm: { z: -0.3, x: -1.0 }, rightArm: { z: 0.3, x: -1.0 } 
      } 
    },
    { 
      id: 'point', name: "Ko'rsatish (Pointing)", type: 'static', 
      limbs: { 
        rightArm: { x: -1.57, z: 0.2 },
        head: { y: -0.3 }
      } 
    },
    { 
      id: 'guard', name: "Himoya (Guarding)", type: 'static', 
      limbs: { 
        leftArm: { x: -0.5, z: 0.5 }, rightArm: { x: -0.5, z: -0.5 } 
      } 
    },
    { 
      id: 'facepalm', name: "Yuzni yopish (Facepalm)", type: 'static', 
      limbs: { 
        rightArm: { x: -2.5, z: 0.5 },
        head: { x: 0.3 }
      } 
    },
    { 
      id: 'item_hold', name: "Buyum ushlash (Item)", type: 'static', 
      limbs: { 
        rightArm: { x: -0.5, z: 0.1 } 
      } 
    },
    { 
      id: 'bow', name: "Kamon (Bow Aim)", type: 'static', 
      limbs: { 
        rightArm: { x: -1.57, y: -0.1 }, 
        leftArm: { x: -1.57, y: 0.5 },
        head: { y: -0.5 }
      } 
    },
    { 
      id: 'sword_lunge', name: "Qilich (Sword Lunge)", type: 'static', 
      limbs: { 
        rightArm: { x: -1.8, z: 0.3 }, 
        leftArm: { x: 0.5, z: -0.2 },
        leftLeg: { x: 0.5 },
        rightLeg: { x: -0.5 }
      } 
    },
    { 
      id: 'look_sky', name: "Osmonga qarash", type: 'static', 
      limbs: { 
        head: { x: -0.8 },
        leftArm: { z: -0.2 },
        rightArm: { z: 0.2 }
      } 
    },
    { 
      id: 'sleep', name: "Uxlash (Sleep)", type: 'static', 
      limbs: { 
         // Mocking sleep by rotating body parts to look mostly flat, 
         // though skinview3d doesn't rotate the root player group easily.
         head: { z: 0.3 },
         body: { z: 0.1 } // Subtle lean
      } 
    },
  ];

  // Initialize Viewer
  useEffect(() => {
    if (!canvasRef.current || !window.skinview3d) return;

    const viewer = new window.skinview3d.SkinViewer({
      canvas: canvasRef.current,
      width: 400,
      height: 500,
      skin: `https://minotar.net/skin/${username}`,
      preserveDrawingBuffer: true, // IMPORTANT: Allows canvas to be captured as image
      alpha: true // Allows transparent background
    });

    viewer.width = canvasRef.current.parentElement?.clientWidth || 400;
    viewer.height = 500;
    viewer.fov = 70;
    viewer.zoom = 0.9;
    viewer.autoRotate = isRotating;
    viewer.background = bgColor;

    viewerRef.current = viewer;

    const handleResize = () => {
      if (viewerRef.current && canvasRef.current) {
        viewerRef.current.width = canvasRef.current.parentElement?.clientWidth || 300;
      }
    };
    window.addEventListener('resize', handleResize);

    return () => {
      viewer.dispose();
      window.removeEventListener('resize', handleResize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); 

  // Watch for State Changes
  useEffect(() => {
    if (!viewerRef.current || !window.skinview3d) return;

    // 1. Update Skin
    const skinSrc = username.includes('/') || username.startsWith('data:') ? username : `https://minotar.net/skin/${username}`;
    viewerRef.current.loadSkin(skinSrc);

    // 2. Update Rotation
    viewerRef.current.autoRotate = isRotating;
    
    // 3. Update Background
    if (bgColor === 'transparent') {
      viewerRef.current.background = null;
    } else {
      viewerRef.current.background = bgColor;
    }

    // 4. Update Pose / Animation
    const pose = POSES.find(p => p.id === selectedPoseId);
    if (pose) {
      // Reset Animation
      viewerRef.current.animation = null;

      // Reset Limbs to 0
      const player = viewerRef.current.playerObject.skin;
      ['head', 'body', 'leftArm', 'rightArm', 'leftLeg', 'rightLeg'].forEach(part => {
        if (player[part]) {
          player[part].rotation.x = 0;
          player[part].rotation.y = 0;
          player[part].rotation.z = 0;
        }
      });

      if (pose.type === 'animation') {
        if (pose.anim === 'walk') viewerRef.current.animation = new window.skinview3d.WalkingAnimation();
        else if (pose.anim === 'run') viewerRef.current.animation = new window.skinview3d.RunningAnimation();
        else if (pose.anim === 'fly') viewerRef.current.animation = new window.skinview3d.FlyingAnimation();
      } else if (pose.type === 'static' && pose.limbs) {
        // Apply static rotations
        Object.entries(pose.limbs).forEach(([part, rot]: [string, any]) => {
          if (player[part]) {
            if (rot.x !== undefined) player[part].rotation.x = rot.x;
            if (rot.y !== undefined) player[part].rotation.y = rot.y;
            if (rot.z !== undefined) player[part].rotation.z = rot.z;
          }
        });
      }
    }

  }, [username, selectedPoseId, isRotating, bgColor]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result && viewerRef.current) {
          // Pass data URI directly to username to trigger update
          setUsername(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDownload = () => {
    if (canvasRef.current) {
      // Create a temporary canvas to draw the WebGL output + Apply CSS filters
      const tempCanvas = document.createElement('canvas');
      const originalCanvas = canvasRef.current;
      tempCanvas.width = originalCanvas.width;
      tempCanvas.height = originalCanvas.height;
      const ctx = tempCanvas.getContext('2d');
      if (ctx) {
        // Fill background if not transparent, otherwise it might be black in some viewers depending on export
        if (bgColor !== 'transparent') {
            ctx.fillStyle = bgColor;
            ctx.fillRect(0,0, tempCanvas.width, tempCanvas.height);
        }
        
        ctx.filter = selectedFilter.value;
        ctx.drawImage(originalCanvas, 0, 0);
        
        const link = document.createElement('a');
        link.download = `mineprev-thumbnail-${selectedPoseId}-${Date.now()}.png`;
        link.href = tempCanvas.toDataURL('image/png');
        link.click();
      }
    }
  };

  return (
    <div className="min-h-screen bg-zinc-900 pt-8 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-white">Thumbnail Yaratish & Tahrirlash</h1>
          <p className="text-gray-400 mt-2">Thumbnail uchun skin tanlang va holatini o'zgartiring</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Controls Panel */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Input Section */}
            <div className="bg-zinc-950 p-6 rounded-xl border border-white/10">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Upload size={18} /> Manba
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Nick orqali qidirish</label>
                  <input 
                    type="text"
                    value={username.startsWith('data:') ? 'Custom File' : username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-mc-green transition-colors"
                    placeholder="Masalan: Notch"
                  />
                </div>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-zinc-800"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-zinc-950 text-gray-500">Yoki fayl yuklang</span>
                  </div>
                </div>

                <label className="flex flex-col items-center px-4 py-6 bg-zinc-900 text-gray-400 rounded-lg border-2 border-dashed border-zinc-700 cursor-pointer hover:border-mc-green hover:text-mc-green transition-colors">
                  <Upload size={24} className="mb-2" />
                  <span className="text-sm">PNG skin faylini tanlang</span>
                  <input type="file" className="hidden" accept=".png" onChange={handleFileUpload} />
                </label>
              </div>
            </div>

            {/* Poses Section */}
            <div className="bg-zinc-950 p-6 rounded-xl border border-white/10">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Accessibility size={18} /> Pozalar
              </h3>
              <div className="relative">
                <select
                  value={selectedPoseId}
                  onChange={(e) => setSelectedPoseId(e.target.value)}
                  className="w-full appearance-none bg-zinc-900 border border-zinc-700 text-white rounded-lg px-4 py-3 pr-8 focus:outline-none focus:border-mc-green transition-colors cursor-pointer"
                >
                  {POSES.map((pose) => (
                    <option key={pose.id} value={pose.id} className="bg-zinc-900">
                      {pose.name}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                  <Layers size={16} />
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Thumbnail uchun 15 dan ortiq maxsus pozalar.
              </p>
            </div>

            {/* Filters Section */}
            <div className="bg-zinc-950 p-6 rounded-xl border border-white/10">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Wand2 size={18} /> Effektlar
              </h3>
              <div className="grid grid-cols-3 gap-2">
                {FILTERS.map((f) => (
                  <button
                    key={f.name}
                    onClick={() => setSelectedFilter(f)}
                    className={`px-2 py-2 rounded-lg text-xs font-medium transition-all border ${
                      selectedFilter.name === f.name
                        ? 'bg-mc-green/20 border-mc-green text-mc-green'
                        : 'bg-zinc-900 border-zinc-800 text-gray-400 hover:border-gray-600'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Background & Rotate */}
            <div className="bg-zinc-950 p-6 rounded-xl border border-white/10">
               <h3 className="text-lg font-semibold text-white mb-4">Fon Sozlamalari</h3>
               <div className="space-y-4">
                 <div className="flex items-center justify-between">
                   <span className="text-gray-400 text-sm">Avto-aylantirish</span>
                   <button 
                    onClick={() => setIsRotating(!isRotating)}
                    className="text-white bg-zinc-800 p-2 rounded hover:bg-zinc-700"
                   >
                     {isRotating ? <Pause size={18} /> : <Play size={18} />}
                   </button>
                 </div>
                 
                 <div>
                    <label className="text-gray-400 text-sm block mb-2">Orqa fon rangi (Chromakey uchun yashil)</label>
                    <div className="flex gap-2">
                      <button onClick={() => setBgColor('#18181b')} className="w-8 h-8 rounded-full bg-zinc-900 border border-gray-600 focus:ring-2 focus:ring-white"></button>
                      <button onClick={() => setBgColor('#4ade80')} className="w-8 h-8 rounded-full bg-green-400 border border-gray-600 focus:ring-2 focus:ring-white"></button>
                      <button onClick={() => setBgColor('#ef4444')} className="w-8 h-8 rounded-full bg-red-500 border border-gray-600 focus:ring-2 focus:ring-white"></button>
                      <button onClick={() => setBgColor('transparent')} className="w-8 h-8 rounded-full bg-white bg-opacity-10 border border-gray-600 focus:ring-2 focus:ring-white flex items-center justify-center text-xs text-white">Tr</button>
                    </div>
                 </div>
               </div>
            </div>

          </div>

          {/* 3D Viewer Canvas */}
          <div className="lg:col-span-2">
            <div className="bg-zinc-950 rounded-2xl border border-white/10 p-2 h-[600px] relative shadow-2xl flex flex-col">
              <div className="absolute top-4 right-4 z-10 bg-black/50 backdrop-blur rounded-lg px-3 py-1 text-xs text-gray-400">
                LMB: Aylantirish | RMB: Surish | Scroll: Zoom
              </div>
              
              <div className="flex-grow w-full h-full rounded-xl overflow-hidden bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')]">
                 <canvas 
                   ref={canvasRef} 
                   className="w-full h-full cursor-move outline-none transition-all duration-300"
                   style={{ filter: selectedFilter.value }}
                 />
              </div>

              <div className="p-4 border-t border-white/5 flex justify-between items-center">
                <div className="text-sm text-gray-500">
                  Render motori: <span className="text-mc-green">Skinview3d</span>
                </div>
                <button 
                  onClick={handleDownload}
                  className="flex items-center gap-2 bg-mc-green hover:bg-mc-greenDark text-black px-6 py-2 rounded-lg font-bold transition-transform active:scale-95"
                >
                  <Download size={18} /> Thumbnail Yuklash
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Editor;