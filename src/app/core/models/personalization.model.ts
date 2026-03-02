export interface Personalization {
  id: string;
  name: string;
  options: PersonalizationOption[];
}

export interface PersonalizationOption {
  id: string;
  name: string;
}

export interface UserPersonalization {
  personalizationId: string;
  optionId: string;
}
