const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const lineWidth = document.getElementById("line-width");
const color = document.getElementById("color");
// const colorOptions = document.getElementsByClassName("color-option");
const colorOptions = Array.from(
  document.getElementsByClassName("color-option")
);
const modeBtn = document.getElementById("mode-btn");
const resetBtn = document.getElementById("reset-btn");
const eraseBtn = document.getElementById("eraser-btn");

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 800;

// canvas.width = 800;
// canvas.height = 800;
canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;
// ctx.lineWidth = 2;
ctx.lineWidth = lineWidth.value;
/* 여기에 이렇게 LineWidth값을 input값으로 넣어준다고 해서
매번 값을 변경할때마다 자동으로 변경되는 것 아님! 현재 값으로 딱 한번만 실행됨
따라서 변경에 따라 적용될 수 있도록 event listener와 함수 만들어줘야함 */

/* 
이전까지는 마우스가 움직일 때마다 그리고 있었는데, 이번에는 마우스를 클릭한 채로 움직일때 그리도록 만들어볼 것!
첫째로 moveTo의 중요성에 대해 다시 생각해봐야함
*/
/* 
ctx.moveTo(200, 200);
ctx.lineTo(400, 400);
ctx.stroke();
=> 이렇게 하면 알아서 200,200에서 400,400으로 선을 그어줌 
   즉, moveTo는 우리가 선을 긋지 않으면서 브러쉬를 움직이게 해줌
   그냥 브러쉬를 옮기는 것이므로 우리가 처음에 해야할게 됨.
=> 유저가 canvas에서 마우스를 움직일 때마다 moveTo를 호출할 것
   왜냐하면, 유저는 아직 클릭을 하지 않았고 유저가 움직일 때 연필을 움직여주어야 하기 때문임
   그리고 클릭을 함과 동시에 라인을 그어줘야하므로!
*/
let isPainting = false;
let isFilling = false;

function onModeClick() {
  if (isFilling) {
    isFilling = false;
    modeBtn.innerText = "Fill";
  } else {
    isFilling = true;
    modeBtn.innerText = "Draw";
  }
}

function onColorClick(event) {
  const colorValue = event.target.dataset.color;
  //   ctx.strokeStyle = event.target.dataset.color;
  //   ctx.fillStyle = event.target.dataset.color;
  //   color.value = event.target.dataset.color;
  ctx.strokeStyle = colorValue;
  ctx.fillStyle = colorValue;
  color.value = colorValue;
  /* 
    console.dir(event.target);
    console.dir(event.target.dataset.color);
  
    우리는 각 div에 event listner를 추가했으므로 
    누군가 해당 color div를 클릭하면 이 함수를 실행할 것!
    그렇다면 어떤 색상이 클릭됐는지를 알아야함! 왜냐하면 모두 같은 함수를 호출하고 있기 때문임! (함수에서 알려줘야함)
    ==> 이때 사용할 것이 data- 속성!
        console.dir(event.target); 해주면 해당 객체의 object가 뜨는데 그 안에 dataset이라는 property를 볼 수 있고
        우리가 세팅한 color값을 확인할 수 있음
        dataset안에 color라는 property가 우리가 설정한 이름임! (변경도 가능)
  
      ==> 그러면 이제 event.target을 출력하는게 아니라, event.target.dataset.color를 출력해보면?
          : 해당 컬러값을 잘 가져오는 걸 볼 수 있음!
    
    이제 내가 하고 싶은 것은 당연히 ctx의 strokeStyle과 fillStyle을 변경해주는 것!
    ==> 아까 colorChange의 함수의 내용을 그대로 가져올건데, 
        값을 event.target.value에서 event.target.dataset.color로만 변경!
  
    여기까지 내가 선택한 div의 컬러값이 정확히 적용되는 것 알 수 있음!
    하지만 여기에서 추가로 사용자에게 해당 클릭(색상변경)이 적용되었다는걸 알려주고싶음!
    ==> 즉, 색상 div를 선택하면 해당 색상으로 color input의 box색상이 변경되도록!
        간단함! color.value를 event.target.dataset.color로 변경해주면됨!
        이때 event.target.dataset.color가 2번 이상 쓰이므로 colorValue라는 변수로 써서 깔끔하게 정리해주기!
    */
}

