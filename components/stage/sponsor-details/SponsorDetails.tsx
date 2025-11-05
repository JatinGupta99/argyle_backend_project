'use client';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Edit2, Plus, Trash2 } from 'lucide-react';
import Image from 'next/image';

interface SponsorDetailsProps {
  sponsorId?: string;
  onBack?: () => void;
}

export default function SponsorDetails({
  sponsorId,
  onBack,
}: SponsorDetailsProps) {
  const sponsor = {
    id: 'bill-001',
    name: 'BILL',
    description:
      'BILL (NYSE: BILL) is a leader in financial automation software for small and mid-sized businesses (SMBs). We are dedicated to automating the future so businesses can thrive. Hundreds of thousands of businesses trust BILL solutions to manage financial workflows, including payables, receivables, and spend and expense management. With BILL, businesses are connected to a network of millions of members, so they can pay or get paid faster. Through our automated solutions, we help SMBs simplify and control their finances, so they can confidently manage their finances and succeed on their terms.',
    documents: [
      { id: 1, title: 'Website', url: 'https://www.bill.com', icon: '🔗' },
      { id: 2, title: 'LinkedIn', url: '', icon: '🔗' },
    ],
    socialMedia: [
      { platform: 'facebook', icon: '📘' },
      { platform: 'twitter', icon: '𝕏' },
      { platform: 'instagram', icon: '📷' },
      { platform: 'linkedin', icon: '💼' },
    ],
  };

  return (
    <div className="flex flex-col flex-1 bg-white h-full px-4 sm:px-6 py-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-200 pb-4 flex-shrink-0">
        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-blue-500 hover:text-blue-600 text-sm sm:text-base"
          >
            <ArrowLeft size={18} />
            <span>Back to Sponsors</span>
          </button>
          <span className="hidden sm:block text-gray-400">|</span>
          <span className="font-semibold text-gray-800 text-sm sm:text-base translate-y-[2px] inline-block">
            {sponsor.name}
          </span>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button variant="outline" className="text-sm">
            Video
          </Button>
          <Button className="bg-blue-500 hover:bg-blue-600 text-white text-sm">
            Company Details
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto mt-4 space-y-4 pr-2">
        {/* ✅ Text on left, logo on right */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6 text-center sm:text-left">
          {/* Text Section */}
          {/* ✅ Text on left, name/logo on right */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6 text-center sm:text-left">
            {/* Left: Description Text */}
            <div className="flex-1 space-y-4 order-2 sm:order-1">
              <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
                {sponsor.description}
              </p>
              <Button className="bg-blue-500 hover:bg-blue-600 text-white text-sm sm:text-base mt-2">
                Request More Information
              </Button>
            </div>

            {/* Right: Company Name (and optional Logo) */}
            <div className="flex flex-col items-center sm:items-end flex-shrink-0 order-1 sm:order-2">
              <h1 className="text-3xl sm:text-4xl font-bold text-orange-500 translate-y-[4px]">
                {sponsor.name}
              </h1>

              {/* Optional Logo */}
            </div>
          </div>
        </div>

        {/* Documents & Links */}
        <div className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <h2 className="text-lg sm:text-2xl font-bold text-gray-800">
              Documents & Links
            </h2>
            <div className="flex gap-2">
              {sponsor.socialMedia.map((social) => (
                <button
                  key={social.platform}
                  className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 text-lg"
                >
                  {social.icon}
                </button>
              ))}
            </div>
          </div>

          {/* Links List */}
          <div className="space-y-2">
            {sponsor.documents.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center justify-between bg-gray-50 p-3 rounded text-sm"
              >
                <div className="flex items-center gap-3 flex-1">
                  <span className="text-lg">{doc.icon}</span>
                  <input
                    type="text"
                    value={doc.url || 'No link provided'}
                    readOnly
                    className="flex-1 bg-transparent text-gray-600 outline-none"
                  />
                </div>
                <div className="flex gap-1">
                  <button className="p-2 hover:bg-gray-200 rounded">
                    <Edit2 size={16} className="text-gray-600" />
                  </button>
                  <button className="p-2 hover:bg-gray-200 rounded">
                    <Trash2 size={16} className="text-red-500" />
                  </button>
                </div>
              </div>
            ))}
            <button className="w-full flex items-center justify-center gap-2 bg-gray-50 p-3 rounded border-2 border-dashed border-blue-500 text-blue-500 hover:bg-blue-50 text-sm">
              <Plus size={18} />
              <span>Add Link</span>
            </button>
          </div>
        </div>

        {/* Meeting Request */}
        {/* ✅ Meeting Request Section (Text Left, Title Right) */}
        <div className="bg-gray-50 p-6 rounded-lg mt-4 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          {/* Left: Button / Call to Action */}
          <div className="order-2 sm:order-1">
            <Button className="bg-blue-500 hover:bg-blue-600 text-white text-sm sm:text-base">
              Request a Meeting
            </Button>
          </div>

          {/* Right: Heading / Message */}
          <div className="order-1 sm:order-2">
            <h3 className="text-base sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-0">
              Hey, would you like to meet?
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
}
