import React, { useEffect, useState, useCallback, useRef } from "react";
import { batch_advisory_details, advisory_ids_for_branch } from "../api_calls/release_calls";
import { AdvisoryTable } from "../dashboard/AdvisoryTable";
import { useRouter } from 'next/router';

function ReleaseBranchDetail(props) {
    const [branchData, setBranchData] = useState(null);
    const [overviewTableData, setOverviewTableData] = useState(undefined);
    const [advisoryDetails, setAdvisoryDetails] = useState(undefined);
    const [current, setCurrent] = useState(undefined);
    const [currentJira, setCurrentJira] = useState(undefined);
    const router = useRouter();
    const [currentPage, setCurrentPage] = useState(null);
    const [isRouterReady, setIsRouterReady] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [loadedBranch, setLoadedBranch] = useState(null);

    const FIXED_ORDER = ["Extras", "Image", "Metadata", "Microshift", "Rpm"];

    const generateDataForEachAdvisory = useCallback(() => {
        setAdvisoryDetails([]);
        const advisoryIds = overviewTableData.map((data) => data.id);

        batch_advisory_details(advisoryIds)
            .then((response) => {
                const batchData = response["data"];
                const advisories_data = overviewTableData.map((data) => {
                    const entry = batchData?.[data.id];
                    if (!entry || entry["status"] === "error") {
                        return {
                            type: data.type,
                            error: entry?.["message"] || "Failed to load advisory data",
                            errata_id: data.id,
                        };
                    }
                    if (entry["data"]) {
                        return {
                            advisory_details: entry["data"]["advisory_details"],
                            bug_details: entry["data"]["bugs"],
                            bug_summary: entry["data"]["bug_summary"],
                            type: data.type,
                        };
                    }
                    return null;
                }).filter(item => item !== null);

                advisories_data.sort((a, b) => {
                    return FIXED_ORDER.indexOf(a.type) - FIXED_ORDER.indexOf(b.type);
                });
                setAdvisoryDetails(advisories_data);
            })
            .catch(() => {
                const errorRows = overviewTableData.map((data) => ({
                    type: data.type,
                    error: "Network error — could not reach the server",
                    errata_id: data.id,
                }));
                setAdvisoryDetails(errorRows);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [overviewTableData]);

    const loadVersionData = useCallback((data, page) => {
        const versionKeys = Object.keys(data);
        const currentVersionKey = versionKeys[page - 1];
        if (!currentVersionKey) return;

        setCurrentJira(data[currentVersionKey][1]);

        const tableData = Object.entries(data[currentVersionKey][0]).map(([type, id]) => ({
            type: type,
            id: id,
            advisory_link: "https://errata.devel.redhat.com/advisory/" + id
        }));
        setOverviewTableData(tableData);
        setCurrent(currentVersionKey);
    }, []);

    const getBranchData = useCallback(async (branch, page) => {
        if (!branch || page === undefined) return;

        setIsLoading(true);

        try {
            const data = await advisory_ids_for_branch(branch);
            setBranchData(data);
            setLoadedBranch(branch);

            const versionKeys = Object.keys(data);
            if (props.onVersionList) {
                props.onVersionList(versionKeys);
            }

            loadVersionData(data, page);
        } catch (error) {
            console.error('Error fetching data:', error);
            setIsLoading(false);
        }
    }, [loadVersionData, props.onVersionList]);

    const handleVersionSelect = useCallback((versionKey) => {
        if (!branchData) return;
        const versionKeys = Object.keys(branchData);
        const pageIndex = versionKeys.indexOf(versionKey);
        if (pageIndex === -1) return;

        const newPage = pageIndex + 1;
        router.replace({
            pathname: router.pathname,
            query: { ...router.query, page: newPage }
        }, undefined, { shallow: true });
    }, [branchData, router]);

    useEffect(() => {
        if (props.onVersionSelect) {
            props.onVersionSelect(handleVersionSelect);
        }
    }, [handleVersionSelect]);

    useEffect(() => {
        if (!router.isReady) return;
        setIsRouterReady(true);
        const newPage = parseInt(router.query.page, 10);
        setCurrentPage(!isNaN(newPage) ? newPage : 1);
    }, [router.isReady, router.query.page]);

    useEffect(() => {
        if (props.branch && currentPage !== null && isRouterReady) {
            if (branchData && loadedBranch === props.branch) {
                setIsLoading(true);
                loadVersionData(branchData, currentPage);
            } else {
                getBranchData(props.branch, currentPage);
            }
        }
    }, [props.branch, currentPage, isRouterReady]);

    useEffect(() => {
        if (current && overviewTableData) {
            generateDataForEachAdvisory();
        }
    }, [current, overviewTableData]);

    const tableData = React.useMemo(() => {
        if (!advisoryDetails || advisoryDetails.length === 0) return [];

        return advisoryDetails.map((data) => {
            if (data.error) {
                return {
                    advisory_type: data.type,
                    errata_id: data.errata_id,
                    error: data.error,
                };
            }
            const details = data.advisory_details[0];
            return {
                advisory_type: data.type,
                errata_id: details.id,
                advisory_type_main: details.advisory_type,
                status: details.status,
                publish_date: details.publish_date,
                synopsis: details.synopsis,
                doc_complete: details.doc_complete,
                doc_reviewer_realname: details.doc_reviewer_details?.realname || "Not Available",
                security_approved: details.security_approved,
                product_security_reviewer_realname: details.product_security_reviewer_details?.realname || "Not Available",
                bug_summary: data.bug_summary,
            };
        });
    }, [advisoryDetails]);

    useEffect(() => {
        if (props.onVersionInfo && current) {
            props.onVersionInfo({ current, jiraKey: currentJira });
        }
    }, [current, currentJira]);

    return (
        <div className="flex-1 overflow-auto px-5 py-4">
            <AdvisoryTable data={tableData} loading={isLoading} />
        </div>
    );
}

export default ReleaseBranchDetail;
