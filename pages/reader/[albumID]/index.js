import { IoReturnUpForwardSharp } from "react-icons/io5";
import { TbRelationOneToOne } from "react-icons/tb";
import { MdExpand } from "react-icons/md";
import { BiExpand, BiLink } from "react-icons/bi";
// import { FiBook, FiBookOpen } from "react-icons/fi";
import { RiPagesLine, RiPageSeparator, RiFileDownloadLine } from "react-icons/ri";


import { throttle } from 'underscore';
import Image from 'next/future/image'
import {useRouter} from 'next/router';
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import Head from 'next/head'
import DownloadManager from './download';

const Album = () => {
    const router = useRouter();
    const [Copied, setCopied] = useState(false);
    const {albumID, page} = router.query;
    const [CurrentPage, setCurrentPage] = useState(1)
    const [Data, setData] = useState({});
    const [MenuOpen, setMenuOpen] = useState(true);
    const [PageScalingOption, setPageScalingOption] = useState(0);
    const [PageLayoutOption, setPageLayoutOption] = useState(0);
    const [PageFlowOption, setPageFlowOption] = useState(0);
    const [PageSpacingOption, setPageSpacingOption] = useState(0);
    const [Loaded, setLoaded] = useState(false)
    const FlowOption = useRef(PageFlowOption)
    const DataRef = useRef(Data)
    const PageRef = useRef(CurrentPage)

    useEffect(() => {
        FlowOption.current = PageFlowOption;
        if (PageFlowOption == 0 && Data.success){
            GoToPage((page ? page : CurrentPage) - 1);
        }
        else
            window.scrollTo(0,0)
    }, [PageFlowOption])

    useEffect(() => {
        if (!Data.success) return;
            GoToPage((page ? page : CurrentPage) - 1)
    }, [PageScalingOption])

    useEffect(() => {
        if (!router.isReady || !Data.success) return;
        router.replace({pathname: '/reader/[albumID]', query: {albumID: albumID, page: CurrentPage}}, undefined, {shallow: true});
        if (PageFlowOption == 1)
            window.scrollTo(0,0)
        PageRef.current = CurrentPage;
    }, [CurrentPage])

    useEffect(() => {
        if (!router.isReady) return;
        fetch("https://api.imgur.com/3/album/" + albumID, {headers: {'Authorization': 'Client-ID 14f26bd597c439e'}})
        .then(res =>{
            if (res.ok) 
                return res.json()
            else{
                setLoaded(true);
                return {}
            }
        })
        .then(res => {
            if (res.data.images_count > 0)
                setData(res)
        });
    }, [router.isReady]);

    useEffect(() => {
        DataRef.current = Data;
        if (!Data.success == true) return;
        window.addEventListener("scroll", throttle(UpdatePage, 500))
        window.addEventListener("resize", throttle(UpdatePage, 500))
        GoToPage((page ? page : CurrentPage) - 1)
        UpdateHistory();
    }, [Data])

    const UpdateHistory = () => {
        if (!DataRef.current.data) return;
        if (localStorage.getItem("rhistory")){
            const history = JSON.parse(localStorage.getItem("rhistory"));
            delete history[Data.data.id];
            const current = {...history, [Data.data.id]: {title: Data.data.title ? Data.data.title : "Untitled", cover: Data.data.images[0].link, currentpage: PageRef.current, pages: Data.data.images_count, date: Date.now()}};
            localStorage.setItem("rhistory", JSON.stringify(current));
        }
        else{
            localStorage.setItem("rhistory", JSON.stringify({[Data.data.id]: {title: Data.data.title ? Data.data.title : "Untitled", cover: Data.data.images[0].link, currentpage: PageRef.current, pages: Data.data.images_count, date: Date.now()}}))
        }
    }

    const PageNavigation = (e) => {
        const tar = e.target;
        const width = tar.offsetWidth;
        const loc = e.clientX - tar.getBoundingClientRect().left;
        UpdatePage();
        
        if (width / 2 > loc) {
            FlowOption.current == 1 ? GoToPage(CurrentPage - 2 ) : window.scrollBy({behavior: "smooth", top: -window.innerHeight}) 
        }
        else {
            FlowOption.current == 1 ? GoToPage(CurrentPage) : window.scrollBy({behavior: "smooth", top: window.innerHeight}) 
        }
    }
    
    const GoToPage = (p) => {
        p = Math.min(Math.max(p, 0), Data.data.images_count - 1)
        if (FlowOption.current == 0){
            const target = document.getElementById('Down')
            if (target != undefined)
                target.children[p].scrollIntoView(true)
        }
        else{
            setCurrentPage(p + 1)
        }
    }
    
    const UpdatePage = () => {
        if (FlowOption.current == 0){
            const top = window.visualViewport.pageTop;
            const parent = document.getElementById('Down');
            if (!parent) return;
            var closest = parent.firstChild;
            var closestID = 0;
            for (let index = 1; index < parent.childElementCount; index++) {
                if (Math.abs(parent.children[index].offsetTop - top) < Math.abs(closest.offsetTop - top)){
                    closest = parent.children[index]
                    closestID = index;
                }
            }
            setCurrentPage(closestID + 1)
            return (closestID + 1)
        }
    }


 

    return(
        <>
            <Head>
                <title>{(Data.success ? Data.data.title ? Data.data.title : "Untitled" : "Title").concat(" - Imgur Reader") }</title>
                <meta name="Imgur Reader" content="Display Imgur Albums in a customizable format." />
            </Head>
            <div className="group z-10 fixed top-0 right-0 hover:-translate-x-16 h-screen w-10 transition-all duration-300">
                <div className="reader-history h-full overflow-scroll translate-x-10 bg-secondary w-16 shadow-lg transition-all ease-linear flex flex-col">
                    {Data.success && [...Array(Data.data.images_count)].map((e,i) => 
                    <div key={i} onClick={() => GoToPage(i)} className={"flex-1 first:pt-0.5 pb-0.5  "} >
                        <div className={"h-full flex justify-center items-center transition-colors duration-100 ease-out rounded-l-md shadow-lg ml-1 hover:bg-highlight1-1 bg-primary ".concat( (i == CurrentPage - 1) && "bg-highlight1-1")}>
                            <p className={" select-none reader-page-selector-text text-white hover:text-secondary ".concat((i == CurrentPage - 1) && "text-secondary")}>{i + 1}</p>
                        </div>
                    </div>
                    
                    )}
                </div>
            </div>
            <div className={"hide-tap h-screen bg-secondary z-10 w-44 top-0 left-0 fixed shadow-lg transition-transform ease-linear".concat(!MenuOpen && " -translate-x-full")}>
                <div className="fixed group translate-x-44 h-screen w-8 cursor-pointer" onClick={()=>{setMenuOpen(!MenuOpen)}}>
                    <span className="absolute group-hover:bg-secondary left-1/2 w-2 h-1/2 transition-transform duration-300 rounded-lg translate-y-1/2   -translate-x-1/2"></span>
                </div>
                
                <div className="flex flex-col h-full p-2 overflow-scroll reader-history" >

                    <div className="reader-option-container">
                        <div className="w-full p-2 text-white">
                            <Link href={Data.success ? Data.data.link : "/reader"} >
                                <p className="text-center w-full bg-primary rounded-lg p-2 cursor-pointer" >
                                    {Data.success && Data.data.title} 
                                </p>
                            </Link>
                            
                            {/* <div className="flex pt-2">
                                <CgProfile/>
                                <p className="pl-2">{Data.success && Data.data.accountID ? Data.data.accountID : "Anonymous"}</p>
                            </div>
                            <div className="flex pt-2">
                                <CgCopy/>
                                <p className="pl-2">{Data.success && Data.data.images_count}</p>
                            </div>                             */}
                        </div>
                    </div>
                    <div className="reader-option-container-grid-split mt-2">
                        <div className="reader-option-container h-8 cursor-pointer">
                            <CopyToClipboard text={"https://mattxm.com/reader/".concat(albumID)} onCopy={() => {setCopied(true)}}>
                                <span className="w-full h-full">
                                    <HelperIcon icon={<BiLink size="20px" />} event={()=>{}}/>
                                </span>
                            </CopyToClipboard>
                        </div>
                        <div className="reader-option-container h-8 cursor-pointer" onClick={()=>{Data.success && DownloadManager(Data.data.images, Data.data.title)}}>
                            <HelperIcon icon={<RiFileDownloadLine size="20px" />} event={()=>{}}/>
                        </div>
                    </div>
                    
                    <div className="reader-option-container-grid h-40 mt-2">
                        <OptionIcon active={PageScalingOption} icon={<BiExpand size="40px" />} index={0} event={()=>{setPageScalingOption(0)}} />
                        <OptionIcon active={PageScalingOption} icon={<MdExpand size="40px" />} index={1} event={()=>{setPageScalingOption(1)}} />
                        <OptionIcon active={PageScalingOption} icon={<TbRelationOneToOne size="40px" />} index={2} event={()=>{setPageScalingOption(2)}} />
                        <OptionIcon active={PageScalingOption} icon={<MdExpand size="40px" style = {{transform: 'rotate(90deg)' }}/>} index={3} event={()=>{setPageScalingOption(3)}} />
                    </div>
                    {/* 
                    <div className="reader-option-container-grid h-20 mt-2">
                        <OptionIcon active={PageLayoutOption} icon={<FiBook size="40px" />} index={0} event={()=>{setPageLayoutOption(0)}} />
                        <OptionIcon active={PageLayoutOption} icon={<FiBookOpen size="40px" />} index={1} event={()=>{setPageLayoutOption(1)}} />
                    </div> 
                    */}
                    <div className="reader-option-container-grid h-20 mt-2">
                        <OptionIcon active={PageFlowOption} icon={<RiPageSeparator size="40px" />} index={0} event={()=>{setPageFlowOption(0)}} />
                        <OptionIcon active={PageFlowOption} icon={<RiPagesLine size="40px" />} index={1} event={()=>{setPageFlowOption(1)}} />
                    </div>
                    <div className="reader-option-container mt-2 h-8 p-2">
                        <input type="range" list="tickmarks" step="1" onChange={(e)=>{setPageSpacingOption(e.target.value)}} value={PageSpacingOption} min="0" id="PageSpacing" max="5" className="slider w-full shadow-lg appearance-none bg-primary border-secondary rounded-lg"/>
                    </div>
                    
                    <span className="flex-1"/>
                    <div onClick={()=>{UpdateHistory(); router.push("/reader")}} className="reader-option-container h-8 mt-2">                
                        <HelperIcon icon={<IoReturnUpForwardSharp size="28px" style = {{transform: 'rotate(180deg)' }}/>} event={()=>{}}/>                        
                    </div>
                    

                </div>
            </div>

            {Data.success ? 
                <div onClick={PageNavigation}>
                { PageFlowOption == 1 ?
                <div className={"select-none min-h-screen flex items-center justify-center bg-primary transition-all ".concat(MenuOpen && " pl-44")}>   
                    {
                        Data.success && <AlbumImage id={CurrentPage} scaling={PageScalingOption} layout={PageLayoutOption} flow={PageFlowOption} spacing={PageSpacingOption} 
                        link={Data.data.images[(page ? page : CurrentPage) - 1].link} width={Data.data.images[(page ? page : CurrentPage) - 1].width} height={Data.data.images[(page ? page : CurrentPage) - 1].height}/>
                    }
                </div>
                :
                    <div id="Down" className={"select-none bg-primary transition-all ".concat(MenuOpen && " pl-44")}>
                        {Data.success && Data.data.images.map((e, i) => {
                        return (<AlbumImage id={i} key={i} scaling={PageScalingOption} layout={PageLayoutOption} flow={PageFlowOption} spacing={PageSpacingOption} link={e.link} width={e.width} height={e.height} />)})}
                    </div>
                }  
                </div>
            : Loaded ?
                <div onClick={()=>{router.push({pathname: "/reader"})}} className={"flex text-center items-center justify-center text-white bg-primary h-screen "}>
                    Failed to fetch album. <br/> <br/> Click anywhere to return to search.
                </div>     
                :
                <div className={"flex text-center items-center justify-center text-white bg-primary h-screen "}>
                    <div className="loading-icon w-8 h-8"/>
                </div>     
            } 

        </>
        
    );
};

