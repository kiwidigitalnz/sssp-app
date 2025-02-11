
export type MeetingFrequency = 'daily' | 'weekly' | 'biweekly' | 'monthly' | 'quarterly' | 'asneeded';

export interface Meeting {
  id?: string;
  type: string;
  frequency: MeetingFrequency;
  participants: string[];
  description?: string;
}

