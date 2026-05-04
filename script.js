gsap.registerPlugin(ScrollTrigger);

const lenis = new Lenis({
  smoothWheel: true,
  lerp: 0.08,
});
function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

const cursor = document.querySelector('.cursor');
window.addEventListener('mousemove', (e) => {
  cursor.style.left = `${e.clientX}px`;
  cursor.style.top = `${e.clientY}px`;
});

const prefersReduced = window.matchMedia('(max-width: 768px)').matches;
document.querySelectorAll('.parallax').forEach((el) => {
  const speed = Number(el.dataset.speed || 0.2);
  gsap.to(el, {
    y: prefersReduced ? 0 : () => -window.innerHeight * speed,
    ease: 'none',
    scrollTrigger: { trigger: el.closest('.panel') || el, scrub: true },
  });
});

gsap.utils.toArray('.reveal').forEach((el) => {
  gsap.to(el, {
    opacity: 1,
    y: 0,
    scale: 1,
    duration: 1,
    ease: 'power3.out',
    scrollTrigger: { trigger: el, start: 'top 82%' },
  });
});

document.querySelectorAll('.tilt').forEach((card) => {
  card.addEventListener('mousemove', (e) => {
    const r = card.getBoundingClientRect();
    const rx = ((e.clientY - r.top) / r.height - 0.5) * -14;
    const ry = ((e.clientX - r.left) / r.width - 0.5) * 14;
    card.style.transform = `perspective(700px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(12px)`;
  });
  card.addEventListener('mouseleave', () => (card.style.transform = ''));
});

function createConeScene(canvas) {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
  camera.position.set(0, 0.3, 3.2);
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);

  const light = new THREE.DirectionalLight(0xffffff, 1.2);
  light.position.set(2, 2, 2);
  scene.add(light, new THREE.AmbientLight(0xaa99ff, 0.5));

  const cone = new THREE.Mesh(
    new THREE.ConeGeometry(0.6, 1.4, 48),
    new THREE.MeshStandardMaterial({ color: 0xd49b61, roughness: 0.7 })
  );
  cone.position.y = -0.7;
  scene.add(cone);

  const scoopColors = [0xff7ecf, 0x86d8ff, 0xfff0c6];
  scoopColors.forEach((c, i) => {
    const s = new THREE.Mesh(new THREE.SphereGeometry(0.45, 48, 48), new THREE.MeshStandardMaterial({ color: c, metalness: .15, roughness: .35 }));
    s.position.set((i - 1) * 0.28, 0.1 + i * 0.18, 0);
    scene.add(s);
  });

  let mx = 0;
  window.addEventListener('mousemove', (e) => (mx = (e.clientX / window.innerWidth - 0.5) * 0.6));

  function animate() {
    cone.rotation.y += 0.01;
    scene.rotation.y += (mx - scene.rotation.y) * 0.03;
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }
  animate();
}

const heroCanvas = document.getElementById('heroCone');
if (heroCanvas) createConeScene(heroCanvas);
document.querySelectorAll('.mini3d').forEach((canvas) => createConeScene(canvas));
