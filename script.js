const defaultWorks = [
  {
    id: "work-1",
    index: "Case 01",
    title: "Example 1",
    description: "Избранный пример монтажа.",
    videoUrl: "file:///C:/Users/dwayne/Downloads/IMG_5112.MP4",
    placeholderText: "",
    previewImage: "case-1-preview-fit.png",
    previewPosition: "center",
    playOnHover: true
  },
  {
    id: "work-2",
    index: "Case 02",
    title: "Example 2",
    description: "Избранный пример монтажа.",
    videoUrl: "file:///C:/Users/dwayne/Downloads/ramz%20money.mp4",
    placeholderText: "",
    previewImage: "works-preview-fit.png",
    previewPosition: "center",
    playOnHover: true
  },
  {
    id: "work-3",
    index: "Case 03",
    title: "FofanWorld",
    description: "Больше примеров работ ищите у меня в телеграмм канале FofanWorld.",
    videoUrl: "",
    placeholderText: "",
    previewImage: "case-3-preview.png",
    previewPosition: "center",
    playOnHover: false
  }
];

const worksGrid = document.getElementById("worksGrid");
const template = document.getElementById("workCardTemplate");

function setVideoState(videoElement, placeholderElement, videoUrl) {
  if (videoUrl) {
    videoElement.src = videoUrl;
    videoElement.style.display = "block";
    placeholderElement.style.display = "none";
    return;
  }

  videoElement.removeAttribute("src");
  videoElement.load();
  videoElement.style.display = "none";
  placeholderElement.style.display = "grid";
}

function renderWorks() {
  worksGrid.innerHTML = "";

  defaultWorks.forEach((work, cardIndex) => {
    const fragment = template.content.cloneNode(true);
    const card = fragment.querySelector(".work-card");
    const media = fragment.querySelector(".work-card__media");
    const video = fragment.querySelector(".work-card__video");
    const placeholder = fragment.querySelector(".work-card__placeholder");
    const placeholderText = fragment.querySelector(".work-card__placeholder span");
    const index = fragment.querySelector(".work-card__index");
    const title = fragment.querySelector(".work-card__title");
    const description = fragment.querySelector(".work-card__description");

    card.dataset.workId = work.id;
    index.textContent = work.index || `Case ${String(cardIndex + 1).padStart(2, "0")}`;
    title.textContent = work.title;
    description.textContent = work.description;
    placeholderText.textContent = work.placeholderText || "";
    card.classList.toggle("work-card--hover-video", Boolean(work.playOnHover));
    media.style.setProperty("--work-preview-image", `url("${work.previewImage || "works-preview.png"}")`);
    media.style.setProperty("--work-preview-position", work.previewPosition || "center");

    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    video.removeAttribute("controls");

    setVideoState(video, placeholder, work.videoUrl);

    if (work.playOnHover && work.videoUrl) {
      const playVideo = async () => {
        try {
          video.currentTime = 0;
          await video.play();
          media.classList.add("is-playing");
        } catch (error) {
          console.warn("Hover preview play failed", error);
        }
      };

      const stopVideo = () => {
        video.pause();
        video.currentTime = 0;
        media.classList.remove("is-playing");
      };

      media.addEventListener("mouseenter", playVideo);
      media.addEventListener("mouseleave", stopVideo);
      media.addEventListener("focusin", playVideo);
      media.addEventListener("focusout", stopVideo);
    }

    worksGrid.appendChild(fragment);
  });
}

renderWorks();

const aboutCardNav = document.getElementById("aboutCardNav");

if (aboutCardNav) {
  const panels = Array.from(aboutCardNav.querySelectorAll("[data-about-panel]"));

  const setActivePanel = (activePanel) => {
    panels.forEach((panel) => {
      panel.classList.toggle("is-active", panel === activePanel);
    });
  };

  panels.forEach((panel) => {
    panel.addEventListener("mouseenter", () => setActivePanel(panel));
    panel.addEventListener("focus", () => setActivePanel(panel));
    panel.addEventListener("click", () => setActivePanel(panel));
  });
}

const liquidChromeCanvas = document.getElementById("liquidChromeBg");

