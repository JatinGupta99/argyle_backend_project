export interface Attendee {
  id: string;
  name: string;
  role: 'panelist' | 'speaker' | 'Attendee';
  image: string;
  isMuted?: boolean;
}

export const SAMPLE_ATTENDEES: Attendee[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    role: 'panelist',
    image: '/professional-curly-hair-woman.png',
    isMuted: false,
  },
  {
    id: '2',
    name: 'Marcus Chen',
    role: 'panelist',
    image: '/professional-man-smiling.png',
    isMuted: false,
  },
  {
    id: '3',
    name: 'David Williams',
    role: 'panelist',
    image: '/professional-man-suit.png',
    isMuted: true,
  },
  {
    id: '4',
    name: 'James Rodriguez',
    role: 'panelist',
    image: '/professional-man-in-red-shirt.jpg',
    isMuted: false,
  },
  {
    id: '5',
    name: 'RJ',
    role: 'speaker',
    image: '/professional-speaker.jpg',
    isMuted: true,
  },
  {
    id: '6',
    name: 'Emily Watson',
    role: 'Attendee',
    image: '/professional-curly-hair-woman.png',
    isMuted: false,
  },
  {
    id: '7',
    name: 'Alex Thompson',
    role: 'Attendee',
    image: '/professional-man-smiling.png',
    isMuted: true,
  },
  {
    id: '8',
    name: 'Jessica Lee',
    role: 'Attendee',
    image: '/professional-man-suit.png',
    isMuted: false,
  },
  {
    id: '9',
    name: 'Michael Brown',
    role: 'Attendee',
    image: '/professional-man-in-red-shirt.jpg',
    isMuted: false,
  },
  {
    id: '10',
    name: 'Lisa Anderson',
    role: 'Attendee',
    image: '/professional-curly-hair-woman.png',
    isMuted: true,
  },
  {
    id: '11',
    name: 'Chris Martin',
    role: 'Attendee',
    image: '/professional-man-smiling.png',
    isMuted: false,
  },
  {
    id: '12',
    name: 'Nina Patel',
    role: 'Attendee',
    image: '/professional-man-suit.png',
    isMuted: false,
  },
];

