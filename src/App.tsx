import styles from "./App.module.css";
import { Avatar, AvatarFallback, AvatarImage } from "@/@/components/ui/avatar";
import {Separator} from "@/@/components/ui/separator.tsx";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/@/components/ui/popover"
import Controls from "@/@/components/plus/controls.tsx";
import {PrivateOutlet} from "@/utils/PrivateOutlet.tsx";
import {Outlet, Route, Routes} from "react-router-dom";
import Login from "@/routes/login/login.tsx";
import ReportsList from "@/routes/reportsList/reportsList.tsx";
import Report from "@/routes/report/report.tsx";


function RealApp(){
    return(
        <>
            <div className={styles.topBar}>
                <Popover>
                    <PopoverTrigger>
                        <Avatar className="w-[40px]">
                            <AvatarImage src=""/>
                            <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                    </PopoverTrigger>
                    <PopoverContent className="w-[130px] ml-2">
                        Hello
                    </PopoverContent>
                </Popover>
                <div className={styles.logo}>
                    <div>Apa Logo</div>
                    <Separator orientation={"vertical"} className="bg-amber-400"/>
                    <div>meow</div>
                </div>
            </div>
            <div className={styles.main}>
                <Controls />
                <Outlet/>
            </div>
        </>
    );
}
export default function App() {
    return(
        <Routes>
            <Route path="/login" element={<Login/>}/>
            <Route path="/" element={<PrivateOutlet/>}>
                <Route element={<RealApp/>}>
                    <Route path="/reports?" element={<ReportsList/>}></Route>
                    <Route path="/report/:reportId" element={<Report/>}/>
                </Route>
            </Route>
        </Routes>
    )

}