import { FileBarChart } from "lucide-react";
import PageHeader from "@/components/page-header";
import ComingSoon from "@/components/coming-soon";
export default function Page() {
  return (
    <div className="p-6 md:p-8 max-w-[1400px] mx-auto">
      <PageHeader title="דוחות" subtitle="יומי · שבועי · חודשי" />
      <ComingSoon icon={FileBarChart} note="נבנה על אותם נתונים שכבר יש ב-account_insights." />
    </div>
  );
}
