const canvas = document.querySelector("canvas");
/* 그림을 그리기 위해서는 우선 context를 얻어야함
context가 엄청 좋은 이름은 아니지만 문서에서 찾게될 이름이며
기본적으로 Painting brush임! (붓, 브러쉬) */

// const context = canvas.getContext("2d");
// 2d외 다른 선택지들은 3d위한것! 2d는 소문자임
const ctx = canvas.getContext("2d");
// 많이 쓸 것이므로 이름 줄임말로 변경함
canvas.width = 800;
canvas.height = 800;
/* 선들을 그리기 시작할때 width와 height를 자바스크립트 안에서만 수정할 것이며
css에 설정한 것과 마찬가지로 높이와 너비를 동일하게 작성함
canvas의 이미지 퀄리티를 높이기 위해서임 (설명은 나중에! ) */
/* 
본격적으로 drawing하기전에 canvas의 좌표시스템을 이해해야함
canvas의 좌표는 왼쪽 상단에서부터 0,0 좌표로 시작함 (왼쪽위꼭짓점)
*/
// ctx.fillRect(50, 50, 100, 200);
// fillRect(x좌표, y좌표, 가로, 세로) => 사각형 그려주는 메서드
/* 사실 fillRect는 shortcut함수임(단축함수)
원래 우리는 선들을 먼저 그리고, fill할지 stroke할지 선택해야함.
fill은 채우는 것, stroke는 선만 

만약 단축안하고 그냥 했으면
ctx.rect(50, 50, 100, 200); 
    => 선만 그어지고 화면에 표시되지는 않음! 선을 어떻게 나타낼지 안정해줬기 때문임
       어쨌든 중요한건, 모든 모양을 채우기 전에 많은 선을 만들 수 있다는 것을 아는게 중요함
ctx.stroke(); 
ctx.fill();

아까 모양을 채우기 전에 많은 선을 만들 수 있다는게 중요하다고 했는데,
예를 들어, 
ctx.rect(50, 50, 100, 100);
ctx.rect(150, 150, 100, 100);
ctx.rect(250, 250, 100, 100);
ctx.fill();
=> 이렇게 하면 rect로 그어진 선들이 모두 한번에 채워짐
*/

// #1.2
// ctx.rect(50, 50, 100, 100);
// ctx.rect(150, 150, 100, 100);
// ctx.rect(250, 250, 100, 100);
// ctx.fill();

// ctx.beginPath();
// ctx.rect(350, 350, 100, 100);
// ctx.fillStyle = "red";
// ctx.fill();
/* 나는 350 좌표를 가진 것만 red를 해주고 싶은데 이렇게 코드를 쓰면 모두 빨간색으로 변함 
그 이유는 위 코드들이 모두 같은 Path를 가지기 때문임!

하나의 층과 같은 경로를 생각하고, 
같은 경로에 많은 선을 그린다고 치면, 해당 경로의 style중 무언가를 바꾸면 모든 경로에 영향을 미침
그러면 일부만 다르게 하고 싶다면? 
=> 새로운 사각형 그려야함 ctx.beginPath() 메서드 사용 

canvas에서 그림을 그릴 때 그 과정에 매우 필수적임
즉, 기본적으로 코드에서 모든 단계들을 하나씩 다 만들어줘야함
선을 만들고, 선을 만들고, 색을 적용하고

또, canvas로 그린 그림들은 원한다면 경로로 나눌 수 있다는 것도 배웠음
이걸 이해하는게 정말 중요함!우리는 그림의 모든 상태를 기억해야하고 경로를 기억해야함
beginPath()가 보이면 경로가 단절되는 것! (새로운 경로의 시작)
*/

// #1.3
/* 
이전 영상에서 fillRect가 단축함수라고 했는데, 
사실 rect function도 shortcut(단축,지름길)임!
이번 영상에서는 그전에 만들었던 사각형 모두 지워줄 것! 
이번에는 단축 사용하지 않고 그려볼 예정! rect 사용X
*/
// ctx.moveTo(50, 50);
// ctx.lineTo(150, 50);
// ctx.lineTo(150, 150);
// ctx.lineTo(50, 150);
// ctx.lineTo(50, 50);
// // ctx.stroke();
// ctx.fill();
/* 
ctx.moveTo(x y); x와 y좌표만큼 브러쉬 위치를 움직여줌 (시작점 설정)
ctx.lineTo(x y); 현재 위치에서 x와 y좌표만큼 움직인 만큼 선을 그음
*/

// #1.4
/* 
지금까지 배운걸로 집모양을 만들어볼 것!
*/
// 벽
ctx.fillRect(100, 200, 50, 200);
ctx.fillRect(300, 200, 50, 200);
// 문
ctx.lineWidth = 2;
ctx.fillRect(200, 300, 50, 100);
/* 이렇게만 하면 선이 굵지 않음
이를 바구기 위해 아래와 같이 추가 코드 작성 */
/* lineWidth 와 같이 style을 주는 코드는 반드시 
스타일을 먼저 명시해줘야함! 
ctx.strokeRect(300, 300, 50, 100); 먼저 쓰고
ctx.lineWidth = 20; 작성하면
이미 선이 이미 그려진 이후에 선 굵기를 변경한 것이므로 선 굵기가 제대로 작동하지 않음
*/
// 천장
ctx.fillRect(100, 200, 200, 20);
// 지붕
ctx.moveTo(100, 200);
ctx.lineTo(225, 100);
ctx.lineTo(350, 200);
ctx.fill();
/* 오른쪽벽이 400좌표에서 시작해서 50의 너비를 가지므로
200-450 중간은 (200+450)/2=325 */

// #1.5
/* 이번에는 사람을 그려볼 것! */
ctx.beginPath();
// 팔
ctx.fillRect(510, 200, 15, 100);
ctx.fillRect(650, 200, 15, 100);
// 몸통
ctx.fillRect(560, 200, 60, 200);
// 머리
// ctx.arc(50, 50, 20, 0, 2 * Math.PI);
/* ctx.arc(x좌표, y좌표, 반지름, startAngle, EndAngle)
EndAngle은 우선 Math.PI(파이)해놓고 이따가 바꿀것 
결과를 보니 원이 작으므로 반지름 늘리기 */
ctx.arc(590, 100 + 50, 50, 0, 2 * Math.PI);
ctx.fill();
/* starting angle 
Ending angle은 원을 끝내는 angle
이것 덕분에 우리가 항상 완벽한 원을 만들지 않아도됨

원의 시작점이 0 이면 0에서 시작 하고 이를 기준으로
0.5*PI는 우측하단 원모양
1*PI는 우측을 지나서 반원모양까지 
1.5*PI는 우측 반원 지점을 지나서 다시 위로 올라가서 반원의 반부분
2*PI가 다시 시작점으로 돌아와서 완벽한 원모양
*/
// 눈
ctx.beginPath();
ctx.fillStyle = "white";
ctx.arc(570, 90 + 50, 8, Math.PI, 2 * Math.PI);
ctx.arc(610, 90 + 50, 8, Math.PI, 2 * Math.PI);
ctx.fill();
/* 무언가 색을 바꿔주려면 새로운 path가 필요한지 아닌지 생각해줘야하는것 잊지 말기!*/
/* starting angle을  Math.PI(=1*PI)로 변경해주니 
반원이 끝나는 지점부터 시작하므로 윗부분만 남은 반원이됨 */
// 입
