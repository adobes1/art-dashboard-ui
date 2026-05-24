import React from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "../ui/table";
import { Skeleton } from "../ui/skeleton";
import { StatusBadge } from "./StatusBadge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

interface AdvisoryRow {
  advisory_type: string;
  errata_id: number;
  advisory_type_main?: string;
  status?: string;
  publish_date?: string;
  synopsis?: string;
  doc_complete?: string;
  doc_reviewer_realname?: string;
  security_approved?: string;
  product_security_reviewer_realname?: string;
  bug_summary?: Array<{ bug_status: string; count: number }>;
  error?: string;
}

interface AdvisoryTableProps {
  data: AdvisoryRow[];
  loading?: boolean;
}

const SKELETON_ROWS = 5;

const SKELETON_WIDTHS = [
  ["w-16", "w-14", "w-20", "w-12", "w-24", "w-20", "w-24", "w-20", "w-24", "w-16"],
  ["w-10", "w-14", "w-16", "w-14", "w-24", "w-24", "w-28", "w-24", "w-28", "w-20"],
  ["w-14", "w-14", "w-14", "w-16", "w-24", "w-16", "w-20", "w-16", "w-20", "w-24"],
  ["w-20", "w-14", "w-20", "w-10", "w-24", "w-20", "w-28", "w-20", "w-28", "w-12"],
  ["w-16", "w-14", "w-12", "w-14", "w-24", "w-16", "w-24", "w-16", "w-24", "w-16"],
];

