"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  MessageAdd01Icon,
  PencilEdit01Icon,
  Calendar03Icon,
  SparklesIcon,
  ArrowRight01Icon,
} from "@hugeicons/core-free-icons";
import { ThemeSelector, type Theme } from "@/components/ThemeSelector";

export default function Home() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [expiry, setExpiry] = useState("");
  const [theme, setTheme] = useState<Theme>("indigo");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const createBoard = useMutation(api.boards.create);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    setIsSubmitting(true);
    try {
      const expiresAt = expiry ? new Date(expiry).getTime() : undefined;
      const { slug } = await createBoard({ name, description, expiresAt, theme });
      router.push(`/board/${slug}`);
    } catch (error) {
      console.error("Failed to create board:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="relative font-sans min-h-screen overflow-hidden px-4 py-12 md:py-24">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-neutral-900/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16 space-y-4">
          <div className="flex justify-center mb-6">
            <div className="relative group cursor-default">
              <div className="absolute -inset-1 bg-brand-primary rounded-full blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
              <div className="relative bg-white p-4 rounded-full shadow-sm transition-transform duration-500 hover:scale-110 border border-neutral-100">
                <HugeiconsIcon
                  icon={MessageAdd01Icon}
                  size={48}
                  color="currentColor"
                  strokeWidth={2}
                  className="w-12 h-12 text-brand-primary"
                />
                <HugeiconsIcon
                  icon={PencilEdit01Icon}
                  size={24}
                  color="currentColor"
                  strokeWidth={2}
                  className="w-6 h-6 text-neutral-900 absolute -bottom-1 -right-1"
                />
              </div>
            </div>
          </div>
          <h1 className="text-5xl md:text-7xl font-serif font-black text-neutral-900 mb-2 tracking-tight">
            SecretInk
          </h1>
          <p className="text-xl font-sans text-neutral-700 max-w-lg mx-auto font-medium">
            Anonymous thoughts, authentic voices. Create a private space for honest conversations.
          </p>
        </div>

        <div className="relative group">
          <div className="absolute -inset-1 bg-neutral-900/5 rounded-[2.5rem] blur-2xl opacity-50"></div>
          <div className="relative bg-white rounded-4xl shadow-xl shadow-neutral-900/10 p-8 md:p-12 border border-neutral-100">
            <h2 className="text-2xl font-serif font-bold text-neutral-900 mb-8 flex items-center gap-3">
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
                    <label className="block text-sm font-bold text-neutral-900 mb-2 ml-1">
                      Board Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g., Team Feedback, Q&A Session"
                      className="w-full px-5 py-4 rounded-2xl bg-neutral-100 border-2 border-transparent focus:border-brand-primary focus:bg-white outline-none transition-all duration-300 placeholder:text-neutral-700/30"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>

                  <div className="group">
                    <label className="text-sm font-bold text-neutral-900 mb-2 ml-1 flex items-center gap-2">
                      <HugeiconsIcon
                        icon={Calendar03Icon}
                        size={16}
                        color="currentColor"
                        strokeWidth={2}
                        className="w-4 h-4 text-neutral-700"
                      />
                      Expiry Date (Optional)
                    </label>
                    <input
                      type="datetime-local"
                      className="w-full px-5 py-4 rounded-2xl bg-neutral-100 border-2 border-transparent focus:border-brand-primary focus:bg-white outline-none transition-all duration-300"
                      value={expiry}
                      onChange={(e) => setExpiry(e.target.value)}
                    />
                  </div>
                </div>

                <div className="group">
                  <label className="block text-sm font-bold text-neutral-900 mb-2 ml-1">
                    Description (Optional)
                  </label>
                  <textarea
                    rows={5}
                    placeholder="Share guidelines or what this board is for..."
                    className="w-full px-5 py-4 rounded-2xl bg-neutral-100 border-2 border-transparent focus:border-brand-primary focus:bg-white outline-none transition-all duration-300 placeholder:text-neutral-700/30 resize-none"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
              </div>

              <ThemeSelector selected={theme} onChange={setTheme} />

              <button
                type="submit"
                disabled={isSubmitting}
                className="group relative w-full overflow-hidden bg-neutral-900 hover:bg-neutral-900/90 disabled:bg-neutral-100 text-white font-black py-3 rounded-2xl shadow-xl transition-all duration-300 flex items-center justify-center gap-3 text-lg active:scale-95"
              >
                <span className="relative z-10 flex items-center gap-3">
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-6 h-6 animate-spin" />
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
              className="group p-6 rounded-3xl bg-[#f0f0f0] hover:bg-white transition-colors duration-500 shadow-none hover:shadow-xl hover:shadow-neutral-900/5"
            >
              <div className="bg-neutral-100 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-transform duration-500 group-hover:rotate-12 group-hover:scale-110">
                <span className="text-neutral-900 font-black text-xl">
                  {item.step}
                </span>
              </div>
              <h3 className="font-bold font-serif text-neutral-900 text-lg mb-2">
                {item.title}
              </h3>
              <p className="text-neutral-700 font-medium leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
