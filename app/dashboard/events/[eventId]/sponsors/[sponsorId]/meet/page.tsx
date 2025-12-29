'use client';

import Image from 'next/image';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getSponsorDownloadUrl } from '@/lib/sponsor';

import { ChatPanel } from '@/components/stage/chat/ChatPanel';
import { Header } from '@/components/stage/layout/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from 'sonner';

import { useDetailSponsor } from '@/hooks/useDetailSponsor';
import { apiClient } from '@/lib/api-client';
import { API_ROUTES } from '@/lib/api-routes';
import { UserID } from '@/lib/constants/api';
import { ChatCategoryType, ChatSessionType } from '@/lib/constants/chat';
import { ChatTab, RoleView } from '@/lib/slices/uiSlice';

export default function SponsorBoothMeet() {
  const { eventId, sponsorId } = useParams() as { eventId: string; sponsorId: string };

  const ready = Boolean(eventId && sponsorId);
  const { sponsor, loading, error } = useDetailSponsor(
    ready ? eventId : '',
    ready ? sponsorId : ''
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    title: '',
    industry: '',
    isResearching: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    const requiredFields = ['name', 'email', 'phone', 'address', 'title', 'industry'];

    requiredFields.forEach((field) => {
      if (!formData[field as keyof typeof formData]?.trim()) {
        newErrors[field] = `${field[0].toUpperCase() + field.slice(1)} is required.`;
      }
    });

    if (formData.email && !/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format.';
    }

    if (!formData.isResearching) {
      newErrors.isResearching = 'Please select an option.';
    }

    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      const firstField = Object.keys(validationErrors)[0];
      const el = document.getElementById(firstField);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      toast.error('Please fill all required fields correctly.');
      return;
    }

    try {
      setIsSubmitting(true);
      await apiClient.post(API_ROUTES.sponsor.sendLead(eventId, sponsorId), formData);

      setFormData({
        name: '',
        email: '',
        phone: '',
        address: '',
        title: '',
        industry: '',
        isResearching: '',
      });
      setErrors({});

      toast.success('Lead sent successfully! Our sponsor team will contact you shortly.');
    } catch (err) {
      console.error(err);
      toast.error('Failed to submit. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!ready)
    return <div className="flex h-screen items-center justify-center">Invalid sponsor URL.</div>;
  if (loading)
    return <div className="flex h-screen items-center justify-center">Loading…</div>;
  if (error)
    return <div className="flex h-screen items-center justify-center text-red-500">{error}</div>;
  if (!sponsor)
    return <div className="flex h-screen items-center justify-center">No sponsor data found.</div>;



  return (
    <div className="flex h-screen bg-background">
      <aside className="w-[27%] bg-[#FAFAFA] border-r">
        <ChatPanel
          youtubeUrl={sponsor.youtubeUrl}
          title3={ChatTab.Chat}
          eventId={eventId}
          currentUserId={UserID}
          role={RoleView.Attendee}
          type={ChatSessionType.LIVE}
          tabs={[ChatCategoryType.CHAT, ChatCategoryType.QA]}
        />
      </aside>

      <main className="flex-1 flex flex-col overflow-y-auto">
        <Header title={sponsor.name} />
        <div className="flex flex-1 items-center justify-center px-6 py-10">
          <div className="max-w-4xl w-full bg-white border shadow-sm rounded-lg p-8 space-y-8">
            <h1 className="text-3xl font-bold text-center">Meet Our Sponsor</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="flex justify-center">
                  <Image
                    src={signedLogoUrl || sponsor.logoKey}
                    alt={`${sponsor.name} logo`}
                    width={180}
                    height={80}
                    className="rounded-md object-contain"
                  />
                </div>
                <h2 className="text-lg font-semibold">Introducing {sponsor.name}</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">{sponsor.description}</p>
                <section>
                  <h3 className="font-semibold mb-2">Would you like to meet?</h3>
                  <p className="text-sm text-muted-foreground">
                    Chat with our team via{' '}
                    <a href={sponsor.meetingLink || '#'} className="text-primary hover:underline">
                      live chat
                    </a>{' '}
                    or schedule time using{' '}
                    <a href={sponsor.calendlyLink || '#'} className="text-primary hover:underline">
                      Calendly
                    </a>
                    .
                  </p>
                </section>
              </div>

              <div className="bg-gray-50 rounded-lg p-6 border shadow-inner">
                <h2 className="text-lg font-semibold text-center mb-4">Need More Info?</h2>
                <form onSubmit={handleSubmit} className="space-y-3">
                  {['name', 'email', 'phone', 'address', 'title', 'industry'].map((field) => (
                    <div key={field} className="space-y-1">
                      <Label
                        htmlFor={field}
                        className={`capitalize text-xs font-medium ${errors[field] ? 'text-red-600' : 'text-gray-700'
                          }`}
                      >
                        {field}
                      </Label>
                      <Input
                        id={field}
                        name={field}
                        value={(formData as any)[field]}
                        onChange={handleInputChange}
                        placeholder={`Enter your ${field}`}
                        className={`mt-1 ${errors[field] ? 'border-red-600 focus-visible:ring-red-600' : 'border-gray-300'
                          }`}
                      />
                      {errors[field] && <p className="text-red-600 text-xs">{errors[field]}</p>}
                    </div>
                  ))}

                  <div className="pt-2 space-y-1">
                    <Label
                      className={`text-xs font-medium ${errors.isResearching ? 'text-red-600' : 'text-gray-700'}`}
                    >
                      Are you actively researching solutions?
                    </Label>
                    <div className={`rounded-md p-3 border ${errors.isResearching ? 'border-red-600' : 'border-gray-300'}`}>
                      <RadioGroup
                        value={formData.isResearching}
                        onValueChange={(value) => {
                          setFormData((prev) => ({ ...prev, isResearching: value }));
                          setErrors((prev) => ({ ...prev, isResearching: '' }));
                        }}
                        className="flex gap-6"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem id="research-yes" value="true" />
                          <Label htmlFor="research-yes" className="text-sm">Yes</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem id="research-no" value="false" />
                          <Label htmlFor="research-no" className="text-sm">No</Label>
                        </div>
                      </RadioGroup>
                    </div>
                    {errors.isResearching && <p className="text-red-600 text-xs">{errors.isResearching}</p>}
                  </div>

                  <Button type="submit" className="w-full mt-4" disabled={isSubmitting}>
                    {isSubmitting ? 'Submitting…' : 'Submit'}
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
