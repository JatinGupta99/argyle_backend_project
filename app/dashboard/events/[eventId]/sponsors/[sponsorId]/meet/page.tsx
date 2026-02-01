'use client';

import { getSponsorDownloadUrl } from '@/lib/sponsor';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import { useEventContext } from '@/components/providers/EventContextProvider';
import { ChatPanel } from '@/components/stage/chat/ChatPanel';
import { Header } from '@/components/stage/layout/Header';
import { SplitLayout } from '@/components/stage/layout/SplitLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Calendar, Loader2 } from 'lucide-react';
import { PopupModal } from 'react-calendly';
import { toast } from 'sonner';

import { ROLES_ADMIN } from '@/app/auth/roles';
import { useDetailSponsor } from '@/hooks/useDetailSponsor';
import { apiClient } from '@/lib/api-client';
import { API_ROUTES } from '@/lib/api-routes';
import { } from '@/lib/constants/api';
import { ChatCategoryType } from '@/lib/constants/chat';
import { ChatTab } from '@/lib/slices/uiSlice';
import { getChatSessionStatus } from '@/lib/utils/chat-utils';

import { useAuth } from '@/app/auth/auth-context';

export default function SponsorBoothMeet() {
  const { eventId, sponsorId } = useParams() as { eventId: string; sponsorId: string };
  const { userId, userData } = useAuth();

  const ready = Boolean(eventId && sponsorId);
  const { sponsor, loading, error } = useDetailSponsor(
    ready ? eventId : '',
    ready ? sponsorId : ''
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCalendlyOpen, setIsCalendlyOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    title: '',
    industry: '',
    researchingSolutions: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [signedLogoUrl, setSignedLogoUrl] = useState<string | null>(null);
  const [rootElement, setRootElement] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setRootElement(document.body);
  }, []);

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

    if (!formData.researchingSolutions) {
      newErrors.researchingSolutions = 'Please select an option.';
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

      const payload = {
        ...formData,
        eventId,
        sponsorId,
        userId: userId || undefined
      };

      await apiClient.post(API_ROUTES.inquiries.base, payload);

      setFormData({
        name: '',
        email: '',
        phone: '',
        address: '',
        title: '',
        industry: '',
        researchingSolutions: '',
      });
      setErrors({});

      toast.success('Inquiry submitted successfully! A representative will reach out to you shortly.');
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
    <SplitLayout
      sidebar={
        <ChatPanel
          youtubeUrl={sponsor.youtubeUrl}
          title3={ChatTab.Chat}
          eventId={eventId}
          currentUserId={userId || ""}
          role={ROLES_ADMIN.Attendee}
          type={getChatSessionStatus(useEventContext())}
          tabs={[ChatCategoryType.CHAT, ChatCategoryType.QA]}
        />
      }
    >
      <Header title={sponsor.name} />
      <div className="flex-1 overflow-y-auto">
        <div className="flex flex-1 items-center justify-center px-6 py-10">
          <div className="max-w-4xl w-full bg-background border border-border shadow-sm rounded-lg p-8 space-y-8">
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
                  <div className="flex flex-col gap-3">
                    <p className="text-sm text-muted-foreground">
                      Chat with our team via{' '}
                      <a href={sponsor.meetingLink || '#'} className="text-primary hover:underline">
                        live chat
                      </a>{' '}
                      or schedule time directly:
                    </p>
                    <Button
                      onClick={() => setIsCalendlyOpen(true)}
                      variant="outline"
                      className="w-full sm:w-auto gap-2 border-primary text-primary hover:bg-primary/5"
                    >
                      <Calendar size={16} />
                      Schedule a Meeting
                    </Button>
                  </div>

                  {rootElement && (
                    <PopupModal
                      url={sponsor.calendlyLink || "https://calendly.com/jatin-gupta-melonleaf/30min"}
                      onModalClose={() => setIsCalendlyOpen(false)}
                      open={isCalendlyOpen}
                      rootElement={rootElement}
                      prefill={{
                        email: userData?.email || '',
                        name: userData?.name || '',
                      }}
                    />
                  )}
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
                      className={`text-xs font-medium ${errors.researchingSolutions ? 'text-red-600' : 'text-gray-700'}`}
                    >
                      Are you actively researching solutions?
                    </Label>
                    <div className={`rounded-md p-3 border ${errors.researchingSolutions ? 'border-red-600' : 'border-gray-300'}`}>
                      <RadioGroup
                        value={formData.researchingSolutions}
                        onValueChange={(value) => {
                          setFormData((prev) => ({ ...prev, researchingSolutions: value }));
                          setErrors((prev) => ({ ...prev, researchingSolutions: '' }));
                        }}
                        className="flex gap-6"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem id="research-yes" value="yes" />
                          <Label htmlFor="research-yes" className="text-sm">Yes</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem id="research-no" value="no" />
                          <Label htmlFor="research-no" className="text-sm">No</Label>
                        </div>
                      </RadioGroup>
                    </div>
                    {errors.researchingSolutions && <p className="text-red-600 text-xs">{errors.researchingSolutions}</p>}
                  </div>

                  <Button type="submit" className="w-full mt-4" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Submitting...
                      </>
                    ) : 'Submit'}
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>

      </div>
    </SplitLayout>
  );
}
