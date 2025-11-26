'use client';
import { useParticipantIds } from '@daily-co/daily-react';

export function useParticipants() {
  return useParticipantIds({ filter: 'remote' }) || [];
}