function onColorChange(event) {
  /* console.log(event.target.value);
    => 이렇게 하면 우리가 선택한 컬러값이 나오는 걸 알 수 있음! */
  ctx.strokeStyle = event.target.value;
  ctx.fillStyle = event.target.value;
  /* 
    이제 우리는 fillStyle와 strokeStyle를 사용할건데 매우 중요함! 
    fillStyle는 예를 들어 우리가 사각형을 만들면 그 안을 채워주는 색상! 
    strokeStyle은 line 즉, 선에 쓰임!
  
    다음에는 사용자가 전체 캔버스를 한 색상으로 채울 수 있도록 할 것임!
    이때 사용할게 fillStyle!
  
    어쨌든, fillStroke를 먼저 써볼건데, 이걸 쓰기 전에
    ctx.strokeStyle = event.target.value; 을 먼저 입력해서 스타일에 컬러를 줄 것!
    */
}

// 선 굵기 변경해주는 함수
function onLineWidthChange(event) {
  /* 그리고 항상 event에 접근할 수 있다는 사실이 중요함!
    ==> 이때 event는 mousemove랑은 다른 event이므로 매개변수를 event로 줘도됨 */
  ctx.lineWidth = event.target.value;
  /* 
    console.log(event);
    콘솔 로그 하면, 내가 범위를 변경할때마다(움직일때마다) 콘솔에 출력되는데, 
    target property가 있으므로 해당 event의 target value를 가져오는 것!
    ==> console.log(event.target.value);
        이렇게 하면 내가 변경한 값이 출력되는 것을 알 수 있음 (eg. 3,4,5 등)
        그러면 이제 이걸 lineWidth 값에 넣어주기만 하면 끝!
  
    하지만! 이때 문제가 하나 있음.
    내가 선의 굵기를 변경할 때마다 이전에 그렸던 선들의 굵기가 다 바뀜 
    ==> 이유는 바로 모두 하나의 레이어 안에서 그려지고 있기 때문임!
        따라서, 레이어를 변경해주기 위해서는 beginPath()넣어줘야 하는데,
        이는 line을 그려줬던 함수인 onMove 안에서 변경해주면됨!
        
        ==> 왜 if조건문이 아닌 else 조건문 moveTo 위에 해주는거냐면, 
            선이 그어지기 전에 beginPath를 하게되면 moveTo로 브러쉬가 옮겨진 후에
            beginPath가 되므로 새로운 레이어인데 브러쉬 위치가 없으므로 그려지지 못함!
  
            그러므로 선을 그린후에 새롭게 브러쉬가 움직이기 전에 새로운 레이어를 만들어서 
            새로운 브러쉬 위치를 줘야함!
            
            혹은 moveTo함수 말고, cancelPainting의 isPainting에 넣어줘서
            false로 인식하게 한 후에 beginPath를 시작하도록 해줄 수도 있음
            function cancelPainting() {
              isPainting = false;
              ctx.beginPath();
            }
    */
}

// let isPainting = false;
// 변수 위로 몰기 위해서 해당 코드 위로 이동
function onMove(event) {
  if (isPainting) {
    ctx.lineTo(event.offsetX, event.offsetY);
    ctx.stroke();
    return;
  }
  //   ctx.beginPath();
  ctx.moveTo(event.offsetX, event.offsetY);
}
function onMouseDown() {
  isPainting = true;
}
function cancelPainting() {
  isPainting = false;
  ctx.beginPath();
}

function onCanvasClick() {
  if (isFilling) {
    // ctx.fillRect(0, 0, 800, 800);
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  }
}

function onResetClick() {
  ctx.fillStyle = "white";
  // ctx.fillRect(0, 0, 800, 800);
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
}

function onEraserClick() {
  ctx.strokeStyle = "white";
  isFilling = false;
  modeBtn.innerText = "Fill";
}

