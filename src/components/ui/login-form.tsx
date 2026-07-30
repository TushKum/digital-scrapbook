import { useEffect, useRef, useState } from 'react';
import type { PointerEvent as ReactPointerEvent } from 'react';
import { ArrowRight, Lock, User } from 'lucide-react';

// ── WebGL smokey shader ──────────────────────────────────────────────────────
const vertexSmokeySource = `
  attribute vec4 a_position;
  void main() {
    gl_Position = a_position;
  }
`;

const fragmentSmokeySource = `
precision mediump float;

uniform vec2 iResolution;
uniform float iTime;
uniform vec2 iMouse;
uniform vec3 u_color;

void mainImage(out vec4 fragColor, in vec2 fragCoord){
    vec2 centeredUV = (2.0 * fragCoord - iResolution.xy) / min(iResolution.x, iResolution.y);
    float time = iTime * 0.5;

    vec2 mouse = iMouse / iResolution;
    vec2 rippleCenter = 2.0 * mouse - 1.0;

    vec2 distortion = centeredUV;
    for (float i = 1.0; i < 8.0; i++) {
        distortion.x += 0.5 / i * cos(i * 2.0 * distortion.y + time + rippleCenter.x * 3.1415);
        distortion.y += 0.5 / i * cos(i * 2.0 * distortion.x + time + rippleCenter.y * 3.1415);
    }

    float wave = abs(sin(distortion.x + distortion.y + time));
    float glow = smoothstep(0.9, 0.2, wave);

    fragColor = vec4(u_color * glow, 1.0);
}

void main() {
    mainImage(gl_FragColor, gl_FragCoord.xy);
}
`;

type BlurSize = 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';

interface SmokeyBackgroundProps {
  backdropBlurAmount?: string;
  color?: string;
  className?: string;
}

const blurClassMap: Record<BlurSize, string> = {
  none: 'backdrop-blur-none',
  sm: 'backdrop-blur-sm',
  md: 'backdrop-blur-md',
  lg: 'backdrop-blur-lg',
  xl: 'backdrop-blur-xl',
  '2xl': 'backdrop-blur-2xl',
  '3xl': 'backdrop-blur-3xl',
};

const hexToRgb = (hex: string): [number, number, number] => [
  parseInt(hex.substring(1, 3), 16) / 255,
  parseInt(hex.substring(3, 5), 16) / 255,
  parseInt(hex.substring(5, 7), 16) / 255,
];

/**
 * Interactive WebGL smokey shader background. The pointer position drives the
 * ripple centre, so the smoke follows the cursor across the whole screen.
 *
 * Note (vs. the original): the GL program is created ONCE. Mouse state lives in
 * a ref that the render loop reads, so moving the cursor no longer tears down
 * and rebuilds the entire WebGL context every frame.
 */
export function SmokeyBackground({
  backdropBlurAmount = 'sm',
  color = '#1E40AF',
  className = '',
}: SmokeyBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointer = useRef({ x: 0, y: 0, active: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl');
    if (!gl) {
      console.error('WebGL not supported');
      return;
    }

    const compile = (type: number, source: string): WebGLShader | null => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('Shader compilation error:', gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vertexShader = compile(gl.VERTEX_SHADER, vertexSmokeySource);
    const fragmentShader = compile(gl.FRAGMENT_SHADER, fragmentSmokeySource);
    if (!vertexShader || !fragmentShader) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Program linking error:', gl.getProgramInfoLog(program));
      return;
    }
    gl.useProgram(program);

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);

    const positionLocation = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    const iResolutionLocation = gl.getUniformLocation(program, 'iResolution');
    const iTimeLocation = gl.getUniformLocation(program, 'iTime');
    const iMouseLocation = gl.getUniformLocation(program, 'iMouse');
    const uColorLocation = gl.getUniformLocation(program, 'u_color');

    const [r, g, b] = hexToRgb(color);
    gl.uniform3f(uColorLocation, r, g, b);

    const start = Date.now();
    let raf = 0;

    const render = () => {
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }
      gl.viewport(0, 0, width, height);

      gl.uniform2f(iResolutionLocation, width, height);
      gl.uniform1f(iTimeLocation, (Date.now() - start) / 1000);
      const mx = pointer.current.active ? pointer.current.x : width / 2;
      const my = pointer.current.active ? height - pointer.current.y : height / 2;
      gl.uniform2f(iMouseLocation, mx, my);

      gl.drawArrays(gl.TRIANGLES, 0, 6);
      raf = requestAnimationFrame(render);
    };

    // Track the pointer globally so the smoke reacts even over the glass card.
    const onMove = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.current.x = event.clientX - rect.left;
      pointer.current.y = event.clientY - rect.top;
      pointer.current.active = true;
    };
    const onLeave = () => {
      pointer.current.active = false;
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseout', onLeave);
    render();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseout', onLeave);
      gl.deleteProgram(program);
    };
  }, [color]);

  const finalBlurClass = blurClassMap[backdropBlurAmount as BlurSize] || blurClassMap.sm;

  return (
    <div className={`absolute inset-0 h-full w-full overflow-hidden ${className}`}>
      <canvas ref={canvasRef} className="h-full w-full" />
      <div className={`pointer-events-none absolute inset-0 ${finalBlurClass}`} />
    </div>
  );
}

