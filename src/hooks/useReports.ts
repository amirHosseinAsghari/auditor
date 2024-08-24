import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import {selectReports} from "@/store/features/reports/reportsSlice.ts";

export const useReports = () => {
    const reportsState = useSelector(selectReports)

    return useMemo(() => (reportsState), [reportsState])
}
