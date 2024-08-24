import styles from "./reportsList.module.css"
import ReportCard from "@/@/components/ui/reportCard.tsx";
import {useReports} from "@/hooks/useReports.ts";

export default function ReportsList(){
    // TODO add initial reports from API
    const reportsState = useReports();
    console.log(reportsState.reports)
    return(
        <div className={styles.reportsListContainer}>
            {
                reportsState.reports.map((report) =>
                    <ReportCard key={report.id} props={report}/>
                )
            }
        </div>
    )
}