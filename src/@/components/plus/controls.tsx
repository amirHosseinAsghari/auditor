import styles from "./controls.module.css";
import {Button} from "@/@/components/ui/button.tsx";
import {AuthState, userType} from "@/store/features/auth/authSlice.ts";
import {useAuth} from "@/hooks/useAuth.ts";
import {useReports} from "@/hooks/useReports.ts";
import {useLocation, Link} from "react-router-dom";

function RealPagination() {
    const pageCurrent = useReports().page;
    const pageSize = useReports().pageSize;
    const location = useLocation();
    return (
        <div className={styles.pagination}>
            <Link to={`/reports?page=${pageCurrent < pageSize! ? pageCurrent + 1 : location}`}>
                <Button variant={"outline"}>
                    <div>{`<`}</div>
                    <div>بعدی</div>
                </Button>
            </Link>
            <Link to={`/reports?page=${pageCurrent > 1 ? pageCurrent - 1 : location}`}>
                <Button variant={"outline"}>
                    <div>قبلی</div>
                    <div>{`>`}</div>
                </Button>
            </Link>

        </div>
    )
}

function AuthorControls() {


    return (
        <div className={styles.controlsAndFunctionalities}>
            <Button className="w-[96px]">گزارش جدید</Button>
            <RealPagination/>
        </div>
    )
}

function AuditorControls() {
    return (
        <div>Auditor Controls</div>
    )
}

export default function Controls() {
    // TODO controls are different based on the userType make sure you give the write controls
    const auth: AuthState = useAuth();
    if (auth.usertype === userType.AUTHOR) {
        return <AuthorControls/>;
    } else if (auth.usertype === userType.AUDITOR) {
        return <AuditorControls/>;
    } else {
        throw new Error("Meow Meow")
    }
}