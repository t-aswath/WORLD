"use client";

import { Button } from "@/components/ui/button";
import { PublicationSchema } from "@/utils/validator";
import { IconArrowUp } from "@tabler/icons-react";
import { ColumnDef } from "@tanstack/react-table";
import { z } from "zod";

type TPublication = z.infer<typeof PublicationSchema>;
export const columns: ColumnDef<TPublication>[] = [
  {
    accessorKey: "title",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
       Title 
          <IconArrowUp className="" />
        </Button>
      );
    },
  },
  { accessorKey: "type", header: "Type" },
  { accessorKey: "publisher", header: "Publisher" },
  {
    accessorKey: "citation",
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
    accessorKey: "year",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Year
          <IconArrowUp className="" />
        </Button>
      );
    },
  },
  {
    accessorKey: "index",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Index
          <IconArrowUp className="" />
        </Button>
      );
    },
  },
];
