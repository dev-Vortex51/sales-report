"use client";

import React, { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const BranchSelector = () => {
  const [branch, setBranch] = useState("all");
  return (
    <Select value={branch} onValueChange={setBranch}>
      <SelectTrigger className="mt-1">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Branches</SelectItem>
        <SelectItem value="main">Main</SelectItem>
        <SelectItem value="downtown">Downtown</SelectItem>
        <SelectItem value="mall">Mall</SelectItem>
      </SelectContent>
    </Select>
  );
};

export default BranchSelector;