if (liquidChromeCanvas) {
  const gl =
    liquidChromeCanvas.getContext("webgl", { antialias: true, alpha: true }) ||
    liquidChromeCanvas.getContext("experimental-webgl", { antialias: true, alpha: true });

  if (gl) {
    const vertexShaderSource = `
      attribute vec2 position;
      attribute vec2 uv;
      varying vec2 vUv;

      void main() {
        vUv = uv;
        gl_Position = vec4(position, 0.0, 1.0);
      }
    `;

    const fragmentShaderSource = `
      precision highp float;

      uniform float uTime;
      uniform vec3 uResolution;
      uniform vec3 uBaseColor;
      uniform float uAmplitude;
      uniform float uFrequencyX;
      uniform float uFrequencyY;
      uniform vec2 uMouse;
      varying vec2 vUv;

      vec4 renderImage(vec2 uvCoord) {
        vec2 fragCoord = uvCoord * uResolution.xy;
        vec2 uv = (2.0 * fragCoord - uResolution.xy) / min(uResolution.x, uResolution.y);

        for (float i = 1.0; i < 10.0; i++) {
          uv.x += uAmplitude / i * cos(i * uFrequencyX * uv.y + uTime + uMouse.x * 3.14159);
          uv.y += uAmplitude / i * cos(i * uFrequencyY * uv.x + uTime + uMouse.y * 3.14159);
        }

        vec2 diff = uvCoord - uMouse;
        float dist = length(diff);
        float falloff = exp(-dist * 20.0);
        float ripple = sin(10.0 * dist - uTime * 2.0) * 0.03;
        uv += (diff / (dist + 0.0001)) * ripple * falloff;

        vec3 color = uBaseColor / abs(sin(uTime - uv.y - uv.x));
        color = clamp(color, 0.0, 1.0);
        return vec4(color, 1.0);
      }

      void main() {
        gl_FragColor = renderImage(vUv);
      }
    `;

    const compileShader = (type, source) => {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);

      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.warn(gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }

      return shader;
    };

    const vertexShader = compileShader(gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = compileShader(gl.FRAGMENT_SHADER, fragmentShaderSource);

    if (vertexShader && fragmentShader) {
      const program = gl.createProgram();
      gl.attachShader(program, vertexShader);
      gl.attachShader(program, fragmentShader);
      gl.linkProgram(program);

      if (gl.getProgramParameter(program, gl.LINK_STATUS)) {
        gl.useProgram(program);

        const vertices = new Float32Array([
          -1, -1, 0, 0,
          1, -1, 1, 0,
          -1, 1, 0, 1,
          1, 1, 1, 1
        ]);

        const buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

        const positionLocation = gl.getAttribLocation(program, "position");
        const uvLocation = gl.getAttribLocation(program, "uv");

        gl.enableVertexAttribArray(positionLocation);
        gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 16, 0);
        gl.enableVertexAttribArray(uvLocation);
        gl.vertexAttribPointer(uvLocation, 2, gl.FLOAT, false, 16, 8);

        const uniforms = {
          time: gl.getUniformLocation(program, "uTime"),
          resolution: gl.getUniformLocation(program, "uResolution"),
          baseColor: gl.getUniformLocation(program, "uBaseColor"),
          amplitude: gl.getUniformLocation(program, "uAmplitude"),
          frequencyX: gl.getUniformLocation(program, "uFrequencyX"),
          frequencyY: gl.getUniformLocation(program, "uFrequencyY"),
          mouse: gl.getUniformLocation(program, "uMouse")
        };

        const mouse = { x: 0.5, y: 0.5 };

        gl.uniform3f(uniforms.baseColor, 0.0627451, 0.0117647, 0.0117647);
        gl.uniform1f(uniforms.amplitude, 0.3);
        gl.uniform1f(uniforms.frequencyX, 3.0);
        gl.uniform1f(uniforms.frequencyY, 2.6);

        const resize = () => {
          const dpr = Math.min(window.devicePixelRatio || 1, 2);
          const width = Math.floor(window.innerWidth * dpr);
          const height = Math.floor(window.innerHeight * dpr);

          liquidChromeCanvas.width = width;
          liquidChromeCanvas.height = height;
          gl.viewport(0, 0, width, height);
          gl.uniform3f(uniforms.resolution, width, height, width / height);
        };

        const updateMouse = (clientX, clientY) => {
          mouse.x = clientX / window.innerWidth;
          mouse.y = 1 - clientY / window.innerHeight;
        };

        const handleMouseMove = (event) => updateMouse(event.clientX, event.clientY);
        const handleTouchMove = (event) => {
          if (event.touches.length > 0) {
            updateMouse(event.touches[0].clientX, event.touches[0].clientY);
          }
        };

        const render = (time) => {
          gl.uniform1f(uniforms.time, time * 0.0003);
          gl.uniform2f(uniforms.mouse, mouse.x, mouse.y);
          gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
          window.requestAnimationFrame(render);
        };

        window.addEventListener("resize", resize);
        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("touchmove", handleTouchMove, { passive: true });

        resize();
        render(0);
      }
    }
  }
}
