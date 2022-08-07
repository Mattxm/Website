import SideBar from "./SideBar";
import { useRouter } from "next/router";

const Layout = ({children}) => {
    const router = useRouter();
    return (
    <>
        <SideBar/>
        <div className={"leading-none py-0 pr-0".concat(router.pathname !== "/reader/[albumID]" && " pl-16")}>
            {children}
        </div>
    </>
    );
};
export default Layout;