import React, { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { DashboardLayout } from "../../../components/dashboard/DashboardLayout";
import { TopBar } from "../../../components/dashboard/TopBar";
import ReleaseBranchDetail from "../../../components/release/release_branch_detail";
import { gaVersion } from "../../../components/api_calls/release_calls";

function ReleaseHomePage() {
    const router = useRouter();
    const { releaseVersion } = router.query;
    const [gaVersionValue, setGaVersion] = useState(null);
    const [versionInfo, setVersionInfo] = useState({
        current: undefined,
        jiraKey: undefined,
    });
    const [versionList, setVersionList] = useState([]);
    const versionSelectRef = useRef(null);

    useEffect(() => {
        gaVersion()
            .then((response) => {
                setGaVersion(response.payload);
            })
            .catch((error) => {
                console.error("Failed to fetch GA version:", error);
            });
    }, []);

    const handleReleaseChange = useCallback(
        (newReleaseVersion) => {
            if (newReleaseVersion !== releaseVersion) {
                router.push(
                    `/dashboard/release/${newReleaseVersion}?page=1`,
                    undefined,
                    { shallow: true }
                );
            }
        },
        [releaseVersion, router]
    );

    const handleVersionInfo = useCallback((info) => {
        setVersionInfo(info);
    }, []);

    const handleVersionList = useCallback((versions) => {
        setVersionList(versions);
    }, []);

    const handleVersionSelectRef = useCallback((selectFn) => {
        versionSelectRef.current = selectFn;
    }, []);

    const handleSidebarVersionSelect = useCallback((version) => {
        if (versionSelectRef.current) {
            versionSelectRef.current(version);
        }
    }, []);

    return (
        <>
            <Head>
                <title>ART Dashboard</title>
                <link rel="icon" href="/redhat-logo.png" />
            </Head>
            <DashboardLayout
                gaVersion={gaVersionValue}
                versionList={versionList}
                currentVersion={versionInfo.current}
                onVersionSelect={handleSidebarVersionSelect}
            >
                <TopBar
                    releaseVersion={releaseVersion}
                    currentVersion={versionInfo.current}
                    gaVersion={gaVersionValue}
                    jiraKey={versionInfo.jiraKey}
                    onVersionChange={handleReleaseChange}
                />
                <ReleaseBranchDetail
                    branch={releaseVersion}
                    onVersionInfo={handleVersionInfo}
                    onVersionList={handleVersionList}
                    onVersionSelect={handleVersionSelectRef}
                />
            </DashboardLayout>
        </>
    );
}

export default ReleaseHomePage;
