"use client";

import * as React from "react";
import { Switch } from "@/components/ui/switch";
import useProject from "@/hooks/use-project";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

type ToggleWithMultiSelectProps = {
  crossRepoEnabled: boolean;
  setCrossRepoEnabled: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function ToggleWithMultiSelect({
  crossRepoEnabled,
  setCrossRepoEnabled,
}: ToggleWithMultiSelectProps) {
  const [selected, setSelected] = React.useState<string[]>([]);
  const [open, setOpen] = React.useState(false);
  const { projects } = useProject();

  const toggleOption = (option: string) => {
    setSelected((prev) =>
      prev.includes(option) ? prev.filter((o) => o !== option) : [...prev, option]
    );
  };

  return (
    <div className="space-y-4 p-4 border rounded-xl w-72">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">Enable Cross Repo Search</span>
        <Switch
          checked={crossRepoEnabled}
          onCheckedChange={setCrossRepoEnabled}
          className="data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-zinc-300"
        />
      </div>

      {crossRepoEnabled && (
        <DropdownMenu open={open} onOpenChange={setOpen}>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-full justify-between text-black ">
              SELECT 
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-56"
            onInteractOutside={() => setOpen(false)}
          >
            {projects?.map((proj) => (
              <DropdownMenuCheckboxItem
                key={proj.id}
                checked={selected.includes(proj.name)}
                onCheckedChange={() => toggleOption(proj.name)}
              >
                {proj.name}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}
