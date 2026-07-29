import { Megaphone } from "lucide-react";
import PageHeader from "@/components/page-header";
import ComingSoon from "@/components/coming-soon";
export default function Page() {
  return (
    <div className="p-6 md:p-8 max-w-[1400px] mx-auto">
      <PageHeader title="קמפיינים" subtitle="כל הקמפיינים מכל החשבונות" />
      <ComingSoon icon={Megaphone} note="נמשוך את היררכיית הקמפיינים בשלב הבא, יחד עם start/pause." />
    </div>
  );
}
