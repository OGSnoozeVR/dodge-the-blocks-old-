const canvas = document.getElementById("gameCanvas")
const ctx = canvas.getContext("2d")

let player = {
x:280,
y:340,
width:40,
height:40,
speed:8
}

let keys={}
let blocks=[]
let bossBlocks=[]
let particles=[]
let powerups=[]

let score=0
let frame=0
let gameRunning=false
let paused=false

let spriteFrame=0
let spriteTimer=0

const sprite=new Image()
sprite.src="assets/playerSprite.png"

const blockImage=new Image()
blockImage.src="assets/block.png"

const bossImage=new Image()
bossImage.src="assets/boss.png"

const powerImage=new Image()
powerImage.src="assets/powerup.png"

document.addEventListener("keydown",e=>{

keys[e.key]=true

if(e.key==="p")togglePause()

})

document.addEventListener("keyup",e=>keys[e.key]=false)

function startGame(){

document.getElementById("startMenu").style.display="none"

canvas.style.display="block"

gameRunning=true

gameLoop()

}

function restartGame(){
location.reload()
}

function togglePause(){

paused=!paused

document.getElementById("pauseMenu").style.display=
paused?"block":"none"

}

function spawnBlock(){

blocks.push({
x:Math.random()*(canvas.width-40),
y:-40
})

}

function spawnBoss(){

bossBlocks.push({
x:Math.random()*(canvas.width-80),
y:-80,
hp:5
})

}

function spawnPowerup(){

powerups.push({
x:Math.random()*(canvas.width-30),
y:-30
})

}

function createExplosion(x,y){

for(let i=0;i<40;i++){

particles.push({
x:x,
y:y,
vx:(Math.random()-0.5)*10,
vy:(Math.random()-0.5)*10,
life:60,
size:Math.random()*6
})

}

}

function update(){

if(!gameRunning || paused)return

frame++

if(frame%60===0)spawnBlock()

if(frame%600===0)spawnBoss()

if(frame%500===0)spawnPowerup()

/* LEFT RIGHT ONLY */

if(keys["ArrowLeft"])player.x-=player.speed
if(keys["ArrowRight"])player.x+=player.speed

/* SCREEN LIMIT */

if(player.x<0)player.x=0
if(player.x+player.width>canvas.width)
player.x=canvas.width-player.width

/* ANIMATION */

spriteTimer++

if(spriteTimer>6){

spriteFrame=(spriteFrame+1)%4
spriteTimer=0

}

}

function drawPlayer(){

ctx.drawImage(
sprite,
spriteFrame*32,
0,
32,
32,
player.x,
player.y,
40,
40
)

}

function drawBlocks(){

for(let i=0;i<blocks.length;i++){

blocks[i].y+=4

ctx.drawImage(blockImage,blocks[i].x,blocks[i].y,40,40)

if(collision(player,blocks[i])){

createExplosion(player.x,player.y)

endGame()

}

}

}

function drawBoss(){

for(let i=0;i<bossBlocks.length;i++){

bossBlocks[i].y+=2

ctx.drawImage(bossImage,bossBlocks[i].x,bossBlocks[i].y,80,80)

if(collision(player,bossBlocks[i])){

createExplosion(player.x,player.y)

endGame()

}

}

}

function drawPowerups(){

for(let i=0;i<powerups.length;i++){

powerups[i].y+=3

ctx.drawImage(powerImage,powerups[i].x,powerups[i].y,30,30)

if(collision(player,powerups[i])){

player.speed+=2

powerups.splice(i,1)

}

}

}

function drawParticles(){

for(let i=0;i<particles.length;i++){

let p=particles[i]

p.x+=p.vx
p.y+=p.vy
p.life--

ctx.fillStyle="orange"
ctx.fillRect(p.x,p.y,p.size,p.size)

if(p.life<=0)particles.splice(i,1)

}

}

function collision(a,b){

return(
a.x<b.x+40 &&
a.x+a.width>b.x &&
a.y<b.y+40 &&
a.y+a.height>b.y
)

}

function drawScore(){

ctx.fillStyle="white"

ctx.fillText("Score: "+score,10,20)

}

function endGame(){

gameRunning=false

document.getElementById("gameOver").style.display="block"

document.getElementById("finalScore").innerText="Score: "+score

saveScore()

}

function gameLoop(){

ctx.clearRect(0,0,canvas.width,canvas.height)

update()

drawPlayer()

drawBlocks()

drawBoss()

drawPowerups()

drawParticles()

drawScore()

score++

requestAnimationFrame(gameLoop)

}

/* MOBILE CONTROLS */

document.getElementById("leftBtn").ontouchstart=()=>keys["ArrowLeft"]=true
document.getElementById("leftBtn").ontouchend=()=>keys["ArrowLeft"]=false

document.getElementById("rightBtn").ontouchstart=()=>keys["ArrowRight"]=true
document.getElementById("rightBtn").ontouchend=()=>keys["ArrowRight"]=false

/* ONLINE LEADERBOARD (placeholder) */

function saveScore(){

let name=document.getElementById("playerName").value||"Player"

let scores=JSON.parse(localStorage.getItem("scores"))||[]

scores.push({name,score})

scores.sort((a,b)=>b.score-a.score)

scores=scores.slice(0,10)

localStorage.setItem("scores",JSON.stringify(scores))

displayLeaderboard()

}

function displayLeaderboard(){

let scores=JSON.parse(localStorage.getItem("scores"))||[]

let list=document.getElementById("leaderboard")

list.innerHTML=""

scores.forEach(s=>{

let li=document.createElement("li")

li.textContent=s.name+" - "+s.score

list.appendChild(li)

})

}

displayLeaderboard()
