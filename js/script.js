const progressFill = document.getElementById("progressFill");
const progressText = document.getElementById("progressText");

let progress = 0;
const target = 72;

const interval = setInterval(() => {
  if (progress >= target) {
    clearInterval(interval);
    return;
  }

  progress++;
  progressFill.style.width = progress + "%";
  progressText.textContent = progress + "%";
}, 25);

document.addEventListener("mousemove", (event) => {
  const x = (event.clientX / window.innerWidth - 0.5) * 20;
  const y = (event.clientY / window.innerHeight - 0.5) * 20;

  document.querySelector(".hero-card").style.transform =
    `perspective(1000px) rotateY(${x * 0.15}deg) rotateX(${-y * 0.15}deg)`;
});