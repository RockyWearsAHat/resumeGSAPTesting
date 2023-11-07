const canvas = document.querySelector(".canvas");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const ctx = canvas.getContext("2d");

const frameCount = 321;

let initialScroll = false;

const currentFrame = (index) => {
  const indexString = (index + 1).toString().padStart(4, "0");
  return `/LandscapeRender/${indexString.toString()}.png`;
};

let loadedImages = 0;
const calculateLoadingPercentage = (frameThatLoaded) => {
  loadedImages++;
  let percent = loadedImages / (frameCount + 10);
  if (frameThatLoaded == frameCount - 1) percent = 100;
  sessionStorage.setItem("load", percent);
  document
    .querySelector(".root")
    .scrollTo({ top: 0, left: 0, behavior: "smooth" });
};

const images = [];

let landscape = { frame: 0 };

for (let i = 0; i < frameCount; i++) {
  const img = new Image();
  // img.setTransform(scale, 0, 0, scale, pos.x, pos.y);
  img.style.maxWidth = 1920;
  img.style.maxHeight = 1080;
  img.src = currentFrame(i);
  img.addEventListener("load", () => calculateLoadingPercentage(i));
  images.push(img);
}
let loading = true;
images[0].onload = render;

images[frameCount - 1].addEventListener("load", () => {
  finishLoad();
  gsap.to(landscape, {
    frame: frameCount - 1,
    snap: "frame",
    ease: "none",
    scrollTrigger: {
      scrub: 1,
      pin: "canvas",
      start: "top top",
      end: "300%",
    },
    onUpdate: render,
  });
});

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  render();
});

//console.log(landscape);

function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  let hRatio = canvas.width / images[landscape.frame].width;
  let vRatio = canvas.height / images[landscape.frame].height;
  ctx.drawImage(images[landscape.frame], 0, 0, canvas.width, canvas.height);
}

function finishLoad() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  sessionStorage.setItem("load", 100);
  loading = false;
  animateCloseLoading();
}

let timeNotScrolled = 0;
let timeBeforeScrollDownDisplay = 5;
function timeoutBeforeDisplayScrollDownText() {
  if (initialScroll == true) {
    return;
  }
  if (timeNotScrolled == 5) {
    gsap.to("#scrollDownTextWrapper", {
      bottom: 200,
      opacity: 1,
      duration: 1,
      ease: "power3.out",
    });
    animateScrollDownArrow();
  }

  if (timeNotScrolled < timeBeforeScrollDownDisplay) {
    setTimeout(() => {
      timeNotScrolled++;
      //console.log(timeNotScrolled);
      timeoutBeforeDisplayScrollDownText();
    }, 1000);
  }
}

function animateLoadingText() {
  const loadingText = document.querySelector("#loadingText");

  const state = loadingText.dataset.state;

  switch (state) {
    case ".":
      loadingText.textContent = "Loading..";
      loadingText.dataset.state = "..";
      break;
    case "..":
      loadingText.textContent = "Loading...";
      loadingText.dataset.state = "...";
      break;
    case "...":
      loadingText.textContent = "Loading.";
      loadingText.dataset.state = ".";
      break;
  }

  setTimeout(() => {
    if (loading) {
      animateLoadingText();
    }
  }, 700);
}
animateLoadingText();

function animateCloseLoading() {
  document
    .querySelector(".root")
    .scrollTo({ top: 0, left: 0, behavior: "smooth" });
  const loadingText = document.querySelector("#loadingText");
  const loadingSubtext = document.querySelector("#loadingSubtext");

  loadingText.textContent = "Done.";
  loadingSubtext.textContent = "Finally.";

  setTimeout(() => {
    const loadingWrapper = document.querySelector("#loadingWrap");

    const tl = gsap.timeline();
    tl.to(loadingWrapper, { y: "-100%", duration: 1 });
    tl.to(loadingWrapper, { opacity: 0, duration: 0.5, delay: -0.5 });

    timeoutBeforeDisplayScrollDownText();
    document.addEventListener("scroll", () => {
      gsap.to("#scrollDownTextWrapper", {
        bottom: 250,
        opacity: 0,
        duration: 1,
        delay: 0.2,
        ease: "power3.out",
      });

      if (initialScroll == false) initialScroll = true;
    });
  }, 5000);
}

function animateScrollDownArrow() {
  gsap.to("#scrollDownArrow", {
    bottom: -40,
    repeat: -1,
    yoyo: true,
    yoyoEase: "power3.out",
    duration: 0.3,
  });
}