canvas.addEventListener("mousemove", onMove);
canvas.addEventListener("mousedown", onMouseDown);
canvas.addEventListener("mouseup", cancelPainting);

// document.addEventListener("mouseup", onMouseUp);
canvas.addEventListener("mouseleave", cancelPainting);
lineWidth.addEventListener("change", onLineWidthChange);
color.addEventListener("change", onColorChange);

canvas.addEventListener("click", onCanvasClick);
// console.log(colorOptions);
colorOptions.forEach((color) => color.addEventListener("click", onColorClick));
/* 
colorOptions라는 array의 각 Item들에 대해 함수를 실행할건데,
각 item들이 argument로 함수가 실행되고 이를 color라는 parameter로 받을 것임
즉, item들마다 color라는 Parameter로 받아 각각 addEventlistner를 실행하고
해당 event listner는 click event를 받고 onColorClick 함수 실행할 것 
*/
modeBtn.addEventListener("click", onModeClick);
resetBtn.addEventListener("click", onResetClick);
eraseBtn.addEventListener("click", onEraserClick);
/* 다른 버튼들은 위로 작성하고 버튼에 대한 event listner함수는 밑에다 작성하는 이유는, 
다른 event listner로 실행되는 함수들이 먼저 실행되어야 작동이 원활하 기 때문임! 
eg) 컬러 변경, 그림그리는 함수 등 */

// 자바스크립트 코드 위치
/* 
자바스크립트 코드를 작성할 때, 
순차적으로 나중에 작성하는 함수를 위로 보내는 이유는 코드가 레이어층으로 쌓여서 실행되기 때문임.
나중에 실행되는 함수를 먼저 레이어 층을 쌓아놓으면, 
마지막에 실행되는 가장 기본적인 시작함수가 데이터를 받고,
해당 데이터가 다른 데이터와 연계되어 각 함수에 맞게 들어가며
쌓여있던 레이어가 테트리스 블럭처럼 사라져서 데이터가 유실되거나 자리를 찾지못하는 일 없이 실행될 것!
*/

// #2.1 - Mouse Painting
/* 
마우스를 움직일때마다 브러쉬를 움직이게 하는것을 해줘야하므로 addEventListener => click 해주고, 

mousedown은 마우스를 누른채로 있는 것만 의마하는데, 누른채로 있으면 그려줘야하므로 
addEventListner를 새로 추가해서 그려주는 함수 만들어야함!
==> 그러기 위해서는 isPainting이라는 변수를 만들어줘야함
    왜냐하면, onMouseDown에는 onMove와는 별개의 함수이고 별개의 event이고
    마우스가 누르면 그리기 시작함을 알려주고 떼면 그리는 것을 멈춰야하므로 상태를 알려주기 위함!

따라서, mouseup이벤트에 대한 함수도 만들어서
 isPainting이라는 변수를 다시 false로 변경하여 그리지 않는 상태를 입력해줌

그리고 나서 브러쉬를 움직여줬던 onMove 함수에 가서 조건문을 넣어서 line을 그려줌!
return을 넣는 것은, 해당 값을 다시 받아야하므로임!
그리고 else에는 제일 처음 넣었던 moveTo함수를 넣어주면, false일 경우 브러쉬만 움직이게됨!

그러면 모든게 잘 되는걸 볼 수 있음! 클릭하고 누른채로 그려지고 클릭을 떼면 그려지지 않음!
하지만 여기서 우리는 작은 버그가 있는데, 이를 고쳐볼 것!
==> 우리가 클릭을 하고 누른채로 그리다가 캔버스 밖으로 마우스를 움직이고 마우스 클릭을 뗐다가 캔버스로 들어오면 
    클릭을 뗐는데도 계속 그려지고 있음!
    ==> 이유는 바로! mouseUp이벤트가 실행되지 않았기 때문! 
        canvas.addEventListner를 해줬는데 캔버스 밖까지 마우스를 누르고 있었기 때문임
        그렇기 때문에 캔버스 밖에서 mouseup을 해도 캔버스 밖이므로 event가 감지되지 않음

이를 해결하기 위해서 2가지 방법이 있는데, 
첫번째로는 canvas.addEventListner를 해주고 마우스가 떠났을때를 감지하는 것
canvas.addEventListener("mouseleave", onMouseUp);

다른방법은, canvas가 아니라 document에 addEventListner를 해줘서 mouseup을 감지하는것!
document.addEventListener("mouseleave", onMouseUp);

니꼬쌤은 mouseleave 이벤트를 추가하는 방법을 좋아함!
그리고 우리는 onMouseUp을 cancelPainting이라는 이름으로 바꿔줄 수 있음!
왜냐하면 이건 더이상 onMouseUp이벤트가 아니므로! (mouseup과 mouseleave 동시에 적용하고 있기 때문)
*/

