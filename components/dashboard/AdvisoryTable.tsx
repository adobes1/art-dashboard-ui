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
  advisory_type_main: string;
  status: string;
  publish_date: string;
  synopsis: string;
  doc_complete: string;
  doc_reviewer_realname: string;
  security_approved: string;
  product_security_reviewer_realname: string;
  bug_summary: Array<{ bug_status: string; count: number }>;
}

interface AdvisoryTableProps {
  data: AdvisoryRow[];
  loading?: boolean;
}

function TableSkeleton() {
  return (
    <div className="space-y-2 p-4">
      {[...Array(5)].map((_, i) => (
        <Skeleton key={i} className="h-10 w-full" />
      ))}
    </div>
  );
}

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
          {data.map((row, idx) => (
            <TableRow key={idx}>
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
          ))}
        </TableBody>
      </Table>
    </TooltipProvider>
  );
}
