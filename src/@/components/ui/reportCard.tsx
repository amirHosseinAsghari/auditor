import styles from "./reportCard.module.css"
import {Report} from "@/store/features/reports/reportsSlice.ts";
import {Link} from "react-router-dom";
function ReportStatus(){
    return(
        <div></div>
    )
}
export default function ReportCard({props}: {props: Report}) {
    return(
        <Link to={"/report/"+props.id.toString()} className={styles.reportCardContainer}>
            <div className={styles.infoAndDateContainer}>
                <div className={styles.titleAndDescription}>
                    <div>{props.title}</div>
                    <div>{props.description}</div>
                </div>
                <div className={styles.date}>{props.date}</div>
            </div>
            <div className={styles.reportStatus}>

            </div>
        </Link>
    );
}