// #2.2 - Line Width
/* 
이제 우리는 우리가 지금 만든 기능에서 선 굵기를 조절할 수 있는 input 기능을 추가로 만들어볼 것!
==> 그러기 위해서는 html에서 input을 넣어주기!
    (우리는 나중에 엄청 많은 input을 만들것! 캔버스 색상 input, image, text 등)

<input id="line-width" type="range" min="1" max="10" value="5" />
범위 지정 Input으로 만들건데 최소1, 최대10으로 하고 value를 5로 줘서 기본값은 5로!
그렇게 되면 우리가 위에 만들어준 ctx.lineWidth = 2;이 적용되지 않음! => 따라서 지워주고 아래와 같이 쓸 수 있음.

const lineWidth = document.getElementById("line-width")
ctx.lineWidth = lineWidth.value;

그리고 나서는! input에서 range조절을 할때마다 조절된 값을 알아차릴 수 있도록 해주는 event listner를 만들것!
range조절을 위해 change event listner를 만들고, 
해당 함수에 lineWidth를 event.value로 해주고, beginPath로 이전 선이 영향받지 않도록 해줌
beginPath의 위치는 moveTo의 이전이 되어야함! (자세한 설명은 line함수 주석 참조)

그리고 우리가 마지막으로 할 것은 rnage input의 또 다른 attribute!
우리는 지금 range의 단계가 1부터 10까지 1단계씩 변경되게 해주고 있는데, 이 단계를 바꿔줄 수 있음
=> step 속성!
: html에서 Input에 step="0.5" 해주면 1, 1.5, 2, 2.5 이렇게 더 세세하게 조절할 수 있음
  console.log(event.target.value)해보면 0.5씩 변화하는 것 볼 수 있음
*/

// #2.3 - Paint Color part1
/* 
이제 우리는 line의 color를 변경해볼 것! 이를 위해서 또 하나의 input을 html에 추가해줌!
그러면 이제 우리는 컬러를 클릭해서 변경할 수 있음! 
이제 이 변경한 컬러를 선에 적용해야 하는데, 전에 했던 것과 아주 비슷한 것을 할 것임
바로 color input에 event listner를 추가해준 후 우리의 함수와 연결하고 ctx를 변경하는 것!

이를 위해 우선 color 변수를 선언하여 해당 input을 id로 가져와주고, 
다른 listner들 밑에 똑같이 color의 event listner를 추가해주기!
그리고 선 변경과 마찬가지로 change event를 주고, event.target.value를 strokeStyle에 주기
*/

