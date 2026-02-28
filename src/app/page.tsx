"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useRouter } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  CommentAdd01Icon,
  SparklesIcon,
  ArrowRight01Icon,
  Loading03Icon,
} from "@hugeicons/core-free-icons";
import { ThemeSelector, type Theme } from "@/components/ThemeSelector";
import { DateTimePicker } from "@/components/DateTimePicker";
import { toast } from "sonner";

export default function Home() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [expiry, setExpiry] = useState<Date | undefined>(undefined);
  const [theme, setTheme] = useState<Theme>("teal");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const createBoard = useMutation(api.boards.create);
  const router = useRouter();

  // Calculate min and max expiry times
  const minExpiry = new Date(Date.now() + 1 * 60 * 60 * 1000); // 1 hour from now
  const maxExpiry = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000); // 14 days from now

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    setIsSubmitting(true);
    try {
      const expiresAt = expiry ? expiry.getTime() : undefined;
      const { slug } = await createBoard({
        name,
        description,
        expiresAt,
        theme,
      });
      toast.success("Board created successfully!", {
        description: `Redirecting to your board...`,
      });
      router.push(`/board/${slug}`);
    } catch (error) {
      console.error("Failed to create board:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.";
      toast.error("Failed to create board", {
        description: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="relative font-sans min-h-screen overflow-hidden px-4 py-12 md:py-24">
      {/* Background Radial Grid Pattern + Gradient */}
      <div className="absolute top-0 left-0 w-full h-full -z-10 pointer-events-none overflow-hidden">
        {/* Radial dot grid */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle, rgba(var(--brand-primary-rgb), 1.0) 1px, transparent 1px)`,
            backgroundSize: "32px 32px",
            maskImage:
              "radial-gradient(ellipse 80% 60% at 50% 40%, black 0%, transparent 70%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 80% 60% at 50% 40%, black 0%, transparent 70%)",
          }}
        />
        {/* Subtle gradient glow from center */}
        <div className="absolute inset-0 bg-gradient-radial from-brand-primary/5 via-transparent to-transparent" />
        {/* Noise texture overlay */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16 space-y-4">
          <div className="flex justify-center mb-6">
            <div className="relative group cursor-default">
              <div className="absolute inset-0 bg-brand-primary rounded-lg translate-x-1 translate-y-1 opacity-40 group-hover:translate-x-2 group-hover:translate-y-2 transition-transform duration-300"></div>
              <div className="relative glass p-4 rounded-lg border-3 border-brand-primary shadow-brutal-hover transition-all duration-300 hover:translate-x-1 hover:translate-y-1">
                <HugeiconsIcon
                  icon={CommentAdd01Icon}
                  size={48}
                  color="currentColor"
                  strokeWidth={2}
                  className="w-12 h-12 text-brand-primary"
                />
              </div>
            </div>
          </div>
          <h1 className="text-5xl md:text-7xl font-serif font-black text-text-primary mb-2 tracking-tight">
            Murmer
          </h1>
          <p className="text-xl font-sans text-text-secondary max-w-lg mx-auto font-medium">
            Anonymous thoughts, authentic voices. Create a private space for
            honest conversations.
          </p>
        </div>

        <div className="relative group">
          <div className="absolute inset-0 bg-brand-primary/20 rounded-xl translate-x-2 translate-y-2"></div>
          <div className="relative glass rounded-xl border-3 border-border-primary shadow-brutal p-8 md:p-12 transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5">
            <h2 className="text-2xl font-serif font-bold text-text-primary mb-8 flex items-center gap-3">
              <HugeiconsIcon
                icon={SparklesIcon}
                size={24}
                color="currentColor"
                strokeWidth={2}
                className="w-6 h-6 text-brand-primary"
              />
              Create Your Board
            </h2>
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="group">
                    <label className="block text-sm font-bold text-text-primary mb-2 ml-1">
                      Board Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g., Team Feedback, Q&A Session"
                      className="w-full px-5 py-4 rounded-lg bg-input-bg border-3 border-border-primary focus:border-brand-primary focus:shadow-brutal outline-none transition-all duration-200 placeholder:text-text-muted/50 text-text-primary"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>

                  <div className="group">
                    <label className="text-sm font-bold text-text-primary mb-2 ml-1">
                      Expiry Date (Optional)
                    </label>
                    <DateTimePicker
                      date={expiry}
                      onDateChange={setExpiry}
                      minDate={minExpiry}
                      maxDate={maxExpiry}
                      placeholder="Select expiry date and time"
                    />
                    <p className="text-xs text-text-muted mt-2 ml-1">
                      Min: 1 hour, Max: 14 days (Default: 12 hours)
                    </p>
                  </div>
                </div>

                <div className="group">
                  <label className="block text-sm font-bold text-text-primary mb-2 ml-1">
                    Description (Optional)
                  </label>
                  <textarea
                    rows={5}
                    placeholder="Share guidelines or what this board is for..."
                    className="w-full px-5 py-4 rounded-lg bg-input-bg border-3 border-border-primary focus:border-brand-primary focus:shadow-brutal outline-none transition-all duration-200 placeholder:text-text-muted/50 resize-none text-text-primary"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
              </div>

              <ThemeSelector selected={theme} onChange={setTheme} />

              <button
                type="submit"
                disabled={isSubmitting}
                className="group relative w-full overflow-hidden bg-brand-primary hover:bg-brand-primary-hover disabled:opacity-50 disabled:cursor-not-allowed text-white font-black py-4 rounded-lg border-3 border-brand-primary-hover shadow-brand-lg transition-all duration-200 flex items-center justify-center gap-3 text-lg hover:-translate-y-0.5 hover:shadow-brutal-hover active:translate-y-0 active:shadow-brand"
              >
                <span className="relative z-10 flex items-center gap-3">
                  {isSubmitting ? (
                    <>
                      <HugeiconsIcon
                        icon={Loading03Icon}
                        size={24}
                        color="currentColor"
                        strokeWidth={2}
                        className="w-6 h-6 animate-spin"
                      />
                      Crafting Board...
                    </>
                  ) : (
                    <>
                      Create Board
                      <HugeiconsIcon
                        icon={ArrowRight01Icon}
                        size={24}
                        color="currentColor"
                        strokeWidth={2}
                        className="w-6 h-6 group-hover:translate-x-1 transition-transform"
                      />
                    </>
                  )}
                </span>
              </button>
            </form>
          </div>
        </div>

        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-10">
          {[
            {
              step: 1,
              title: "Create",
              desc: "Set up your anonymous board in seconds.",
            },
            {
              step: 2,
              title: "Share",
              desc: "Invite participants with a single link.",
            },
            {
              step: 3,
              title: "Engage",
              desc: "Get authentic feedback and honest thoughts.",
            },
          ].map((item) => (
            <div
              key={item.step}
              className="relative group p-6 rounded-lg bg-surface transition-all duration-300 border-3 border-border-primary hover:border-brand-primary hover:-translate-y-1 shadow-brutal hover:shadow-brutal-hover"
            >
              <div className="bg-brand-primary/10 w-14 h-14 rounded-lg flex items-center justify-center mb-6 transition-all duration-300 group-hover:bg-brand-primary/20 border-2 border-brand-primary">
                <span className="text-brand-primary font-black text-xl">
                  {item.step}
                </span>
              </div>
              <h3 className="font-bold font-serif text-text-primary text-lg mb-2">
                {item.title}
              </h3>
              <p className="text-text-secondary font-medium leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
