import Link from 'next/link.js'
import { useState, Fragment, useEffect, useRef } from 'react';
import {AiOutlineFileSearch, AiFillCloseCircle} from "react-icons/ai"
import {BsFillQuestionDiamondFill} from "react-icons/bs"
import { Dialog, Transition, Tab } from '@headlessui/react'
import {BsFillBookFill} from "react-icons/bs"
import { object } from 'underscore';
import { useRouter } from 'next/router';
import Head from 'next/head';

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
  }

const Reader = () => {
    const router = useRouter();
    const [SearchText, setSearchText] = useState("")
    const [InfoOpen, setInfoOpen] = useState(false)
    const [History, setHistory] = useState({})
    const [Loaded, setLoaded] = useState(false)
    const [ErrorText, setErrorText] = useState("")

    useEffect(() => {
        if (localStorage.getItem("rhistory")){
            setHistory(JSON.parse(localStorage.getItem("rhistory")))
        }
        setLoaded(true)
    }, [])

    useEffect(() => {
        if (Loaded)
            localStorage.setItem("rhistory", JSON.stringify(History))
    }, [History, Loaded])

    const CreateHistory = () => {
        if (Object.keys(History).length > 0){
            let temp = []
            for (const [k,v] of Object.entries(History)) {
                temp.push(
                <div key={v.date} className="flex mb-2">
                    <div onClick={()=>Search(k, v.currentpage)} className="flex h-10 bg-secondary rounded-l-md w-64 sm:w-96 last:mb-0 p-2 hover:bg-zinc-900 transition-colors ease-linear duration-100 flex-1" >
                        <p className="flex-1 overflow-hidden" >{v.title}</p>
                        <p>{v.currentpage}/{v.pages}</p>
                    </div>
                    <AiFillCloseCircle size={25} className="bg-secondary pr-2 h-10 rounded-r-md" onClick={()=>{setHistory(c=>{const copy = {...c}; delete copy[k]; return copy})}} />
                </div>
                )
            }  
            return temp.reverse()
        }
        else
            return <div className="text-center">Your history will appear here.</div>
    }

    const Search = (code, page) => {
        code = code.replace(/\s/g, ''); 
        const link = code.split("/")
        code = link[link.length-1]
        if (code.length){
            fetch("https://api.imgur.com/3/album/" + code, {headers: {'Authorization': 'Client-ID 14f26bd597c439e'}})
            .then(res => {
                if (res.ok)
                    router.push(`/reader/${code}?page=${page}`)
                else
                    setErrorText("Error: Album not found");
            })
            .catch(err => {
                console.log(err)
            })
        }
        else
            setErrorText("Enter an Imgur link or ID.")
    }

    return (
        <> 
            <Head>
                <title>Album Reader</title>
                <meta name="description" content="Album Reader" />
                <link rel="icon" href="book.png" />
            </Head>

            <Transition appear show={InfoOpen} as={Fragment} >
                <Dialog as="div" className="relative z-10" onClose={()=>setInfoOpen(false)}>
                    <Transition.Child as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-secondary bg-opacity-75" />
                    </Transition.Child>
                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-200"
                            enterFrom="opacity-0 scale-50"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-100"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-50"
                        >
                            <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle transition-all">
                            <Dialog.Title className="text-lg font-medium leading-6 text-secondary">
                                What is this app?
                            </Dialog.Title>
                            <div className="mt-2 text-secondary">
                                <p className="">
                                    Album Reader is an app that reformats Imgur albums with customizable settings, a page selector, and more! Similar to other manga & comic reading apps.
                                </p>
                                <br/>
                                <p>
                                    Click the sample section below for an album to test the functionality. 
                                </p>
                                <br/>
                                <p>
                                    Disclaimer: This app does not host any of the images itself. All images are supplied through Imgur&apos;s API. 
                                </p>
                            </div>

                            <div className="fixed top-0 right-0 p-2">
                                <button type="button" onClick={()=>{setInfoOpen(false)}}
                                className="rounded-full bg-primary text-white p-0.5 border-none focus:outline-none focus-visible:ring-2 focus-visible:ring-red-700 focus-visible:ring-offset-2"
                                >
                                <AiFillCloseCircle className="hover:text-highlight1-1 transition-colors" size={35}/>
                                </button>
                            </div>
                            </Dialog.Panel>
                        </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>


            <div className="bg-primary min-h-screen flex flex-col justify-center items-center selection:bg-highlight1-1">
            
                <div className="flex justify-center items-center text-white text-4xl mb-4 w-64 sm:w-96 px-2">
                    <p className="flex-1 select-none ">Album Reader</p>
                    <BsFillQuestionDiamondFill onClick={()=>{setInfoOpen(true)}} className="hover:scale-110 transition-transform ease-linear" size={35}/>
                </div>
                <div  className="flex justify-center items-center bg-secondary p-2 rounded-lg w-64 sm:w-96">
                    <input placeholder="Paste an Imgur album link or ID" 
                    className=" no-underline border-none outline-none whitespace-nowrap text-secondary overflow-hidden w-full rounded-l-md px-2 h-10" 
                    onKeyDown={k => k.key === "Enter" && Search(SearchText, 1)}
                    autoFocus={true} value={SearchText} onChange={t => setSearchText(t.target.value)}
                    />
                    <button onClick={()=>Search(SearchText, 1)}
                    className="bg-white rounded-r-md h-10"             
                    ><AiOutlineFileSearch className="text-secondary hover:text-red-700 transition-colors ease-in-out duration-200"  size="35"/></button>
                </div>

                <div className="h-8 mt-2 text-center text-red-300">
                    {ErrorText}
                </div>
                
                <div className="bg-primary w-full flex flex-col justify-center items-center">
                    <Tab.Group>
                        <Tab.List className="text-white w-64 sm:w-96 flex space-x-2 select-none">
                            <Tab 
                            className={({selected}) => classNames(" transition-colors ease-linear duration-100 w-full bg-secondary rounded-md p-2", selected ? "bg-white text-secondary" : "hover:bg-zinc-900")}
                            >History</Tab>
                            <Tab 
                            className={({selected}) => classNames(" transition-colors ease-linear duration-100 w-full bg-secondary rounded-md p-2", selected ? "bg-white text-secondary" : "hover:bg-zinc-900")} 
                            >Sample</Tab>
                        </Tab.List>
                    
                        <Tab.Panels className="mt-4 h-72 w-64 sm:w-96 text-white select-none ">
                            <Tab.Panel className="overflow-scroll reader-history">
                                { CreateHistory() }
                            </Tab.Panel>
                            <Tab.Panel className="flex sm:space-x-2 flex-col sm:flex-row sm:space-y-0 space-y-2">
                                <Link href="/reader/lmfeCdh">
                                    <div className="w-full bg-secondary hover:bg-zinc-900 rounded-md text-left p-2 flex flex-col" >
                                        Comic 
                                        <p className="text-left text-sm mt-1 flex-1">Read left to right.</p><p>Adventure</p>
                                    </div>
                                </Link>
                                <Link href="/reader/Wht7z">
                                    <div className="w-full bg-secondary hover:bg-zinc-900 rounded-md text-left p-2 flex flex-col" >
                                        Manga 
                                        <p className="text-left text-sm mt-1 flex-1">Read right to left.</p><p>Horror</p>
                                    </div>
                                </Link>
                                <Link href="/reader/IUxr6ag">
                                    <div className="w-full bg-secondary hover:bg-zinc-900 rounded-md text-left p-2 flex flex-col" >
                                        Manhwa 
                                        <p className="text-left text-sm mt-1 flex-1">Read top to bottom.</p><p>Action</p>
                                    </div>
                                </Link>

                            </Tab.Panel>
                        </Tab.Panels>
                    </Tab.Group>
                </div>

            </div>

            
        </>
        
    );
};
export default Reader;