// #2.4 - Paint Color part2
/* 
방금까지 우리는 우리가 직접 컬러를 고를 수 있게 했지만, 예쁜 색상을 찾기가 힘듦 (너무 범위가 많고 세세해서)
따라서 우리는 사용자에게 미리 만들어진 색상을 제공해주고 사용자가 해당 색상을 클릭하면 바로 사용할 수 있도록 해주고 싶음!
(flatuicolors의 컬러는 매우 이쁘고 잘 되어있는데 해당 컬러차트처럼 선택지 줄것! )

즉, 우리는 컬러를 가져오고 해당 색상을 이용해 버튼을 만들어 볼 건데 정확히 말하면 button은 아니고 span태그!
컬러를 모두 복사했으면, html에 붙여넣기! 이때 alt + shift + i키를 눌러서 한번에 선택해서 ctrl+x

그 후 div를 만들고 class="color-option", style로 backgroud-color를 넣은 후 잘라넣은 컬러를 넣어줌!
그리고 나서 data- 라는 attribute를 사용할건데, data- 다음에 올 내용은 내가 마음대로 정할 수 있음!
이건 매우 유용한 속성으로, html 요소 안에 내가 넣고 싶은 값을 자유롭게 넣을 수 있음.
==> 그래서 나중에 해당 값을 활용해 자바스크립트에서 쓸 수 있음!

처음에 화면에 안보이므로 css에서 임의로 50px 50px 줘보기! (나중에 더 이쁘게 만들것!)
여기에 cursor: pointer로 주면 클릭할 수 있는 것처럼 보일 것!

그리고 나서 우리는 해당 컬러 div들을 모두 자바스크립트에 불러올 것!
불러온다는건 변수를 선언해준다는 것! (위에다가 변수 선언하기)
그리고 코드 끝에 console.log(colorOpitons) 출력해보면 HTMLCollection이 나올것!

그러면 본격적으로 시작해볼건데, 컬러 박스를 클릭하면 해당 박스의 색상으로 변경되야하므로 
각 컬러 div마다 event listner를 추가해줄것! 
==> 그러면 우리는 여기서 각각 추가해줬던 함수가 떠오를 것! forEach! 
    하지만 colorOptions.forEach()해보면 안되는데 이유는? => forEach는 Array에만 적용되는 함수이기 때문!
    colorOptions는 HTMLCollection이지 array가 아님!
    ==> 이를 해결하기 위해 Array.from을 사용해서 배열로 생성해보자!
        Array.from()는 자바스크립트의 배열로 만들어줌! 그러면 이제 forEach를 쓸 수 있음!

colorOptions라는 array의 각 Item들에 대해 함수를 실행해주고, 
=> colorOptions.forEach((color) => color.addEventListener("click", onColorClick));

onColorClick 함수에서 우리가 사용한 data- 속성을 활용해서 아래와 같이 만들어줌!
dataset은 data- 속성에서 우리가 입력해준 값을 property로 가지는 object임!
(해당 object는 또 클릭 이벤트의 타겟인 div의 object의 property중 하나!)
 ctx.strokeStyle = event.target.dataset.color;
 ctx.fillStyle = event.target.dataset.color;
 color.value = event.target.dataset.color;
이때 공통적으로 사용되는 event.target.dataset.color는 변수처리해서 간단하게 변경하기
*/

