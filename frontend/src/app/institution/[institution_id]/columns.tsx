"use client";

import { Button } from "@/components/ui/button";
import { StaffSchema } from "@/utils/validator";
import { IconArrowUp } from "@tabler/icons-react";
import { ColumnDef } from "@tanstack/react-table";
import { z } from "zod";

type TStaffType = z.infer<typeof StaffSchema>;
export const columns: ColumnDef<TStaffType>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
        Name
          <IconArrowUp className="" />
        </Button>
      );
    },
  },
  { accessorKey: "department", header: "Dept." },
  { accessorKey: "designation", header: "Designation" },
  {
    accessorKey: "total_citation",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Total Citation
          <IconArrowUp className="" />
        </Button>
      );
    },
  },
  {
    accessorKey: "h_index",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          H Index
          <IconArrowUp className="" />
        </Button>
      );
    },
  },
  {
    accessorKey: "i_index",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          I Index
          <IconArrowUp className="" />
        </Button>
      );
    },
  },
];
