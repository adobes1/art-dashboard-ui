import React, { useEffect, useState } from "react";
import { ExternalLink } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Badge } from "../ui/badge";
import { getReleaseBranchesFromOcpBuildData } from "../api_calls/release_calls";

interface TopBarProps {
  releaseVersion: string;
  currentVersion: string | undefined;
  gaVersion: string | null;
  jiraKey: string | undefined;
  onVersionChange: (version: string) => void;
}

export function TopBar({
  releaseVersion,
  currentVersion,
  gaVersion,
  jiraKey,
  onVersionChange,
}: TopBarProps) {
  const [branches, setBranches] = useState<string[]>([]);
  const [branchesLoaded, setBranchesLoaded] = useState(false);

  useEffect(() => {
    getReleaseBranchesFromOcpBuildData().then((data: any[]) => {
      setBranches(data.map((d: any) => d.name));
      setBranchesLoaded(true);
    });
  }, []);

  const isGA = gaVersion && releaseVersion === `openshift-${gaVersion}`;
  const displayVersion = currentVersion || releaseVersion;

  return (
    <div className="border-b border-border">
      {/* Main top bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-semibold">{displayVersion}</h1>
          {isGA && (
            <Badge variant="success" className="text-sm px-2 py-0.5">
              GA
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Version selector */}
          {branchesLoaded ? (
            <Select value={releaseVersion} onValueChange={onVersionChange}>
              <SelectTrigger className="w-[220px]">
                <SelectValue placeholder="OpenShift Version" />
              </SelectTrigger>
              <SelectContent>
                {branches.map((branch) => (
                  <SelectItem key={branch} value={branch}>
                    {branch}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <div className="flex h-9 w-[220px] items-center gap-2 rounded-md border border-input bg-transparent px-3 text-sm">
              <span>{releaseVersion || "Loading…"}</span>
              <svg className="ml-auto h-4 w-4 animate-spin text-muted-foreground" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            </div>
          )}

          {/* Jira link */}
          {jiraKey && (
            <a
              href={`https://issues.redhat.com/browse/${jiraKey}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-1.5 text-sm text-accent transition-colors duration-100 hover:bg-muted"
            >
              {jiraKey}
              <ExternalLink className="h-3 w-3" />
            </a>
          )}
        </div>
      </div>

      {/* Release stream links (always visible) */}
      {currentVersion && (
        <div className="flex gap-4 border-t border-border/50 px-5 py-1.5 text-sm text-muted-foreground">
          <span>Release streams:</span>
          {[
            { label: "amd64", arch: "amd64", stream: "4-stable" },
            { label: "s390x", arch: "s390x", stream: "4-stable-s390x" },
            { label: "ppc64le", arch: "ppc64le", stream: "4-stable-ppc64le" },
            { label: "arm64", arch: "arm64", stream: "4-stable-arm64" },
          ].map(({ label, arch, stream }) => (
            <a
              key={label}
              href={`https://${arch}.ocp.releases.ci.openshift.org/releasestream/${stream}/release/${currentVersion}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent transition-colors duration-100 hover:text-accent/80"
            >
              {label}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