function TableSkeleton() {
  return (
    <Table>
      <TableHeader>
        <TableRow className="border-b border-border hover:bg-transparent">
          <TableHead className="border-r border-border">Advisory</TableHead>
          <TableHead colSpan={4} className="border-r border-border text-center">
            Advisory Details
          </TableHead>
          <TableHead colSpan={2} className="border-r border-border text-center">
            Doc
          </TableHead>
          <TableHead colSpan={2} className="border-r border-border text-center">
            Product Security
          </TableHead>
          <TableHead className="text-center">Bugs</TableHead>
        </TableRow>
        <TableRow className="border-b border-border bg-card hover:bg-transparent dark:bg-zinc-950/50">
          <TableHead className="border-r border-border">Type</TableHead>
          <TableHead className="border-r border-border/50">Errata ID</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="border-r border-border">Release Date</TableHead>
          <TableHead>Approval</TableHead>
          <TableHead className="border-r border-border">Reviewer</TableHead>
          <TableHead>Approval</TableHead>
          <TableHead className="border-r border-border">Reviewer</TableHead>
          <TableHead className="text-center">Summary</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {[...Array(SKELETON_ROWS)].map((_, rowIdx) => (
          <TableRow key={rowIdx} className="hover:bg-transparent">
            {SKELETON_WIDTHS[rowIdx].map((w, colIdx) => (
              <TableCell
                key={colIdx}
                className={
                  colIdx === 0 ? "border-r border-border" :
                  colIdx === 1 ? "border-r border-border/50" :
                  colIdx === 4 || colIdx === 6 || colIdx === 8 ? "border-r border-border" :
                  undefined
                }
              >
                {colIdx === 3 || colIdx === 5 || colIdx === 7 ? (
                  <Skeleton className={`h-6 ${w} rounded-full`} />
                ) : (
                  <Skeleton className={`h-4 ${w} rounded`} />
                )}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

const ROW_DELAYS = ["animation-delay-0", "animation-delay-1", "animation-delay-2", "animation-delay-3", "animation-delay-4"];

export function AdvisoryTable({ data, loading }: AdvisoryTableProps) {
  if (loading) return <TableSkeleton />;
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center py-16 text-base text-muted-foreground">
        No advisory data available
      </div>
    );
  }

  return (
    <TooltipProvider delayDuration={200}>
      <Table>
        <TableHeader>
          {/* Group headers */}
          <TableRow className="border-b border-border hover:bg-transparent">
            <TableHead className="border-r border-border">Advisory</TableHead>
            <TableHead colSpan={4} className="border-r border-border text-center">
              Advisory Details
            </TableHead>
            <TableHead colSpan={2} className="border-r border-border text-center">
              Doc
            </TableHead>
            <TableHead colSpan={2} className="border-r border-border text-center">
              Product Security
            </TableHead>
            <TableHead className="text-center">Bugs</TableHead>
          </TableRow>
          {/* Sub-headers */}
          <TableRow className="border-b border-border bg-card hover:bg-transparent dark:bg-zinc-950/50">
            <TableHead className="border-r border-border">Type</TableHead>
            <TableHead className="border-r border-border/50">Errata ID</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="border-r border-border">Release Date</TableHead>
            <TableHead>Approval</TableHead>
            <TableHead className="border-r border-border">Reviewer</TableHead>
            <TableHead>Approval</TableHead>
            <TableHead className="border-r border-border">Reviewer</TableHead>
            <TableHead className="text-center">Summary</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row, idx) => {
            if (row.error) {
              return (
                <TableRow
                  key={idx}
                  className={`animate-row-in ${ROW_DELAYS[idx] || ROW_DELAYS[ROW_DELAYS.length - 1]}`}
                >
                  <TableCell className="border-r border-border font-medium">
                    {row.advisory_type.charAt(0).toUpperCase() +
                      row.advisory_type.slice(1)}
                  </TableCell>
                  <TableCell className="border-r border-border/50 font-mono">
                    {row.errata_id}
                  </TableCell>
                  <TableCell colSpan={8}>
                    <div className="flex items-center gap-2 text-sm text-destructive">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 flex-shrink-0">
                        <path fillRule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-8-5a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-1.5 0v-4.5A.75.75 0 0 1 10 5Zm0 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" clipRule="evenodd" />
                      </svg>
                      Failed to load: {row.error}
                    </div>
                  </TableCell>
                </TableRow>
              );
            }

            return (
              <TableRow
                key={idx}
                className={`animate-row-in ${ROW_DELAYS[idx] || ROW_DELAYS[ROW_DELAYS.length - 1]}`}
              >
                {/* Advisory Type */}
                <TableCell className="border-r border-border font-medium">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="cursor-default">
                        {row.advisory_type.charAt(0).toUpperCase() +
                          row.advisory_type.slice(1)}
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>{row.synopsis}</TooltipContent>
                  </Tooltip>
                </TableCell>

                {/* Errata ID */}
                <TableCell className="border-r border-border/50 font-mono">
                  <a
                    href={`https://errata.devel.redhat.com/advisory/${row.errata_id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent transition-colors duration-100 hover:text-accent/80"
                  >
                    {row.errata_id}
                  </a>
                </TableCell>

                {/* Advisory Type Main */}
                <TableCell className="text-muted-foreground">
                  {row.advisory_type_main?.toUpperCase()}
                </TableCell>

                {/* Status */}
                <TableCell>
                  <StatusBadge status={row.status} />
                </TableCell>

                {/* Release Date */}
                <TableCell className="border-r border-border text-muted-foreground">
                  {row.publish_date}
                </TableCell>

                {/* Doc Approval */}
                <TableCell>
                  <StatusBadge status={row.doc_complete} />
                </TableCell>

                {/* Doc Reviewer */}
                <TableCell className="border-r border-border text-base text-muted-foreground">
                  {row.doc_reviewer_realname || "Not Available"}
                </TableCell>

                {/* Security Approval */}
                <TableCell>
                  <StatusBadge status={row.security_approved} />
                </TableCell>

                {/* Security Reviewer */}
                <TableCell className="border-r border-border text-base text-muted-foreground">
                  {row.product_security_reviewer_realname || "Not Available"}
                </TableCell>

                {/* Bug Summary */}
                <TableCell className="text-center">
                  <div className="flex flex-wrap justify-center gap-1">
                    {row.bug_summary?.map((bug, i) => (
                      <StatusBadge
                        key={i}
                        status={bug.bug_status}
                        count={bug.count}
                      />
                    ))}
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TooltipProvider>
  );
}