// #2.5 - Filling Mode
/* 
이번에는 새로운 버튼을 만들어서 선을 그리는 대신 색깔을 채워넣을 수 있도록 해볼 것!
기존의 선 색상을 변경하는 것에서 버튼을 누르면 채우는 것으로 변경하는 것!

우선 그동안 만든 html 태그를 하나의 div안에 넣는것으로 시작! (보기좋게 하기 위함)
그리고 버튼 태그를 만들어줄 것! 모드를 변경하는 것이므로 mode-btn이라는 Id부여

해당 버튼 태그를 modeBtn변수로 선언하여 가지고 오고,
클릭을 하면 채워주는 것으로 변경할 것이기 때문에 event listner추가해주기
onModeClick이라는 함수를 만들건데, 해당 함수는 모드를 바꾸는 일을 할 것임!
1) 캔버스 전체를 채우는 모드 
2) 다른 한 모드는 선을 그리는 것 

==> 이를 위해 제일 처음 했던 클릭하면 선이 그어지고 떼면 선을 긋지 않는 함수처럼
    true인지 false인지 구분하는 것처럼 비슷하게 해볼 것!
    ==> 이를 위해 let을 통해 변수를 선언해줄 것!
        isFilling을 선언하고, 우선은 false로 해준 후 onModeClick함수에 조건문 추가하기!
    
    이때 조건문은 isFilling이 true면 다시 이를 false로 바꿔주도록하고, 
    isFilling이 false면 다시 이를 true로 변경해주도록 해야함!
    (false가 채우는모드인데 나는 채우고싶지 않으면 버튼을 클릭할 것
    --> 조건문이 실행되면 false일 경우 함수실행됨
    --> 그러면 false안의 함수는 true로 변경하도록 하여 모드를 변경해줘야함 )
    --> 그리고 추가로 버튼의 text도 변경되도록 해야함!
        채우기 모드일땐 Fill이고 아닐땐 다른 텍스트로!

    그리고 나서 우리는 이제 모드별로 해당 모드를 실행해주는 함수를 추가해야함!
    하지만 우리는 이미 비슷한 함수를 가지고 있음!
    ==> 채우는 모드에 필요한 비슷한 함수는 바로 mouseDown함수! 
        moueseDown을 할때 그림을 시작함 => 우리는 선을 긋는게 아니라 캔버스를 채워주도록!
        
    아니면 mousedown되고 mouseUp할때 채워지도록 할 수도 있음
    즉, 클릭할 때 채워주도록 만드는 것! 
    그럼 이 방법으로 해보게 된다면,
    ==> 우리는 canvas에 새로운 event listner를 추가해서, click이벤트를 받을 것임!
        해당 캔버스 이벤트는 캔버스를 클릭하면 우리가 선택한 컬러값으로 캔버스를 채우는 함수를 실행하도록 할 것임.
        그러면 onCanvasClick이라는 함수를 만들고, isFilling이 false일 때, 
        캔버스크기만큼의 사각형을 만들고 그 안을 채워주도록 할 것! (fillRect)
    
    **중요!
    fillRect만 실행해도 되고 컬러는 건들지 않아도 되는 이유는, 
    우리가 이미 앞에서 컬러 변경 함수인 onColorChange, onColorClick 두 함수에
    fillStyle함수도 미리 넣어놨기 때문임!
*/

// #2.6 - Eraser
/* 
이번에는 그림판을 초기화하는 버튼을 만들어줄 것! 말 그대로 모두 지우는 것!
이를 위해 html에서 버튼을 추가할것! 니꼬쌤은 destroy로 했지만 나는 reset으로 id 줬음
그럼 해당 button을 변수로 가져오고 클릭하면 리셋이 되야하므로 event listener추가해주기

해당 버튼의 event listener의 onResetClick이라는 함수를 만들어 초기화하는 기능을 넣어야함!
초기화를 해준다는 건 백지 상태로 돌아가고 싶다는 의미임!
하지만 우리는 이미 그린 것을 지우지는 못함! 이미 그려진 선, 색 등 자체를 지우는 기능은 없음!

하지만! 해당 선들 위에 그릴 수는 있음!
사실 reset은 
(1)colorpicker에서 하얀색을 선택하고, 
(2)채우기모드로 바꿔서 
(3)캔버스를 클릭해 새로운 캔버스 그려주는 것!

그러므로 onResetClick 함수는 굉장히 쉬움!
ctx.fillStyle을 white로 변경해주고 다시 캔버스 그려주면됨!

이때 우리가 fillRect의 800을 많이쓰므로 상수로 변수 선언해주기!
const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 800;
그리고 800 썼던 것들 모두 변수로 변경!

그리고 우리는 하나 더 해볼건데, 바로 지우기 모드를 활성화 시키는 것!
지우기는 아까 하얀색으로 변경해주는 것이라고 했음!
그러면 버튼을 눌러서 지우기 모드를 실행한 뒤 하얀색으로 그려주는 것을 해주면 됨!
html에 eraser button추가하고 변수 선언 및 event listener 추가하기!

onEraserClick이라는 함수를 만들어준 후에, 하얀색으로 칠하기 위해 StrokeStyle을 white로 변경!
그리고 그 외에 우리는 이 Erase버튼을 눌렀을 때, Fill 모드일 경우에 Draw모드가 되도록 바꿔줘야함!
onModeClick 함수를 복사해올 것!
==> isFilling = false; 
    modeBtn.innerText = "Fill";
*/
