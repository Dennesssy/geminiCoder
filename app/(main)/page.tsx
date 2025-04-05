"use client";

import CodeViewer from "@/components/code-viewer";
import { useScrollTo } from "@/hooks/use-scroll-to";
import { CheckIcon } from "@heroicons/react/16/solid";
import { ArrowLongRightIcon, ChevronDownIcon } from "@heroicons/react/20/solid";
import { ArrowDownTrayIcon } from "@heroicons/react/24/outline"; // Changed import for export icon
import * as Select from "@radix-ui/react-select";
import * as Switch from "@radix-ui/react-switch";
import { AnimatePresence, motion } from "framer-motion";
import { FormEvent, useEffect, useState, useCallback } from "react"; // Added useCallback
import LoadingDots from "../../components/loading-dots";

function removeCodeFormatting(code: string): string {
  return code.replace(/```(?:typescript|javascript|tsx)?\n([\s\S]*?)```/g, '$1').trim();
}

export default function Home() {
  let [status, setStatus] = useState<
    "initial" | "creating" | "created" | "updating" | "updated"
  >("initial");
  let [prompt, setPrompt] = useState("");
  // Updated model labels and removed 1.5-pro
  let models = [
    {
      label: "Daily Alpha Code", // Renamed
      value: "dailypnp-2.0-flash-exp",
    },
    // { // Removed 1.5-pro
    //   label: "dailypnp-1.5-pro",
    //   value: "dailypnp-1.5-pro",
    // },
    {
      label: "Daily Beta Coder", // Renamed
      value: "dailypnp-1.5-flash",
    }
  ];
  let [model, setModel] = useState(models[0].value); // Default to first model
  let [shadcn, setShadcn] = useState(false);
  let [modification, setModification] = useState("");
  let [generatedCode, setGeneratedCode] = useState("");
  let [initialAppConfig, setInitialAppConfig] = useState({
    model: "",
    shadcn: true,
  });
  let [ref, scrollTo] = useScrollTo();
  let [messages, setMessages] = useState<{ role: string; content: string }[]>(
    [],
  );

  let loading = status === "creating" || status === "updating";

  async function createApp(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (status !== "initial") {
      scrollTo({ delay: 0.5 });
    }

    setStatus("creating");
    setGeneratedCode(""); // Clear previous code

    // Restore fetch call to the original backend API route
    let res = await fetch("/api/generateCode", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        shadcn, // This parameter might be used by the backend route
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!res.ok) {
      // Consider adding user-facing error handling here
      setStatus("initial"); // Reset status on error
      setGeneratedCode(`// Error: ${res.statusText}`);
      console.error(res.statusText);
      return; // Stop execution on error
    }

    if (!res.body) {
      // Consider adding user-facing error handling here
      setStatus("initial"); // Reset status on error
      setGeneratedCode(`// Error: No response body`);
      console.error("No response body");
      return; // Stop execution
    }

    const reader = res.body.getReader();
    let receivedData = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        break;
      }
      receivedData += new TextDecoder().decode(value);
      const cleanedData = removeCodeFormatting(receivedData);
      setGeneratedCode(cleanedData);
    }

    setMessages([{ role: "user", content: prompt }]);
    setInitialAppConfig({ model, shadcn });
    setStatus("created"); // Set status after successful generation
  }

  // Function to handle exporting the generated code
  const handleExport = useCallback(() => {
    if (!generatedCode || generatedCode.startsWith("//")) return; // Don't export placeholder/empty

    const blob = new Blob([generatedCode], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'generated-code.tsx'; // Or derive filename from prompt?
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [generatedCode]);


  useEffect(() => {
    let el = document.querySelector(".cm-scroller");
    if (el && loading) {
      let end = el.scrollHeight - el.clientHeight;
      el.scrollTo({ top: end });
    }
  }, [loading, generatedCode]);

  // Animate sine/cosine waves on canvas
  useEffect(() => {
    const canvas = document.getElementById("waveCanvas") as HTMLCanvasElement | null;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener("resize", () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    let t = 0;

    function animate() {
      ctx!.clearRect(0, 0, width, height);

      // Draw multiple sine/cosine waves
      for (let i = 0; i < 3; i++) {
        ctx!.beginPath();
        ctx!.lineWidth = 1.5;
        ctx!.strokeStyle = `hsla(${(i * 60 + t * 10) % 360}, 80%, 70%, 0.3)`;

        for (let x = 0; x < width; x++) {
          const y = height / 2 + Math.sin(x * 0.01 + t + i) * 30 + Math.cos(x * 0.02 + t + i * 2) * 15;
          if (x === 0) ctx!.moveTo(x, y);
          else ctx!.lineTo(x, y);
        }

        ctx!.stroke();
      }

      t += 0.02;
      requestAnimationFrame(animate);
    }

    animate();
  }, []);

  return (
    <main className="relative mt-12 flex w-full flex-1 flex-col items-center px-4 text-center sm:mt-1 dark:text-gray-100 overflow-hidden"> {/* Added relative and overflow-hidden */}
      {/* Animated sine wave background */}
      <canvas id="waveCanvas" className="pointer-events-none absolute inset-0 -z-10"></canvas>

      {/* Replaced "Powered by" link with styled "Stay cloudy" div */}
      <div className="floating-cloud mt-8 mb-6 inline-block rounded-full bg-gradient-to-br from-blue-200 via-blue-100 to-blue-200 px-6 py-3 text-sm font-medium text-blue-800 shadow-lg dark:from-slate-600 dark:via-slate-700 dark:to-slate-600 dark:text-blue-200">
        <span>Stay cloudy</span>
      </div>
      {/* Updated heading with animated gradient and "Daily" */}
      <h1 className="my-6 max-w-3xl text-4xl font-bold text-gray-800 sm:text-6xl dark:text-gray-100">
        Turn your <span className="animated-gradient-text">idea</span>
        <br /> into an <span className="animated-gradient-text">app</span>
        <br /> Daily
      </h1>

      <form className="w-full max-w-xl" onSubmit={createApp}>
        <fieldset disabled={loading} className="disabled:opacity-75">
          <div className="relative mt-5">
            {/* Glassmorphism background element */}
            <div className="absolute -inset-2 rounded-[32px] bg-gray-300/50 dark:bg-slate-700/40 dark:backdrop-blur-md" />
            {/* Form container with dark mode styles */}
            <div className="relative flex rounded-3xl bg-white shadow-sm dark:bg-slate-800/80 dark:backdrop-blur-lg dark:border dark:border-slate-700/50">
              <div className="relative flex flex-grow items-stretch focus-within:z-10">
                <textarea
                  rows={3}
                  required
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  name="prompt"
                  className="w-full resize-none rounded-l-3xl bg-transparent px-6 py-5 text-lg ring-inset placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 dark:text-gray-100 dark:placeholder-gray-400 dark:focus:ring-blue-500" // Refined focus ring, removed focus-visible:outline
                  placeholder="Build me a calculator app..."
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="relative -ml-px inline-flex items-center gap-x-1.5 rounded-r-3xl px-3 py-2 text-sm font-semibold text-blue-500 hover:text-blue-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-500 disabled:text-gray-900"
              >
                {status === "creating" ? (
                  <LoadingDots color="black" style="large" />
                ) : (
                  <ArrowLongRightIcon className="-ml-0.5 size-6" />
                )}
              </button>
            </div>
          </div>
          <div className="mt-6 flex flex-col justify-center gap-4 sm:flex-row sm:items-center sm:gap-8">
            <div className="flex items-center justify-between gap-3 sm:justify-center">
              <p className="text-gray-500 sm:text-xs dark:text-gray-400">Model:</p> {/* Dark mode text */}
              <Select.Root
                name="model"
                disabled={loading}
                value={model}
                onValueChange={(value) => setModel(value)}
              >
                {/* Refined Select Trigger styles */}
                <Select.Trigger className="group flex w-60 max-w-xs items-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:border-slate-600 dark:bg-slate-700 dark:text-gray-200 dark:focus:ring-blue-600 dark:focus:ring-offset-slate-900">
                  <Select.Value placeholder="Select a model..." />
                  <Select.Icon className="ml-auto">
                    <ChevronDownIcon className="size-5 text-gray-400 group-hover:text-gray-500 dark:text-gray-500 dark:group-hover:text-gray-400" /> {/* Adjusted size and colors */}
                  </Select.Icon>
                </Select.Trigger>
                <Select.Portal>
                  {/* Refined Select Content styles */}
                  <Select.Content className="overflow-hidden rounded-md border border-gray-200 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-800">
                    <Select.Viewport className="p-1"> {/* Adjusted padding */}
                      {models.map((model) => (
                        <Select.Item
                          key={model.value}
                          value={model.value}
                          className="flex cursor-pointer items-center rounded-md px-3 py-2 text-sm data-[highlighted]:bg-gray-100 data-[highlighted]:outline-none dark:data-[highlighted]:bg-slate-700" // Dark mode highlight
                        >
                          <Select.ItemText asChild>
                            <span className="inline-flex items-center gap-2 text-gray-500 dark:text-gray-300"> {/* Dark mode text */}
                              <div className="size-2 rounded-full bg-green-500" />
                              {model.label}
                            </span>
                          </Select.ItemText>
                          <Select.ItemIndicator className="ml-auto">
                            <CheckIcon className="size-5 text-blue-600" />
                          </Select.ItemIndicator>
                        </Select.Item>
                      ))}
                    </Select.Viewport>
                    <Select.ScrollDownButton />
                    <Select.Arrow />
                  </Select.Content>
                </Select.Portal>
              </Select.Root>
            </div>

            <div className="flex h-full items-center justify-between gap-3 sm:justify-center">
              <label className="text-gray-500 sm:text-xs dark:text-gray-400" htmlFor="shadcn"> {/* Dark mode text */}
                shadcn/ui:
              </label>
              {/* Refined Switch styles */}
              <Switch.Root
                className="peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 data-[state=checked]:bg-blue-600 dark:bg-slate-700 dark:focus:ring-blue-600 dark:focus:ring-offset-slate-900 dark:data-[state=checked]:bg-blue-500"
                id="shadcn"
                name="shadcn"
                checked={shadcn}
                onCheckedChange={(value) => setShadcn(value)}
              >
                <Switch.Thumb className="pointer-events-none block h-5 w-5 translate-x-0 rounded-full bg-white shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-5 dark:bg-slate-300" />
              </Switch.Root>
            </div>
          </div>
        </fieldset>
      </form>

      <hr className="border-1 mb-20 h-px bg-gray-700 dark:border-gray-600" /> {/* Adjusted dark border */}

      {status !== "initial" && (
        <motion.div
          initial={{ height: 0 }}
          animate={{
            height: "auto",
            overflow: "hidden",
            transitionEnd: { overflow: "visible" },
          }}
          transition={{ type: "spring", bounce: 0, duration: 0.5 }}
          className="w-full pb-[25vh] pt-1"
          onAnimationComplete={() => scrollTo()}
          ref={ref}
        >
          <div className="relative mt-8 w-full overflow-hidden">
            <div className="isolate relative"> {/* Added relative positioning */}
              <CodeViewer code={generatedCode} showEditor />
              {/* Export Button - Updated condition */}
              {(status === 'created' || status === 'updated') && generatedCode && !generatedCode.startsWith("//") && (
                <button
                  onClick={handleExport}
                  className="absolute top-2 right-2 z-20 inline-flex items-center gap-1 rounded bg-slate-600/70 px-2 py-1 text-xs text-white backdrop-blur-sm transition hover:bg-slate-500/80"
                  title="Export Code Snippet"
                >
                  <ArrowDownTrayIcon className="size-4" />
                  Export
                </button>
              )}
            </div>

            <AnimatePresence>
              {loading && (
                <motion.div
                  initial={status === "updating" ? { x: "100%" } : undefined}
                  animate={status === "updating" ? { x: "0%" } : undefined}
                  exit={{ x: "100%" }}
                  transition={{
                    type: "spring",
                    bounce: 0,
                    duration: 0.85,
                    delay: 0.5,
                  }}
                  className="absolute inset-x-0 bottom-0 top-1/2 flex items-center justify-center rounded-r border border-gray-400 bg-gradient-to-br from-gray-100 to-gray-300 md:inset-y-0 md:left-1/2 md:right-0"
                >
                  <p className="animate-pulse text-3xl font-bold">
                    {status === "creating"
                      ? "Building your app..."
                      : "Updating your app..."}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </main>
  );
}

async function minDelay<T>(promise: Promise<T>, ms: number) {
  let delay = new Promise((resolve) => setTimeout(resolve, ms));
  let [p] = await Promise.all([promise, delay]);

  return p;
}
