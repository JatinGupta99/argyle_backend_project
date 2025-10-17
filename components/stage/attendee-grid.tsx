'use client';
import { SAMPLE_ATTENDEES } from '@/lib/constants/attendees';
import { ProfilesContainer } from './profiles-container';

export function AttendeeGrid() {
  return (
    <div className="flex flex-col h-screen">
      {' '}
      {/* full screen height */}
      {/* Scrollable container */}
      <div className="flex-1 overflow-y-auto p-6 bg-gray-50 flex items-start justify-center">
        <ProfilesContainer attendees={SAMPLE_ATTENDEES} />
      </div>
      {/* Optional footer, stays within screen */}
      {/* 
      <div className="border-t bg-white p-4 flex justify-center">
        <Button className="bg-blue-500 hover:bg-blue-600 text-white px-8">
          GO LIVE
        </Button>
      </div> 
      */}
    </div>
  );
}
