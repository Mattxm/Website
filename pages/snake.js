import Head from 'next/head'
import React, {useState, useEffect, useRef, KeyboardEvent} from "react"
import { Switch, RadioGroup } from '@headlessui/react'
import useInterval from '../components/useInterval'
import {RiSettings5Fill} from "react-icons/ri"
import lerp from "../components/lerp"

const Snake = () => {
    const Board = useRef(null)

    const [SnakeRemainingGrowth, setSnakeRemainingGrowth] = useState(0)
    const [SnakeBody, setSnakeBody] = useState([{x:8, y:11}, {x:7, y:11}, {x:6, y:11}])
    const [Food, setFood] = useState({x:15, y:11})
    const [SnakeSpeedBoostActive, setSnakeSpeedBoostActive] = useState(false)
    
    const [Direction, setDirection] = useState({x: 1, y: 0})
    const [QueuedDirection, setQueuedDirection] = useState(null)
    const [LastDirection, setLastDirection] = useState({x: 1, y: 0})

    const [GameStarted, setGameStarted] = useState(false)
    const [GamePaused, setGamePaused] = useState(false)
    const [GameOver, setGameOver] = useState(false)

    const [SnakeSpeed, setSnakeSpeed] = useState(7)
    const [SnakeGrowthRate, setSnakeGrowthRate] = useState(1)
    const [LoopEdges, setLoopEdges] = useState(false)
    const [EatTail, setEatTail] = useState(false)
    const [BoardSize, setBoardSize] = useState(21)
    const [SnakeBoost, setSnakeBoost] = useState(5)
    const [OptionsOpen, setOptionsOpen] = useState(false)

    useEffect(() => {
      if (GameStarted || !GameOver || !GamePaused)
        setOptionsOpen(false)
    }, [GamePaused, GameOver, GameStarted])
    

    useInterval(()=>{
        UpdateGame();
    }, GameStarted ? (1000 / ( SnakeSpeedBoostActive ? SnakeSpeed + SnakeBoost : SnakeSpeed)) : null)

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

        let sbl = SnakeBody.length;
        SnakeBody.forEach((s,i) => {
            let c = lerp(40,75, i/sbl)
            const te = document.createElement('div')
            te.classList.add(i == 0 ? "snakehead" : "snaketop")
            te.style.backgroundColor = `hsl(95deg,80%,${c}%)`
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
                    for (let index = 1; index <= c; index++) {
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
        setSnakeSpeedBoostActive(false)
        setSnakeRemainingGrowth(0)
        setSnakeBody([{x:8, y:11}, {x:7, y:11}, {x:6, y:11}])
        setFood({x:15, y:11})
        setDirection({x: 1, y: 0})
        setQueuedDirection(null)
        setLastDirection({x: 1, y: 0})
        setGameStarted(false)
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
                if (!SnakeSpeedBoostActive)
                    setSnakeSpeedBoostActive(true)
                if (GameOver)
                    RestartGame()

                break
            case 27:
                if (OptionsOpen){
                    setOptionsOpen(false)
                    break
                }
                    
                if (GameStarted)
                    setGamePaused(true)
                if (GamePaused)
                    setGamePaused(false)
                break
        }
        if (!GameStarted && !OptionsOpen)
            setGameStarted(true);
    }
    
    function HandleKeyUp(e){
        switch(e.keyCode){
            case 16:
            case 32:
                if (SnakeSpeedBoostActive)
                    setSnakeSpeedBoostActive(false)
                break
        }
    }

    return (
        <div tabIndex={-1} className="text-white select-none focus:outline-none" onKeyUp={(e) => HandleKeyUp(e)} onKeyDown={(e) => HandleKeyDown(e)}>
            <Head>
                <title>Snake</title>
                <meta name="description" content="Generated by create next app" />
                <link rel="icon" href="snake.svg"/>
            </Head>
            <div className="bg-primary h-screen w-screen flex justify-center items-center" >
                <div ref={Board} id="snake-game" className="snake-game shadow-md border-secondary border-4" >
                </div>
                <div className="fixed snake-game-overlay flex items-center justify-center">
                    {(!GameStarted && !OptionsOpen)  &&
                    <p className="text-xl text-left h-full pt-16">
                        WASD or ↑←↓→ to Turn
                        <br/>
                        Space or Shift to Accelerate
                        <br/>
                        Escape to Pause
                        <br/><br/>
                        Press any key to start.
                    </p>
                    }
                    {
                        (GamePaused || GameOver || !GameStarted) && 
                        <div className="absolute top-3 right-3" onClick={()=>{setOptionsOpen(!OptionsOpen)}}>
                            <RiSettings5Fill className="hard-shadow-md hover:scale-105 transition-all ease-linear" size={50}/>
                        </div>
                    }
                    {((GamePaused || GameOver) && !OptionsOpen) &&
                    <div className="flex flex-col items-center">
                        { !GameOver &&<p className="absolute mb-2 bottom-0 w-full text-right mr-7 text-2xl" >Score: {SnakeBody.length}</p>}
                        <p>{ GameOver ? "Game Over" : "Game Paused"}</p>
                        { GameOver && <p>Final Score: {SnakeBody.length}</p>}
                        <span className="pb-4"/>
                        {!GameOver && 
                        <div onClick={()=> setGamePaused(false)} className="mb-4 w-48 bg-thirdary hover:bg-red-400 transition-colors ease-linear h-12 rounded-sm outline-2 hard-shadow-md outline-thirdary outline text-center" >
                            Resume
                        </div>
                        }
                        
                        <div onClick={()=> RestartGame()} className="w-48 bg-thirdary hover:bg-red-400 transition-colors ease-linear h-12 rounded-sm outline-2 hard-shadow-md outline-thirdary outline text-center" >
                            Restart
                        </div>
                    </div>
                    }
                    {OptionsOpen &&
                    <div className="text-xl w-full h-full bg-thirdary bg-opacity-25 flex justify-center items-center">
                        <div className=''>
                            <div className="flex align-middle items-center" >
                                <p className="flex-1" >Eat Tail</p>
                                <Switch checked={EatTail} onChange={setEatTail} 
                                className={`${ EatTail ? ' bg-red-400' : 'bg-thirdary'} 
                                relative inline-flex h-6 w-9 items-center rounded-sm hard-shadow-md transition-colors`}
                                >
                                    <span className="sr-only">Eat Tail</span>
                                    <span className={`${ EatTail ? 'translate-x-4' : 'translate-x-1'} 
                                    inline-block h-4 w-4 transform rounded-sm bg-white transition`}
                                    />
                                </Switch>
                            </div>
                            <br/>
                            <div className="flex align-middle items-center" >
                                <p className="flex-1" >Loop Edges</p>
                                <Switch checked={LoopEdges} onChange={setLoopEdges} 
                                className={`${ LoopEdges ? ' bg-red-400' : 'bg-thirdary'} 
                                relative inline-flex h-6 w-9 items-center rounded-sm hard-shadow-md transition-colors`}
                                >
                                    <span className="sr-only">Eat Tail</span>
                                    <span className={`${ LoopEdges ? 'translate-x-4' : 'translate-x-1'} 
                                    inline-block h-4 w-4 transform rounded-sm bg-white transition`}
                                    />
                                </Switch>
                            </div>
                            <br/>
                            <p>Snake Speed</p>
                            <RadioGroup value={SnakeSpeed} onChange={setSnakeSpeed} className="flex space-x-3">
                                <RadioGroup.Option value={5}>
                                    {({ checked }) => (
                                    <span className={`${checked ? 'bg-red-400' : ''} w-full bg-thirdary rounded-sm px-1 hard-shadow-md transition-colors ease-linear`}>Slow</span>
                                    )}
                                </RadioGroup.Option>
                                <RadioGroup.Option value={7}>
                                    {({ checked }) => (
                                    <span className={`${checked ? 'bg-red-400' : ''} w-full bg-thirdary rounded-sm px-1 hard-shadow-md transition-colors ease-linear`}>Fair</span>
                                    )}
                                </RadioGroup.Option>
                                <RadioGroup.Option value={10}>
                                    {({ checked }) => (
                                    <span className={`${checked ? 'bg-red-400' : ''} w-full bg-thirdary rounded-sm px-1 hard-shadow-md transition-colors ease-linear`}>Fast</span>
                                    )}
                                </RadioGroup.Option>
                            </RadioGroup>
                            <br/>
                            <p>Growth Rate</p>
                            <RadioGroup value={SnakeGrowthRate} onChange={setSnakeGrowthRate} className="flex space-x-2 w-full">
                                <RadioGroup.Option value={1}>
                                    {({ checked }) => (
                                    <span className={`${checked ? 'bg-red-400' : ''}  bg-thirdary rounded-sm px-2 hard-shadow-md transition-colors ease-linear`}>1</span>
                                    )}
                                </RadioGroup.Option>
                                <RadioGroup.Option value={2}>
                                    {({ checked }) => (
                                    <span className={`${checked ? 'bg-red-400' : ''}  bg-thirdary rounded-sm px-2 hard-shadow-md transition-colors ease-linear`}>2</span>
                                    )}
                                </RadioGroup.Option>
                                <RadioGroup.Option value={3}>
                                    {({ checked }) => (
                                    <span className={`${checked ? 'bg-red-400' : ''} bg-thirdary rounded-sm px-2 hard-shadow-md transition-colors ease-linear`}>3</span>
                                    )}
                                </RadioGroup.Option>
                                <RadioGroup.Option value={4}>
                                    {({ checked }) => (
                                    <span className={`${checked ? 'bg-red-400' : ''} bg-thirdary rounded-sm px-2 hard-shadow-md transition-colors ease-linear`}>4</span>
                                    )}
                                </RadioGroup.Option>
                                <RadioGroup.Option value={5}>
                                    {({ checked }) => (
                                    <span className={`${checked ? 'bg-red-400' : ''} bg-thirdary rounded-sm px-2 hard-shadow-md transition-colors ease-linear`}>5</span>
                                    )}
                                </RadioGroup.Option>
                            </RadioGroup>

                        </div>
                    </div>
                    }
                </div>
                    
            </div>
        </div>
    )
}
// Snake Speed
//                         [Slow, Medium, Fast]
//                         Loop Edges /
//                         Eat Tail /
//                         Growth Rate *------
export default Snake