import DbTestButton from "@/components/Database/DbTestButton";

export default function DbTestPage() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Database Connection Test Page</h1>
      <DbTestButton />
    </div>
  );
}