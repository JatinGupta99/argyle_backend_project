'use client';

import * as React from 'react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface FormData {
  name: string;
  address: string;
  phone: string;
  title: string;
  industry: string;
  isResearching: string;
}

export default function SponsorMeet() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    address: '',
    phone: '',
    title: '',
    industry: '',
    isResearching: 'yes',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  return (
    <div className="flex-1 overflow-y-auto bg-background">
      <div className="max-w-4xl mx-auto p-8">
        {/* Header */}
        <h1 className="text-3xl font-bold text-center mb-12">
          MEET OUR SPONSOR
        </h1>

        {/* Sponsor Logo */}
        <div className="flex justify-center mb-12">
          <div className="w-48 h-48 bg-white rounded-lg flex items-center justify-center shadow-sm border">
            <span className="text-6xl font-bold text-orange-500">bill</span>
          </div>
        </div>

        {/* Main Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-12 mb-12">
          {/* Left Side */}
          <div className="space-y-8">
            <section>
              <h2 className="text-xl font-semibold mb-4">Introducing Bill</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                BILL helps its clients do things better. We are a leader in
                financial automation software for small and mid-sized businesses
                (SMBs). BILL is dedicated to automating financial workflows so
                businesses can thrive.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">Like to meet?</h3>
              <p className="text-sm text-muted-foreground mb-2">
                Chat with our team now:{' '}
                <a
                  href="#"
                  className="text-primary hover:underline font-medium"
                >
                  Live Chat
                </a>
              </p>
              <p className="text-sm text-muted-foreground">
                Schedule a meeting with us here:{' '}
                <a
                  href="#"
                  className="text-primary hover:underline font-medium"
                >
                  Calendly
                </a>
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">Like to chat now?</h3>
              <p className="text-sm text-muted-foreground mb-2">
                Chat with our team now:{' '}
                <a
                  href="#"
                  className="text-primary hover:underline font-medium"
                >
                  Live Chat
                </a>
              </p>
              <p className="text-sm text-muted-foreground">
                Schedule a meeting with us here:{' '}
                <a
                  href="#"
                  className="text-primary hover:underline font-medium"
                >
                  Calendly
                </a>
              </p>
            </section>
          </div>

          {/* Right Side — Registration Form */}
          <div>
            <h2 className="text-xl font-semibold mb-6">Need more info?</h2>
            <p className="text-sm text-muted-foreground mb-6">
              Register here to receive more about our solutions:
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {[
                { id: 'name', label: 'Name', placeholder: 'Enter your name' },
                {
                  id: 'address',
                  label: 'Address',
                  placeholder: 'Enter your address',
                },
                {
                  id: 'phone',
                  label: 'Phone',
                  placeholder: 'Enter your phone',
                },
                {
                  id: 'title',
                  label: 'Title',
                  placeholder: 'Enter your title',
                },
                {
                  id: 'industry',
                  label: 'Industry',
                  placeholder: 'Enter your industry',
                },
              ].map((field) => (
                <div key={field.id}>
                  <Label htmlFor={field.id} className="text-sm">
                    {field.label}
                  </Label>
                  <Input
                    id={field.id}
                    name={field.id}
                    value={formData[field.id as keyof FormData]}
                    onChange={handleInputChange}
                    placeholder={field.placeholder}
                    className="mt-1"
                  />
                </div>
              ))}

              {/* Radio Group using shadcn */}
              <div className="pt-4">
                <Label className="text-sm mb-2 block">
                  Are you actively researching solutions for your business?
                </Label>
                <RadioGroup
                  value={formData.isResearching}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, isResearching: value }))
                  }
                  className="flex gap-6 mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="yes" />
                    <Label htmlFor="yes" className="text-sm">
                      Yes
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="no" />
                    <Label htmlFor="no" className="text-sm">
                      No
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <Button type="submit" className="w-full mt-6">
                Submit
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
