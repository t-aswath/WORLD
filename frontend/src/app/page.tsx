import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <main className="w-full min-h-screen flex items-center justify-center flex-col">
      <h1 className="text-8xl font-mono">THE WORLD</h1>
      <h1 className="text-2xl font-mono">Web.Of.Researchers.&.Learners.Database</h1>
      <Button asChild className="mt-10">
        <Link href="/institution">Search Institutions</Link>
      </Button>
    </main>
  );
}
