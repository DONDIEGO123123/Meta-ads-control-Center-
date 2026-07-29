import { CalendarClock } from "lucide-react";
import PageHeader from "@/components/page-header";
import ComingSoon from "@/components/coming-soon";
export default function Page() {
  return (
    <div className="p-6 md:p-8 max-w-[1400px] mx-auto">
      <PageHeader title="תזמון" subtitle="פעולות מתוזמנות" />
      <ComingSoon icon={CalendarClock} note="לוח שנה עם גרירה — אחרי שהפעולות עובדות." />
    </div>
  );
}
