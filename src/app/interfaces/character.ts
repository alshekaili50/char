export interface Character {
  id?: string;
  userId?: string;
  name: string;
  race: string;
  class: string;
  level: number;
  stats: {
    strength: number;
    dexterity: number;
    constitution: number;
    intelligence: number;
    wisdom: number;
    charisma: number;
  };
  inventory?: Array<{
    itemId: string;
    quantity: number;
  }>;
  skills?: string[];
  experience: number;
  createdAt?: Date;
  updatedAt?: Date;
} 