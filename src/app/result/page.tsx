"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSpecStore } from "@/lib/wizard/spec-store";
import { Button } from "@/components/ui/button";

export default function ResultPage() {
    const router = useRouter();
    const spec = useSpecStore((s) => s.spec);
    const [copied, setCopied] = useState(false);

    // If somebody lands here without a spec (e.g. direct URL), send them back.
    useEffect(() => {
        if (!spec) router.replace("/wizard");
    }, [spec, router]);

    if (!spec) return null;

    const json = JSON.stringify(spec, null, 2);

    async function copy() {
        await navigator.clipboard.writeText(json);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
    }

    return (
        <div className="mx-auto w-full max-w-3xl px-4 py-10">
            <header className="mb-6">
                <h1 className="text-2xl font-semibold tracking-tight">
                    Dashboard spec
                </h1>
                <p className="text-muted-foreground mt-1 text-sm">
                    This is the validated JSON your generator will consume.
                </p>
            </header>

            <div className="flex gap-2 mb-3">
                <Button onClick={copy} variant="outline" size="sm">
                    {copied ? "Copied ✓" : "Copy JSON"}
                </Button>
                <Button
                    onClick={() => router.push("/wizard")}
                    variant="ghost"
                    size="sm">
                    Back to wizard
                </Button>
            </div>

            <pre className="bg-muted rounded-md p-4 text-xs overflow-auto border">
                {json}
            </pre>
        </div>
    );
}
