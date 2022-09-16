    import Head from 'next/head'
    import {useState, useEffect} from "react"

let LastFrame = 0;
let SnakeSpeed = 7;
let SnakeGrowthRate = 2;
let SnakeRemainingGrowth = 0;
let SnakeBody = [{x:8, y:11}, {x:7, y:11}, {x:6, y:11}]
let Food = {x:15, y:11}
const board = null;
let BoardSize = 21;
let Direction = { x: 1, y: 0}
let DirectionQueue = null
let LastDirection = { x: 1, y: 0}
let GameStarted = false;
let GameOver = false;
let GamePaused = false;


let LoopEdges = false;
let EatTail = false;

function InitializeBoard(board){
    UpdateFood(board)
    SnakeBody.forEach(s => {
        const te = document.createElement('div')
        te.classList.add("snaketop")
        const se = document.createElement('div')
        se.style.gridRowStart = s.y
        se.style.gridColumnStart = s.x
        se.classList.add("snake")
        se.appendChild(te)
        board.appendChild(se)
    })
}

function UpdateFood(board){
    for (const c of board.children){
        if (c.className === "food")
            c.remove()
    }
    const fe = document.createElement('div')
    fe.style.gridRowStart = Food.y
    fe.style.gridColumnStart = Food.x
    fe.classList.add("food")
    board.appendChild(fe)
}

function RandomGridPosition(){
    return {
        x: Math.ceil(Math.random() * BoardSize),
        y: Math.ceil(Math.random() * BoardSize)
    }
}
function EatSelf(){
    let res = false;
    let c = 0
    let p = SnakeBody[0]
    for (let index = 1; index < SnakeBody.length; index++) {
        if (p.x == SnakeBody[index].x && p.y == SnakeBody[index].y){
            res = true
        }
        if (res)
            c++
    }
    for (let index = 1; index < c; index++) {
        SnakeBody.pop();
    }
}

function OnSnake(p){
    let res = false;
    SnakeBody.forEach(s => {
        if (p.x == s.x && p.y == s.y){
            res = true
        }
    })
    return res
}

function UpdateSnake(board){
    const NextX = SnakeBody[0].x + Direction.x;
    const NextY = SnakeBody[0].y + Direction.y;
    SnakeBody = [{x:NextX, y:NextY}, ...SnakeBody]
    LastDirection = Direction
    if (DirectionQueue){
        Direction = DirectionQueue
        DirectionQueue = null;
    }
    
    EatSelf()
    if (SnakeBody[0].x > BoardSize){
        SnakeBody[0].x = 1
    }
        
    if (SnakeBody[0].y > BoardSize){
        SnakeBody[0].y = 1
    }
        
    if (SnakeBody[0].x < 1){
        SnakeBody[0].x = BoardSize
    }
        
    if (SnakeBody[0].y < 1){
        SnakeBody[0].y = BoardSize
    }
        
    if (SnakeRemainingGrowth === 0)
        SnakeBody.pop();
    else
        SnakeRemainingGrowth--
    
    if (SnakeBody[0].y == Food.y && SnakeBody[0].x == Food.x){
        SnakeRemainingGrowth += SnakeGrowthRate
        let newFood = RandomGridPosition()
        while (OnSnake(newFood)){
            newFood = RandomGridPosition()
        }
        Food = newFood
        UpdateFood(board)
    }
       
    const ToRemove = []
    for (const c of board.children){
        if (c.className === "snake")
            ToRemove.push(c)
    }
    ToRemove.forEach(c => {
        c.remove();
    })


    SnakeBody.forEach(s => {
        const te = document.createElement('div')
        te.classList.add("snaketop")
        const se = document.createElement('div')
        se.style.gridRowStart = s.y
        se.style.gridColumnStart = s.x
        se.classList.add("snake")
        se.appendChild(te)
        board.appendChild(se)
    })

}

function Update(){
    if (GameStarted && !GameOver && !GamePaused){
        UpdateSnake(board)
    }
}

function Main(deltaTime){
    window.requestAnimationFrame(Main)
    const TimeSinceLastUpdate = (deltaTime - LastFrame) / 1000;
    if (TimeSinceLastUpdate < 1 / SnakeSpeed) return;
    LastFrame = deltaTime
    Update();
}


const Snake = () => {

    useEffect(() => {
        board = document.getElementById("snake-game")
        InitializeBoard(board)
        window.requestAnimationFrame(Main)
        window.addEventListener('keyup', e=>{
            switch(e.key){
                case " ":
                    SnakeSpeed = 7;
                    break
            }
        })
        window.addEventListener('keydown', e =>{
            switch(e.key){
                case "ArrowUp":
                case "w":
                    if (Direction != LastDirection && Direction.y !== 1)
                        DirectionQueue = {x: 0, y: -1}
                    if (LastDirection.y !== 1)
                        Direction = {x: 0, y: -1}
                    break
                case "ArrowDown":
                case "s":
                    if (Direction != LastDirection && Direction.y !== -1)
                        DirectionQueue = {x: 0, y: 1}
                    if (LastDirection.y !== -1)
                        Direction = {x: 0, y: 1}
                    break
                case "ArrowLeft":
                case "a":
                    if (Direction != LastDirection && Direction.x !== 1)
                        DirectionQueue = {x: -1, y: 0}
                    if (LastDirection.x !== 1)
                        Direction = {x: -1, y: 0}
                    break
                case "ArrowRight":
                case "d":
                    if (Direction != LastDirection && Direction.x !== -1)
                        DirectionQueue = {x: 1, y: 0}
                    if (LastDirection.x !== -1)
                        Direction = {x: 1, y: 0}
                    break
                case " ":
                    SnakeSpeed = 15
                    break

            }
            GameStarted = true;
        })
        
    }, [])
    
    return (
        <div className="text-zinc-200" >
            <Head>
                <title>Snake</title>
                <meta name="description" content="Generated by create next app" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div className="bg-primary h-screen w-screen flex justify-center items-center" >
                <div id="snake-game" className="snake-game shadow-md border-secondary border-4" >

                </div>
                { !GameStarted &&
                <div className="fixed snake-game-overlay text-center flex items-center">
                    <p className="w-full ">
                        Press any key to start.
                        <br/>
                        <br/>
                        <br/>
                        <br/>
                    </p>
                    
                </div>
                }   
            </div>
        </div>
    )
}

export default Snake