/**
 * Apple-style "liquid glass" login card: translucent, saturated backdrop blur,
 * a bright specular rim, a cursor-tracked highlight, and a subtle 3D tilt that
 * follows the pointer. Animated floating labels + Google sign-in.
 */
export function LoginForm() {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0, mx: 50, my: 30 });

  const handleMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    setTilt({ ry: (px - 0.5) * 12, rx: -(py - 0.5) * 12, mx: px * 100, my: py * 100 });
  };
  const handleLeave = () => setTilt({ rx: 0, ry: 0, mx: 50, my: 30 });

  return (
    <div style={{ perspective: 1100 }}>
      <div
        ref={cardRef}
        onPointerMove={handleMove}
        onPointerLeave={handleLeave}
        style={{
          transform: `rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
          transition: 'transform 200ms ease-out',
          transformStyle: 'preserve-3d',
        }}
        className="relative w-full max-w-sm overflow-hidden rounded-[1.75rem] border border-white/20 bg-gradient-to-br from-white/20 via-white/5 to-white/10 p-8 shadow-[0_24px_70px_-20px_rgba(0,0,0,0.65)] ring-1 ring-inset ring-white/20 backdrop-blur-2xl backdrop-saturate-150"
      >
        {/* cursor-tracked specular highlight */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: `radial-gradient(240px circle at ${tilt.mx}% ${tilt.my}%, rgba(255,255,255,0.20), transparent 60%)` }}
        />
        {/* bright top edge (liquid-glass rim) */}
        <div className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white/70 to-transparent" />

        <div className="relative" style={{ transform: 'translateZ(40px)' }}>
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white drop-shadow">Welcome Back</h2>
            <p className="mt-2 text-sm text-gray-300">Sign in to continue</p>
          </div>

          <form className="mt-8 space-y-8">
            {/* Email */}
            <div className="relative z-0">
              <input
                type="email"
                id="floating_email"
                className="peer block w-full appearance-none border-0 border-b-2 border-white/30 bg-transparent px-0 py-2.5 text-sm text-white focus:border-blue-400 focus:outline-none focus:ring-0"
                placeholder=" "
                required
              />
              <label
                htmlFor="floating_email"
                className="absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-300 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-blue-300"
              >
                <User className="-mt-1 mr-2 inline-block" size={16} />
                Email Address
              </label>
            </div>

            {/* Password */}
            <div className="relative z-0">
              <input
                type="password"
                id="floating_password"
                className="peer block w-full appearance-none border-0 border-b-2 border-white/30 bg-transparent px-0 py-2.5 text-sm text-white focus:border-blue-400 focus:outline-none focus:ring-0"
                placeholder=" "
                required
              />
              <label
                htmlFor="floating_password"
                className="absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-300 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-blue-300"
              >
                <Lock className="-mt-1 mr-2 inline-block" size={16} />
                Password
              </label>
            </div>

            <div className="flex items-center justify-between">
              <a href="#" className="text-xs text-gray-300 transition hover:text-white">Forgot Password?</a>
            </div>

            <button
              type="submit"
              className="group flex w-full items-center justify-center rounded-xl bg-blue-600/90 px-4 py-3 font-semibold text-white shadow-lg shadow-blue-900/40 ring-1 ring-inset ring-white/20 transition-all duration-300 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-transparent"
            >
              Sign In
              <ArrowRight className="ml-2 h-5 w-5 transform transition-transform group-hover:translate-x-1" />
            </button>

            <div className="relative flex items-center py-2">
              <div className="flex-grow border-t border-white/25" />
              <span className="mx-4 flex-shrink text-xs text-gray-300">OR CONTINUE WITH</span>
              <div className="flex-grow border-t border-white/25" />
            </div>

            <button
              type="button"
              className="flex w-full items-center justify-center rounded-xl bg-white/85 px-4 py-2.5 font-semibold text-gray-700 ring-1 ring-inset ring-white/40 backdrop-blur transition-all duration-300 hover:bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-transparent"
            >
              <svg className="mr-2 h-5 w-5" viewBox="0 0 48 48" aria-hidden="true">
                <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039L38.802 8.841C34.553 4.806 29.613 2.5 24 2.5C11.983 2.5 2.5 11.983 2.5 24s9.483 21.5 21.5 21.5S45.5 36.017 45.5 24c0-1.538-.135-3.022-.389-4.417z" />
                <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12.5 24 12.5c3.059 0 5.842 1.154 7.961 3.039l5.839-5.841C34.553 4.806 29.613 2.5 24 2.5C16.318 2.5 9.642 6.723 6.306 14.691z" />
                <path fill="#4CAF50" d="M24 45.5c5.613 0 10.553-2.306 14.802-6.341l-5.839-5.841C30.842 35.846 27.059 38 24 38c-5.039 0-9.345-2.608-11.124-6.481l-6.571 4.819C9.642 41.277 16.318 45.5 24 45.5z" />
                <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l5.839 5.841C44.196 35.123 45.5 29.837 45.5 24c0-1.538-.135-3.022-.389-4.417z" />
              </svg>
              Sign in with Google
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-gray-300">
            Don&apos;t have an account?{' '}
            <a href="#" className="font-semibold text-blue-300 transition hover:text-blue-200">Sign Up</a>
          </p>
        </div>
      </div>
    </div>
  );
}
