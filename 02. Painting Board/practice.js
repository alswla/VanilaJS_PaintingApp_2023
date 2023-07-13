const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
canvas.width = 800;
canvas.height = 800;

ctx.lineWidth = 2;

const colors = [
  "#ff3838",
  "#ffb8b8",
  "#c56cf0",
  "#ff9f1a",
  "#fff200",
  "#32ff7e",
  "#7efff5",
];

let isDrawing = false;
let startX = 0;
let startY = 0;

function onClick(event) {
  if (!isDrawing) {
    // 그리기가 시작되지 않은 상태이면 시작 지점을 설정합니다.
    startX = event.offsetX;
    startY = event.offsetY;
    isDrawing = true;
  } else {
    // 그리기가 이미 시작된 상태이면 이전 클릭 지점에서 현재 클릭 지점까지 선을 그립니다.
    ctx.beginPath();
    const color = colors[Math.floor(Math.random() * colors.length)];
    ctx.strokeStyle = color;
    ctx.moveTo(startX, startY);
    ctx.lineTo(event.offsetX, event.offsetY);
    ctx.stroke();

    // 시작 지점을 현재 클릭 지점으로 업데이트합니다.
    startX = event.offsetX;
    startY = event.offsetY;
  }
}

canvas.addEventListener("click", onClick);
