import { Zap } from "lucide-react";
import PageHeader from "@/components/page-header";
import ComingSoon from "@/components/coming-soon";
export default function Page() {
  return (
    <div className="p-6 md:p-8 max-w-[1400px] mx-auto">
      <PageHeader title="אוטומציה" subtitle="חוקי IF/THEN" />
      <ComingSoon icon={Zap} note="בונה החוקים הוויזואלי + מנוע ההרצה מגיעים אחרי שכבת הפעולות." />
    </div>
  );
}
