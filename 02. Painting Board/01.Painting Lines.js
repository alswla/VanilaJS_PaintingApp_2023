const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
canvas.width = 800;
canvas.height = 800;
/*
이번 영상에서는 우리가 만들 그림판의 프로토타입 만들어볼 것!
그리고 나중에 조금씩 더 개선시킬 것!

목표를 먼저 정해볼 건데, 우리의 첫번째 목표는
보드를 클릭할 떄마다 선을 그리는 것!
*/
ctx.lineWidth = 2;
/* lineWidth는 계속 똑같이 쓰일 것이므로 함수 밖에서 정의! */
/* ctx.moveTo(0, 0);
잠깐 moveTo를 함수 안으로 옮겨보기! */
const colors = [
  "#ff3838",
  "#ffb8b8",
  "#c56cf0",
  "#ff9f1a",
  "#fff200",
  "#32ff7e",
  "#7efff5",
];
/* 색상 배열을 만들어서 새로운 선을 그릴때마다 색상을 다르게 줘보기!
색상출처: https://flatuicolors.com/palette/tr 그냥 복사붙여넣기 하면됨 */

function onClick(event) {
  /*   
console.log(event);
우리가 클릭이라는 event가 발생했을 때, 위치를 얻을 수 있는지 object확인하기 위해 console.log!해보기  
=> offsetX, offsetY!
*/
  ctx.beginPath();
  //   ctx.moveTo(newX, newY);
  //   ctx.moveTo(0, 0);
  const color = colors[Math.floor(Math.random() * colors.length)];
  ctx.strokeStyle = color;
  /* 
  여기까지 잘 되지만 문제는 strokeStyle의 선 컬러가 바뀔 때 모든 선에 적용되어 바뀌는 것!
  ==> 모든게 같은 path에서 그려지기 때문임
  그러면 mousemove event발생할때마다 실행되는 함수의 첫번째에 beginPath넣으면됨!
  실행되는 mousemove마다 그려지는 선이 다 다른 path에 그려질 것!
  */
  ctx.moveTo(event.offsetX, event.offsetY);
  //   ctx.lineTo(event.offsetX, event.offsetY);
  //   ctx.stroke();

  /* 여기까지 하면 불편하긴 하지만 작동함! 하지만 문제는 처음 클릭했을 때는 선이 그려지지 않는다는 것!
  ==> 우리가 처음 어디서 움직일지 설정 안해줬기 때문임! 따라서 moveTo를 함수 밖에 추가하기! 
  ==> 함수 밖에 추가하는 이유는 default값으로 설정하는 것이기 때문임 */
  function onMove(move) {
    /* 
    const color = colors[Math.floor(Math.random() * colors.length)];
    ctx.strokeStyle = color; 
    마우스를 움직여서 선을 그릴때 색을 주지 않은 이유는 이렇게 여기다가 주면, 
    마우스가 움직이는 순간순간 마다 색이 변하기 때문임.

    그렇다고 앞에다가 beginPath를 쓰면, moveTo가 없어지므로 아무것도 그려지지 않음!
    */
    ctx.lineTo(move.offsetX, move.offsetY);
    ctx.stroke();
    // ctx.beginPath();
  }
  canvas.addEventListener("mousemove", onMove);
}

canvas.addEventListener("click", onClick);

// canvas.addEventListener("click", onClick);
/* 
  클릭하면 선을 그리는 것을 하기 위해서는! click이 당연히 event인 것을 기억해야함!
  그러면 필요한건? addEventListner! 어디에 필요하냐면 당연히 캔버스를 클릭할때 일어나므로
  canvas.addEventListner! 
  선이 그어지는 것 등 모든 기능은 canvas.addEventListener 위에 만들어져야함!
  왜냐하면, 미리 함수가 있어야지 클릭이라는 이벤트가 가장 마지막에 발생해서
  필요한 정보들이 미리 레이어에 생겨있던 함수들에 데이터만 입력되어 나타나도록!
*/
/* 
하지만 클릭이 아니라 이제는 마우스 움직임으로 변경해볼 것!
click event => mousemove
*/
