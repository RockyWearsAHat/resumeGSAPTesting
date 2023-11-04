const canvas = document.querySelector(".canvas");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const ctx = canvas.getContext("2d");

const frameCount = 202;

const currentFrame = (index) => {
  const indexString = (index + 1).toString().padStart(4, "0");
  return `./LandscapeRender/${indexString.toString()}.png`;
};
const images = [];

let landscape = { frame: 0 };

for (let i = 0; i < frameCount; i++) {
  const img = new Image();
  img.src = currentFrame(i);
  images.push(img);
}

//images.forEach((img) => console.log(img));
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

//console.log(landscape);

function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(images[landscape.frame], 0, 0, canvas.width, canvas.height);
}

function finishLoad() {
  loading = false;
  animateCloseLoading();
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
  const loadingText = document.querySelector("#loadingText");
  const loadingSubtext = document.querySelector("#loadingSubtext");

  loadingText.textContent = "Complete.";
  loadingSubtext.textContent = "Sorry.";

  setTimeout(() => {
    const loadingWrapper = document.querySelector("#loadingWrap");

    loadingWrapper.style.display = "none";
  }, 3000);
}
