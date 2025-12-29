'use client';

import { Button } from '@/components/ui/button';
import { SocialLink, Sponsor } from '@/lib/sponsor';
import {
  ArrowLeft,
  Edit2,
  Trash2,
  Globe,
  Twitter,
  Instagram,
  Linkedin,
} from 'lucide-react';
import { getSponsorDownloadUrl } from '@/lib/sponsor';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

interface SponsorDetailsProps {
  sponsor?: Sponsor;
  eventId?: string;
}

export default function SponsorDetails({
  sponsor,
  eventId,
}: SponsorDetailsProps) {
  const sponsorId = sponsor?._id;
  const router = useRouter();
  const handleRequestInfo = () => {
    if (eventId && sponsorId) {
      router.push(`/dashboard/events/${eventId}/sponsors/${sponsorId}/meet`);
    } else {
      console.warn('Missing event or sponsor ID.');
    }
  };

  const [signedLogoUrl, setSignedLogoUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchImage = async () => {
      if (sponsor && eventId && sponsor.logoKey) {
        try {
          const url = await getSponsorDownloadUrl(eventId, sponsor._id);
          if (url) {
            setSignedLogoUrl(url);
          }
        } catch (error) {
          console.error(`Failed to fetch image for sponsor ${sponsor._id}`, error);
        }
      }
    };
    fetchImage();
  }, [sponsor, eventId]);

  if (!sponsor) {
    return (
      <div className="flex h-full items-center justify-center text-gray-500">
        Loading sponsor details...
      </div>
    );
  }

  const {
    name,
    description,
    logoKey,
    documents = [],
    websiteUrl,
    twitterUrl,
    instagramUrl,
    linkedInUrl,
  } = sponsor;

  const socialLinks: SocialLink[] = [
    websiteUrl && {
      platform: 'Website',
      icon: <Globe size={16} />,
      url: websiteUrl,
    },
    twitterUrl && {
      platform: 'Twitter',
      icon: <Twitter size={16} />,
      url: twitterUrl,
    },
    instagramUrl && {
      platform: 'Instagram',
      icon: <Instagram size={16} />,
      url: instagramUrl,
    },
    linkedInUrl && {
      platform: 'LinkedIn',
      icon: <Linkedin size={16} />,
      url: linkedInUrl,
    },
    ...(sponsor.socialMedia || []),
  ].filter(Boolean) as SocialLink[];

  const handleBack = () => {
    router.push(`/dashboard/events/${eventId}/sponsors`);
  };
  return (
    <div className="flex flex-col flex-1 bg-white h-full px-4 sm:px-6 py-4">
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-200 pb-4">
        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-blue-500 hover:text-blue-600 text-sm sm:text-base"
          >
            <ArrowLeft size={18} />
            <span>Back to Sponsors</span>
          </button>
          {name && (
            <>
              <span className="hidden sm:block text-gray-400">|</span>
              <span className="font-semibold text-gray-800 text-sm sm:text-base">
                {name}
              </span>
            </>
          )}
        </div>

        <div className="flex flex-wrap items-center">
          <Button
            variant="outline"
            className="text-sm rounded-r-none border-r-0"
          >
            Video
          </Button>
          <Button className="bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-l-none">
            Company Details
          </Button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto mt-4 space-y-8 pr-2">
        <section className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 relative flex flex-col sm:flex-row justify-between gap-6">
          <div className="flex-1 flex flex-col justify-between text-center sm:text-left relative">
            <div className="flex-1 overflow-y-auto max-h-[300px] pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
              <p className="text-gray-700 text-sm sm:text-base leading-relaxed whitespace-pre-line break-words">
                {description || 'No description provided.'}
              </p>
            </div>
            <div className="mt-auto pt-4 flex justify-center sm:justify-start">
              <Button
                onClick={handleRequestInfo}
                className="bg-blue-500 hover:bg-blue-600 text-white text-sm sm:text-base w-fit"
              >
                Request More Information
              </Button>
            </div>
          </div>

          {logoKey && (
            <div className="flex justify-end items-start shrink-0 self-start">
              <Image
                src={signedLogoUrl || logoKey}
                alt={name}
                width={160}
                height={80}
                className="rounded-md object-contain shadow-sm border border-gray-100"
              />
            </div>
          )}
        </section>

        <section className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between flex-wrap gap-3 border-b border-gray-100 pb-3 mb-4">
            <h2 className="text-lg sm:text-2xl font-bold text-gray-800">
              Documents & Links
            </h2>
            {socialLinks.length > 0 && (
              <div className="flex items-center gap-2 sm:gap-3">
                {socialLinks.map((link) => (
                  <a
                    key={link.platform}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-9 h-9 rounded-full bg-sky-50 text-sky-600 hover:bg-sky-100 transition-colors"
                    title={link.platform}
                  >
                    {link.icon}
                  </a>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-2">
            {documents.length > 0 ? (
              documents.map((doc) => (
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
              ))
            ) : websiteUrl ? null : (
              <p className="text-gray-500 text-sm">No documents available.</p>
            )}

            {websiteUrl && (
              <div className="flex items-center justify-between bg-gray-50 p-3 rounded text-sm mt-3">
                <div className="flex items-center gap-3 flex-1">
                  <Globe size={18} className="text-sky-600" />
                  <a
                    href={websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline break-all"
                  >
                    {websiteUrl}
                  </a>
                </div>
              </div>
            )}
          </div>
        </section>

        <div className="flex flex-wrap items-center justify-center mt-8 gap-3 text-center">
          <h3 className="text-base sm:text-lg font-semibold text-gray-800 ml-2">
            Hey, would you like to meet?
          </h3>
          <Button className="bg-blue-500 hover:bg-blue-600 text-white text-sm sm:text-base">
            Request a Meeting
          </Button>
        </div>
      </main>
    </div>
  );
}
