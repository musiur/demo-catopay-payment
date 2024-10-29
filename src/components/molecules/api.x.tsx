"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import clsx from "clsx";
import { useEffect, useState } from "react";

export default function ApiDialog() {
  const [apiKey, setApiKey] = useState("");
  const [open, setOpen] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const apiKeyOnLS = localStorage.getItem("api-modal-state");
      setOpen(apiKeyOnLS?.length ? false : true);
    }
  }, []);

  const handleSubmit = () => {
    localStorage.setItem("api-modal-state", apiKey);
    setOpen(false);
    window.location.reload();
  };

  return (
    <div
      className={clsx(
        "w-full py-2 flex flex-col justify-center items-center gap-10",
        {
          "h-screen": open,
          "h-auto": !open,
        }
      )}
    >
      {open ? (
        <h2 className="text-2xl font-bold">
          Welcome to <span className="text-blue-700">Catopay</span> Demo
          Application!
        </h2>
      ) : null}
      <Dialog
        open={open}
        onOpenChange={() => {
          setOpen(apiKey?.length ? false : true);
        }}
      >
        <DialogTrigger asChild>
          <Button>{!open ? "Re-enter API Key" : "Get Started"}</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]" noClose={true}>
          <DialogHeader>
            <DialogTitle>Verification</DialogTitle>
            <DialogDescription>
              Please enter your API key to continue.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Input
              id="api-modal-state"
              placeholder="e.g public-les-s7dcZ2GNynem-NSU"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button
              type="submit"
              onClick={handleSubmit}
              disabled={!apiKey || apiKey.length !== 27}
            >
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
