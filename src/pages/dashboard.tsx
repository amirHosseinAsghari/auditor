import React, {useState, useCallback, useEffect} from "react";
import {useSelector} from "react-redux";
import {RootState} from "@/store/store";
import {useLocation, useNavigate} from "react-router-dom";
import useReports from "@/api/reports/useReports";
import {Report} from "@/api/reports/reports";
import {useDeleteReport} from "@/api/reports/reportMutations";
import Button from "@/components/button";

const Dashboard: React.FC = () => {
    const {role} = useSelector((state: RootState) => state.auth);
    const location = useLocation();
    const navigate = useNavigate();

    const status: string =
        new URLSearchParams(location.search).get("status") || "new";
    const page: number = parseInt(
        new URLSearchParams(location.search).get("page") || "1"
    );

    const {
        data: reports,
        isLoading,
        error,
    } = useReports(page, status === "new" ? undefined : status);
 

    const [contextMenu, setContextMenu] = useState<{
        x: number;
        y: number;
        reportId: number;
    } | null>(null);

    const handleTabChange = (tab: string) => {
        if (tab === "new") {
            navigate(`?page=${page}`, {replace: true});
        } else {
            navigate(`?status=${tab}&page=${page}`, {replace: true});
        }
    };

    const handleRightClick = (event: React.MouseEvent, reportId: number) => {
        event.preventDefault();
        setContextMenu({x: event.clientX, y: event.clientY, reportId});
    };

    const handleClickOutside = useCallback(
        (event: MouseEvent) => {
            const target = event.target as Element;
            if (contextMenu && !target.closest(".context-menu")) {
                setContextMenu(null);
            }
        },
        [contextMenu]
    );

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [handleClickOutside]);


    const renderTabs = () => (
        <div className="flex gap-2 justify-start items-start">
            {["new", "approved", "rejected"].map((tab) => (
                <button
                    key={tab}
                    className={`px-4 py-3 rounded-[10px] border focus:outline-none transition-colors duration-300 text-sm font-medium ${
                        status === tab
                            ? "bg-primary-dark text-white border-primary-dark"
                            : "border-gray-300 bg-primary text-white"
                    }`}
                    onClick={() => handleTabChange(tab)}
                >
                    {tab === "new" && "گزارش های جدید"}
                    {tab === "approved" && "گزارش های تایید شده"}
                    {tab === "rejected" && "گزارش های رد شده"}
                </button>
            ))}
        </div>
    );

    const renderReports = () => {
        if (isLoading) {
            return (
                <div className="container after:!bg-primary before:!bg-primary">
                    <div className="dot !bg-primary"></div>
                </div>
            );
        }

        if (error) {
            if ((error as any).response.status === 404) {
                return <p className="font-medium text-base">گزارشی موجود نیست.</p>;
            }
            return (
                <div className="text-center text-red-600">خطا در بارگذاری گزارش‌ها</div>
            );
        }

        if (!reports || reports?.length === 0) {
            return <p className="font-medium text-base">گزارشی موجود نیست.</p>;
        }

        return (
            <div className="w-full flex flex-col justify-center items-center gap-2">
                {reports?.map((report: Report) => (
                    <div
                        key={report.id}
                        className="w-full cursor-pointer rounded-[10px] flex flex-col gap-3 justify-center items-start border border-[#00000040] p-4 shadow"
                        onContextMenu={(event) =>
                            handleRightClick(event, Number(report.id))
                        }
                        onClick={() => navigate(`report/${report.id}`)}
                    >
                        <div className="w-full flex justify-between items-center">
                            <h2 className="font-semibold text-xl">{report.title}</h2>
                            {role === "author" && (
                                <div
                                    className={`rounded-lg px-3 py-2 font-normal text-sm border ${
                                        report.status === "approved"
                                            ? "text-green-400 border-green-400"
                                            : status === "rejected"
                                                ? "text-red-500 border-red-500"
                                                : "text-blue-600 border-blue-600"
                                    }`}
                                >
                                    {report.status === "approved"
                                        ? "تایید شده"
                                        : report.status === "rejected"
                                            ? "رد شده"
                                            : "جدید"}
                                </div>
                            )}
                        </div>
                        <p className="w-full truncate text-base font-medium">
                            {report.description}
                        </p>
                        {/** TODO : Date format */}
                        <p className="text-sm font-normal">{report.date}</p>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="p-6 h-full flex flex-col justify-start items-start gap-7">
            {role === "auditor" ? (
                renderTabs()
            ) : (
                <Button
                    type="button"
                    label={"افزودن گزارش"}
                    variant="primary"
                    onClick={() => navigate("report/new")}
                />
            )}
            {renderReports()}
        </div>
    );
};

export default Dashboard;
