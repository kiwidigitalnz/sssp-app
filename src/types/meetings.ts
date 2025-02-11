
export type MeetingFrequency = 'daily' | 'weekly' | 'biweekly' | 'monthly' | 'quarterly' | 'asneeded';

export interface Meeting {
  type: string;
  frequency: MeetingFrequency;
  attendees: string;
  description: string;
}
