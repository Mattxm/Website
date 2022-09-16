import Head from 'next/head'
import React, {useState, useEffect, useRef, KeyboardEvent} from "react"
import useInterval from '../components/useInterval'
import {IoSettingsSharp} from "react-icons/io"

const Snake = () => {
    const Board = useRef(null)

    const [SnakeSpeed, setSnakeSpeed] = useState(7)
    const [SnakeGrowthRate, setSnakeGrowthRate] = useState(1)
    const [SnakeRemainingGrowth, setSnakeRemainingGrowth] = useState(0)
    const [SnakeBody, setSnakeBody] = useState([{x:8, y:11}, {x:7, y:11}, {x:6, y:11}])
    const [Food, setFood] = useState({x:15, y:11})
    const [BoardSize, setBoardSize] = useState(21)
    
    const [Direction, setDirection] = useState({x: 1, y: 0})
    const [QueuedDirection, setQueuedDirection] = useState(null)
    const [LastDirection, setLastDirection] = useState({x: 1, y: 0})

    const [GameStarted, setGameStarted] = useState(false)
    const [GamePaused, setGamePaused] = useState(false)
    const [GameOver, setGameOver] = useState(false)

    const [LoopEdges, setLoopEdges] = useState(false)
    const [EatTail, setEatTail] = useState(false)

    useInterval(()=>{
        UpdateGame();
    }, GameStarted ? 1000 / SnakeSpeed : null)

    useEffect(() => {
        if (Board.current !== null)
            InitializeBoard();
    }, [Board.current])

    function InitializeBoard(){
        UpdateFood()
        SnakeBody.forEach(s => {
            const te = document.createElement('div');
            te.classList.add("snaketop")
            const se = document.createElement('div')
            se.style.gridRowStart = s.y
            se.style.gridColumnStart = s.x
            se.classList.add("snake")
            se.appendChild(te)
            Board.current.appendChild(se)
        })
    }

    useEffect(() => {
        UpdateFood()
    }, [Food])
    

    function UpdateFood(){
        for (const c of Board.current.children){
            if (c.className === "food")
                c.remove()
        }
        const fe = document.createElement('div')
        fe.style.gridRowStart = Food.y
        fe.style.gridColumnStart = Food.x
        fe.classList.add("food")
        Board.current.appendChild(fe)
    }

    useEffect(() => {        
        let ToRemove = new Array();
        for (const c of Board.current.children){
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
            Board.current.appendChild(se)
        })
    }, [SnakeBody])
    

    function UpdateGame() {
        if (GameStarted && !GameOver && !GamePaused){
            let Die = false
            let NewSnake = SnakeBody
            const NextX = NewSnake[0].x + Direction.x
            const NextY = NewSnake[0].y + Direction.y
            NewSnake = [{x:NextX, y:NextY}, ...NewSnake]

            setLastDirection(Direction)
            if (QueuedDirection){
                setDirection(QueuedDirection)
                setQueuedDirection(null)
            }

            if (SnakeRemainingGrowth === 0)
                NewSnake.pop();
            else
                setSnakeRemainingGrowth(SnakeRemainingGrowth - 1)
            
            let res = false
            let c = 0
            let p = NewSnake[0]
            for (let index = 1; index < NewSnake.length; index++) {
                if (p.x == NewSnake[index].x && p.y == NewSnake[index].y){
                    res = true
                }
                if (res)
                    c++
            }
            if (res){
                if (EatTail){
                    for (let index = 1; index < c; index++) {
                        NewSnake.pop()
                    }
                }
                else
                    setGameOver(true)
            }
            if (NewSnake[0].x > BoardSize){
                if (LoopEdges)
                    NewSnake[0].x = 1;
                else{
                    setGameOver(true)
                    Die = true
                }
            }
                
            if (NewSnake[0].y > BoardSize){
                if (LoopEdges)
                    NewSnake[0].y = 1;
                else{
                    setGameOver(true)
                    Die = true
                }
            }
                
            if (NewSnake[0].x < 1){
                if (LoopEdges)
                    NewSnake[0].x = BoardSize;
                else{
                    setGameOver(true)
                    Die = true
                }
            }
                
            if (NewSnake[0].y < 1){
                if (LoopEdges)
                    NewSnake[0].y = BoardSize;
                else{
                    setGameOver(true)
                    Die = true
                }
                    
            }
            
            if (NewSnake[0].y == Food.y && NewSnake[0].x == Food.x){
                setSnakeRemainingGrowth(SnakeGrowthRate + SnakeRemainingGrowth)
                let newFood = RandomGridPosition()
                while (OnSnake(newFood)){
                    newFood = RandomGridPosition()
                }
                setFood(newFood);
            }
            if (!Die)
                setSnakeBody(NewSnake)
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

    function RandomGridPosition(){
        return {
            x: Math.ceil(Math.random() * BoardSize),
            y: Math.ceil(Math.random() * BoardSize)
        }
    }

    function RestartGame(){
        setSnakeSpeed(7)
        setSnakeRemainingGrowth(0)
        setSnakeBody([{x:8, y:11}, {x:7, y:11}, {x:6, y:11}])
        setFood({x:15, y:11})
        setBoardSize(21)
        setDirection({x: 1, y: 0})
        setQueuedDirection(null)
        setLastDirection({x: 1, y: 0})
        setGameStarted(true)
        setGamePaused(false)
        setGameOver(false)
    }

    function HandleKeyDown(e){
        switch(e.keyCode){
            case 38:
            case 87:
                if (Direction != LastDirection && Direction.y != 1)
                    setQueuedDirection({x: 0, y: -1})
                else if (LastDirection.y !== 1)
                    setDirection({x: 0, y: -1})
                break
            case 40:
            case 83:
                if (Direction != LastDirection && Direction.y != -1)
                    setQueuedDirection({x: 0, y: 1})
                else if (LastDirection.y !== -1)
                    setDirection({x: 0, y: 1})
                break
            case 37:
            case 65:
                if (Direction != LastDirection && Direction.x != 1)
                    setQueuedDirection({x: -1, y: 0})
                else if (LastDirection.x !== 1)
                    setDirection({x: -1, y: 0})
                break
            case 39:
            case 68:
                if (Direction != LastDirection && Direction.x != -1)
                    setQueuedDirection({x: 1, y: 0})
                else if (LastDirection.x !== -1)
                    setDirection({x: 1, y: 0})
                break
            case 16:
            case 32:
                if (SnakeSpeed === 7)
                    setSnakeSpeed(15)
                if (GameOver)
                    RestartGame()

                break
            case 27:
                if (GameStarted)
                    setGamePaused(true)
                if (GamePaused)
                    setGamePaused(false)
                break
        }
        if (!GameStarted)
            setGameStarted(true);
    }
    
    function HandleKeyUp(e){
        switch(e.keyCode){
            case 16:
            case 32:
                if (SnakeSpeed === 15)
                    setSnakeSpeed(7)
                break
        }
    }

    return (
        <div tabIndex={-1} className="text-white focus:outline-none" onKeyUp={(e) => HandleKeyUp(e)} onKeyDown={(e) => HandleKeyDown(e)}>
            <Head>
                <title>Snake</title>
                <meta name="description" content="Generated by create next app" />
                <link rel="icon" href="snake.svg"/>
            </Head>
            <div className="bg-primary h-screen w-screen flex justify-center items-center" >
                <div ref={Board} id="snake-game" className="snake-game shadow-md border-secondary border-4" >

                </div>
                    
                    <div className="fixed snake-game-overlay pointer-events-none">
                        {!GameStarted &&
                        <p className="pt-8 w-full h-full text-center">
                            Press any key to start.
                        </p>
                        }
                        {(GamePaused || GameOver) &&
                        <div>
                            <div className="fixed top-0 right-0">
                                <IoSettingsSharp/>
                            </div>

                            <p className="pt-8 w-full h-full text-center">
                                {GameOver ? "Game Over" : "Game Paused"}
                                <br/>
                                Score: {SnakeBody.length}
                                <br/>
                                {GameOver && "Spacebar to restart"}
                            </p>
                        </div>
                        }
                    </div>
                    
            </div>
        </div>
    )
}

export default Snake