export type Gender = 'Dreng' | 'Pige' | 'Andet';

export interface Student {
  id: string;
  name: string;
  gender: Gender;
}

export interface ClassData {
  id: string;
  name: string;
  students: Student[];
}

export interface Group {
  id: string;
  name: string;
  students: Student[];
}
