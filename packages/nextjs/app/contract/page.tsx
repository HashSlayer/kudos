import Link from "next/link";
import KudosDiagram from "~~/components/KudosDiagram";

export default function ContractPage() {
  return (
    <div className="min-h-screen">
      <div className="w-full flex justify-between items-center px-6 py-4 bg-base-200 border-b border-base-300">
        <h2 className="text-xl font-semibold">Contract</h2>
        <Link href="/" className="btn btn-primary">
          Back to Home
        </Link>
      </div>
      <KudosDiagram />
    </div>
  );
}