const OptionIcon = ({active, icon, index, event}) => {
    return (
        <div onClick={event} className={"reader-option-icon ".concat(index == active && "bg-secondary")}>
            {icon}
        </div>
    );
};
const HelperIcon = ({icon, event}) => {
    return (
        <div onClick={event} className="reader-option-icon-small">
            {icon}
        </div>
    );
};

const AlbumStyle = (s) => {
    switch (s){
        case 0: return "reader-default "
        case 1: return "reader-vertical "
        case 2: return "reader-natural "
        case 3: return "reader-horizontal "
        default: return "reader-default "
    }
};

const AlbumSpacing = (s) => {
    switch (s){
        case '0': return " mb-0"
        case '1': return " mb-1"
        case '2': return " mb-2"
        case '3': return " mb-3"
        case '4': return " mb-4"
        case '5': return " mb-5"
        default: return " mb-0"
    }
}

const AlbumImage = ({link, height, width, spacing, layout, scaling, flow}) => {
    return (
        <div className={"bg-primary last:mb-0 flex items-center justify-center h-full ".concat(scaling == 2 ? "overflow-auto" : "").concat(AlbumSpacing(spacing))}>
            <Image priority={true} quality={100} loading="eager" className={AlbumStyle(scaling)} src={link} width={width} height={height} />
        </div>
        
    );
};

export default Album;