import DashboardLayout from '@/app/dashboard/layout';
import { BackstageContent } from '@/components/stage/backstage/BackstageContent';
import { Header } from '@/components/stage/layout/Header';
import { RoleView } from '@/lib/slices/uiSlice.ts';

const targetDate = new Date('2025-11-01T15:00:00Z');

export default function BackstagePage() {
  const chatTitles = { title1: 'Backstage', title2: 'Q&A', title3: 'Everyone' };
  const chatRole: RoleView = 'attendee';

  return (
    <>
      <div className="flex flex-1 h-full w-full">
        {/* Main content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header title="Financial Controller Leadership Forum: Redefining Trad..." />
          <div className="flex-1 overflow-y-auto">
            <BackstageContent targetDate={new Date('2025-11-01T15:00:00Z')} />
          </div>
        </div>
      </div>
    </>
  );
}
