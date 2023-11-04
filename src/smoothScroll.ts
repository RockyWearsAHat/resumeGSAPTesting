import Lenis from "@studio-freight/lenis";

const lenis = new Lenis();

// lenis.on("scroll", (e: Event) => {
//   console.log(e);
// });

const raf = (time: number) => {
  lenis.raf(time);
  requestAnimationFrame(raf);
};

requestAnimationFrame(raf);
