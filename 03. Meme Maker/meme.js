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

const fileInput = document.getElementById("file");
const textInput = document.getElementById("text");

const saveBtn = document.getElementById("save");

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 800;

canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;
ctx.lineCap = "round";
ctx.lineWidth = lineWidth.value;

let isPainting = false;
let isFilling = false;

//
function onModeClick() {
  if (isFilling) {
    isFilling = false;
    modeBtn.innerText = "Fill";
  } else {
    isFilling = true;
    modeBtn.innerText = "Draw";
  }
}

//
function onColorClick(event) {
  const colorValue = event.target.dataset.color;
  ctx.strokeStyle = colorValue;
  ctx.fillStyle = colorValue;
  color.value = colorValue;
}
function onColorChange(event) {
  ctx.strokeStyle = event.target.value;
  ctx.fillStyle = event.target.value;
}

//
function onLineWidthChange(event) {
  ctx.lineWidth = event.target.value;
}

//
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

//
function onCanvasClick() {
  if (isFilling) {
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  }
}

//
function onResetClick() {
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
}
function onEraserClick() {
  ctx.strokeStyle = "white";
  isFilling = false;
  modeBtn.innerText = "Fill";
}

//
function onFileChange(event) {
  //   console.dir(event.target);
  const file = event.target.files[0];
  /* 이게 파일 배열인 이유는, input에 multiple속성을 추가할 수 있기 때문임
  우리는 안넣었지만, multiple넣으면 여러개 업로드 가능 */
  const url = URL.createObjectURL(file);
  //   console.log(url);
  /* 
  이렇게 하면, 우리가 선택한 이미지의 url이 콘솔창에 나타나는데,
  blob까지 복사해서 브라우저에 입력히면 이미지 파일이 나타남!

  이 url은 현실의 인터넷에서 존재하지 않음! 이건 브라우저를 위한 url이고 
  이게 브라우저가 자신의 메모리에 있는 파일을 드러내는 방식임.
  ==> 시크릿모드의 창이나 firefox등 다른 브라우저의 창에 url입력하면 열리지 않음 (주소가 잘못되었다고 뜸)
      왜냐하면, 이 url은 이미지에 접근 가능한 브라우저를 위한 것이기 때문!
  */
  const image = new Image();
  image.src = url;
  image.onload = function () {
    ctx.drawImage(image, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    fileInput.value = null;
  };
}

//
function onDoubleClick(event) {
  const text = textInput.value;
  if (text !== "") {
    ctx.save();
    //const text = textInput.value;
    ctx.lineWidth = 1;
    ctx.font = "60px serif";
    //ctx.strokeText(text, event.offsetX, event.offsetY);
    ctx.fillText(text, event.offsetX, event.offsetY);
    ctx.restore();
  }
  /*
  이 상태로 더블클릭하면 엄청 이상하게 작게 나옴! 
  lineWidth 값이 5로 되어있기 때문(기본값) (1로 변경하고 해보면 잘 나옴!)
  ==> 그렇다면 text를 stroke하기전에 lineWidth를 1로 바꾸는게 나음!

  ctx.lineWidth = 1; 라고 추가하면 이때 문제는,
  텍스트 말고 내가 선을 그릴때도 line이 1로 적용되버림

  우리는 우리가 원하는 선의 굵기로 그리고, text는 1의 굵기로 그려진다음에,
  다시 선을 그릴때는 우리가 설정해놨던 선의 굵기가 되면 좋겠음!
  ==> 이를 위한 함수는 save!
      ctx.save();는 ctx의 현재 상태, 색상, 스타일 등 모든 것을 저장함!
      그리고 이후 작성된 코드에 따라 스타일이 변경되고, 
      마지막에 ctx.restore();써주면 처음에 저장했던 스타일이 다시 적용됨!
      즉, save와 restore 사이에서는 어떤 수정을 하더라도 저장되지 않음!

      이제 폰트를 변경하고 싶은데, save와 restore사이에 font메서드를 호출할 것!
      font는 두 가지 property 지정이 가능함! 
      ctx.font = "40px serif"; 사이즈와 글씨체!
  
  그리고 마지막으로 텍스트에 아무것도 입력되어있지 않으면 더블클릭해도 아무일 없으면 좋겠음
  ==> 이를 위해 text변수를 가장 위로 선언하고, 조건문을 바로 실행 해줄것!
      위에다 작성한 이유는 밑의 코드가 작성되기 전에 실행되어야 하므로!
      if (text === "") 해주려는데, 이것보다 더 나은 방법이 있음
      조건에 === 아니라 !== 해주고 함수안에 작성한 코드들 넣는 것!
      ==> 즉, text가 !== "" (비어있지 않으면) 코드 실행!
  */
}

function onSaveClick() {
  //   console.log(canvas.toDataURL());
  const url = canvas.toDataURL();
  const a = document.createElement("a");
  a.href = url;
  a.download = "myDrawing.png";
  a.click();
  //저장하는 창이 뜨도록 가짜 클릭 역할
}

canvas.addEventListener("mousemove", onMove);
canvas.addEventListener("mousedown", onMouseDown);
canvas.addEventListener("mouseup", cancelPainting);
canvas.addEventListener("mouseleave", cancelPainting);

canvas.addEventListener("dblclick", onDoubleClick);

lineWidth.addEventListener("change", onLineWidthChange);
color.addEventListener("change", onColorChange);

canvas.addEventListener("click", onCanvasClick);

colorOptions.forEach((color) => color.addEventListener("click", onColorClick));

modeBtn.addEventListener("click", onModeClick);
resetBtn.addEventListener("click", onResetClick);
eraseBtn.addEventListener("click", onEraserClick);
fileInput.addEventListener("change", onFileChange);

saveBtn.addEventListener("click", onSaveClick);

// #3.0 - Adding Images
/* 
이번 영상부터는 밈 메이커 기능을 만들기 시작해볼 것!
밈 메이커 기능으로 canvas에 이미지를 넣을 수 있고, 이미지 위에 텍스트도 넣을 수 있게 될 것!
이를 위해서는 html에 input을 추가해줘야함!

input type=file로 해줄건데! 여기서 주의할 것은 그냥 태그를 닫아버리면 
file에 이미지 외에 비디오도 넣을 수 있고 여러가지 다른 파일 넣을 수 있어짐.
==> 따라서 accept attrubute 사용해서 사용가능한 파일의 타입 지정해주기!
    우리는 이미지를 원하므로 image/* 할건데, /*는 이미지의 어떤 포맷도 상관없다는 뜻!

그리고 우리는 이 input을 변수로 선언하고 event listener를 추가해줄건데,
이번에는 change라는 event를 넣어줄 것!

그리고 onFIleChange라는 함수를 만들건데, 우선 console.dir(event.target);을 통해서
change시 발생하는 input값의 property들을 확인해보면,
files라는 property에서 내가 선택한 file을 확인할 수 있음을 알 수 있음.
이걸 아는게 굉장히 중요함! 

비유하자면, 브라우저는 샌드박스 속에 있음!
즉, 브라우저는 항상 유저의 실제 파일 시스템과 격리되어 있음.
예를 들어, 자바스크립트 애플리케이션은 유저의 파일을 읽을 수 없음(그냥 내 문서들을 마음대로 읽을 수 없음!!당연한것)
이걸 가능하게 하는 코드도 없고 브라우저의 자바스크립트는 내 파일을 읽을 수 없음!
파일은 유저가 파일을 선택했을 때만 자바스크립트에게 보이게됨!
==> 유저가 파일을 선택했기 때문에 이제 브라우저는 해당 파일을 가지고 이것저것 할 수 있음

이제 뭘 하고 싶냐면, url을 가지고 해당 파일에 접근하고 싶음!
다시 말해, 해당 파일은 이제 자바스크립트 세계에 존재하고,
file property의 object에서 확인할 수 있듯이 파일 정보는 볼 수 있지만 난 이 파일에 접근하고 싶음
이 사진을 url을 이용해서 볼 수 있게 하고 싶음.
파일은 브라우저의 메모리에 있고, 난 브라우저가 그 메모리 부분의 url을 줬으면 좋겠음
이를 위해서 무엇을 할 것이냐면, 
==> onFileChange함수에서 file이라는 변수를 선언하고 event.target.files[0]를 해줄 것.
    이건 change라는 이벤트가 일어나 변경된 타겟 즉, 선택된 사진(파일)의 property중 
    files의 array에서 첫번째값을 가져올 것

    그리고, 브라우저의 메모리에서 그 파일의 url을 얻어올건데, 
    값을 얻어오고 사용하기 위해서는 변수를 선언해줘야함을 잊지 말기!
    const url = 을 선언하고 URL.createObjectURL 메서드를 사용해서 
    우리가 선택한 이미지파일의 url값을 가져와줄 것! 
    이때 이미 file이라고 변수 선언해서 파일의 정보를 가져왔기 때문에 메서드의 argument는 file로!
    이렇게까지 하면, 우리가 선택한 이미지 파일에 대한 url주소를 가져오게됨!

    이때 주의할 것은, 이 url은 현실의 인터넷에서 존재하지 않는다는 것. 
    이건 브라우저를 위한 url이고 브라우저가 자신의 메모리에 있는 파일을 드러내는 방식임.
    ==> 시크릿모드의 창이나 firefox등 다른 브라우저의 창에 url입력하면 주소가 잘못되었다고 뜸
        왜냐하면, 이 url은 이미지에 접근 가능한 브라우저를 위한 것이기 때문!

이제 내가 원하는 것은 이미지를 만드는 것임!
우리는 image 변수를 선언하고 const image = new Image();라고 만들어줄 것!
이때 new Image()함수는, html의 image태그와 동일함(이미지를 나타내주는 태그)
new Image() = <img src=""/></image> 
이미지에는 src(경로)가 있으므로, image.src = url;로 우리가 만든 브라우저를 위한 url로 할당

우리는 이제 이 Image에 event listener를 추가해볼건데, 그동안 추가했던 방법이랑은 다르게 해볼 것!
기존에 썼던 방식은, element에 addEventListener를 추가해주는것이었음
이번에는 on 매서드를 사용할 것!
addEventListener를 선호하는 이유는, 같은 event내에서 추가/삭제가 자유롭기 때문
onFileCange함수를 위해 특별히 사용해도 괜찮음!
==> 우리가 사용할 event는 바로 load! 이미지가 load되는 Event!
    따라서, image.onload = function() {} 라고 해준후에, 
    함수 안에는 drawImage()라는 메서드를 호출할 것!
    drawImage는 인수로 이미지를 필요로 하는데 우리는 이미 가지고 있음.
    ==> ctx.drawImage(image, 200, 200); 이때 00,200은 이미지를 위치시킬 좌표임!
        이제 이미지의 사이즈를 캔버스와 동일하게 변경해볼 것! 
        ==> ctx.drawImage(image, 0, 0, 800,800)
    
    마지막으로 하고싶은건 이미지를 불러와서 캔버스에 그려줄 때, file input을 비우고 싶음!
    다시 동일한 이미지를 선택할 수 있도록! 혹은 다른 이미지 넣을 수 있도록!
    ==> fileInput.value = null; 추가!
*/

// #3.1 - Adding Text
/* 
이번에는 text input을 만들어볼 것!
유저가 텍스트를 입력할 수 있고 캔버스를 더블클릭하면 그 텍스트를 추가할 것!
동일하게 해당 input 변수로 선언하고 event listener추가할 것처럼 보이겠지만!
text input에 event listener 추가하지 않을것!!
==> 왜냐하면 우리는 text input에 발생하는 event에는 관심이 없음!
    캔버스를 더블클릭하면 생기도록 할 것이므로! 
    따라서 canvas에 event listener 추가하고 dblclick이라는 event 호출!

    그리고 나서 이제 텍스트를 캔버스에 추가하기 위한 함수를 만들어줄건데,
    우리는 이미 event.offsetX, event.offsetY를 통해서 우리가 더블클릭시의 좌표를 얻을 수 있음!
    이제는 텍스트에 접근해야함! 우리가 원하는 text는 text input의 value값임!
    ==> 이를 위해 const text = textInput.value; 선언하여 
        text input값을 사용할 수 있도록 변수를 만들어줌!
    
    그리고 나서! ctx.text라고 쳐보면 자동완성으로  strokeTest, fillText 메서드 보일것!
    둘 중 하나 선택해서 쓰면 되는데, strokeText()먼저 사용!
    strokeText는 선만 나오는 것이고 fillText는 텍스트 다 채워져서 나옴!

    하지만 이때 lineWidth 값이 5로 되어있기 때문(기본값) (1로 변경하고 해보면 잘 나옴!)
    ==> 그렇다면 text를 stroke하기전에 lineWidth를 1로 변경
        ctx.lineWidth = 1; 라고 추가하면 문제는, 내가 선을 그릴때도 line이 1로 적용되버림

    우리는 우리가 원하는 선의 굵기로 그리고, text는 1의 굵기로 그려진다음에,
    다시 선을 그릴때는 우리가 설정해놨던 선의 굵기가 되면 좋겠음!
    ==> 이를 위한 함수는 save!
        ctx.save();는 ctx의 현재 상태, 색상, 스타일 등 모든 것을 저장함!
        그리고 이후 작성된 코드에 따라 스타일이 변경되고, 
        마지막에 ctx.restore();써주면 처음에 저장했던 스타일이 다시 적용됨!
        즉, save와 restore 사이에서는 어떤 수정을 하더라도 저장되지 않음!
    
    그리고나서 텍스트에 아무것도 입력되어있지 않으면 더블클릭해도 아무일 없으면 좋겠음
    ==> 이를 위해 text변수를 가장 위로 선언하고, 조건문을 바로 실행 해줄것!
        위에다 작성한 이유는 밑의 코드가 작성되기 전에 실행되어야 하므로!
        if (text !== "")으로 조건 작성 및 함수안에 작성한 코드들 넣기!

마지막으로 현재 선의 끝이 직각으로 되어있는데 나는 이 끝부분을 둥글게 하고 싶음!
==> 이를 위해 ctx를 initialize하는 부분(캔버스 사이즈 등 부여하는 부분)으로 가서 lineCap을 작성할것!
    ctx.lineCap = "round"; (butt, round, square 설정 가능!)
*/

// #3.2 - Saving Image
/* 
이번에는 이미지 저장을 위한 버튼을 만들어줄 것!
이 버튼을 자바스크립트에서 사용하기 위해서 변수로 선언!
그리고 해당 버튼을 누르면 저장되야 하므로 event listener도 추가해주기!

onSaveClick이라는 함수를 만들고 추가하기!
이때 이 함수에서 하고 싶은 건 현재 캔버스 안에 있는 이미지를 저장하는 것!
우리는 이를 위해 cancas.toDataUrl 이라는 캔버스의 메서드를 사용할 수 있음!
==> console.log(canvas.toDataURL());를 해서 캔버스에 선 그은 후 버튼 눌러보면 
    이미지를 돌려주는데, 이 이미지는 base64로 인코딩 되어 있음!
    긴 텍스트가 바로 내 이미지가 되는 것! 내가 방금 그린 이미지가 url로 인코딩 되어 있는 것

그러면 이 url을 사용하기 위해서는? 
==> 무조건 사용을 하려면 변수 선언! 
    const url = canvas.toDataURL();

그리고 우리는 링크를 생성해줄 것! 
말 그대로 a태그를 이용해서 링크를 만들건데 웹사이트로 링크하는 대신
우리가 만들어준 이미지의 url로 링크할 것!
그 다음에 a태그 안에 있는 download라는 속성을 이용할 것! 
(download속성을 넣으면 파일 다운로드를 작동시킴)
==> const a = document.createElement("a");
    a.href = url;
    a.download = "myDrawing.png";
    a.click();
a 라는 변수 선언과 동시에 a 태그를 만들어줌!
a.href = url로 아까 우리가 만들어준 캔버스의 url toDataURL 값을 넣어주고
a.download를 통해 다운로드 실행하는데, 
myDrawing이라는 기본 이름값이 넣어지고 Png형식 기본값으로 들어감!
a.click();을 통해 가짜클릭을 해줄건데 이를 통해 마지막으로 저장할 수 있는 창이 뜰 것!
*/

// #3.4 - CSS
// css파일에서 진행!
