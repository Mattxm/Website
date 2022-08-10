import { IoIosHome, IoIosBook, IoIosCalculator, IoIosMail } from "react-icons/io";
import Link from 'next/link.js'
import { useRouter } from "next/router";


const SideBar = () => {
    const router = useRouter();
    return (
        <div className={" select-none sidebar ".concat(router.pathname == "/reader/[albumID]" && "-translate-x-full")}>

            <SideBarIcon link="/" text="Home" icon={<IoIosHome size="30px" />} />
            <SideBarIcon link="/reader" text="Reader" icon={<IoIosBook size="30px" />} />
            <SideBarIcon link="/calculator" text="Calculator" icon={<IoIosCalculator size="30px" />} />
            
            <span className="flex-1"/>
            <SideBarIcon link="mailto:mattxm@live.com" text="Message" icon={<IoIosMail size="30px" />} />
            

        </div>
    );
};

const SideBarIcon = ({ link, icon, text }) => {
    const router = useRouter();
    return(
    <Link href={link}>
        <div className={"sidebar-icon group ".concat(router.pathname == link && "rounded-xl")}>
            
            {icon}
            <span className="sidebar-tooltip group-hover:opacity-100 pointer-events-none">
                {text}
            </span>
        </div>
    </Link>
    )
};

export default SideBar;