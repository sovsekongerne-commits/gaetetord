import type { Student, Group } from './groupTypes';

interface GenerateOptions {
  method: 'byGroups' | 'bySize';
  value: number;
  evenGenders: boolean;
}

export function generateGroups(students: Student[], options: GenerateOptions): Group[] {
  if (!students || students.length === 0) return [];
  if (options.value <= 0) return [];

  let numberOfGroups = 1;
  if (options.method === 'byGroups') {
    numberOfGroups = Math.max(1, options.value);
  } else {
    numberOfGroups = Math.max(1, Math.ceil(students.length / options.value));
  }

  const groups: Group[] = Array.from({ length: numberOfGroups }, (_, i) => ({
    id: crypto.randomUUID(),
    name: `Gruppe ${i + 1}`,
    students: []
  }));

  // Shuffle array using Fisher-Yates to guarantee complete randomness
  const shuffledStudents = [...students];
  for (let i = shuffledStudents.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledStudents[i], shuffledStudents[j]] = [shuffledStudents[j], shuffledStudents[i]];
  }

  if (options.evenGenders) {
    const boys = shuffledStudents.filter(s => s.gender === 'Dreng');
    const girls = shuffledStudents.filter(s => s.gender === 'Pige');
    const others = shuffledStudents.filter(s => s.gender === 'Andet');

    let groupIndex = 0;
    
    // Distribute girls round-robin across all groups
    while (girls.length > 0) {
      groups[groupIndex % numberOfGroups].students.push(girls.pop()!);
      groupIndex++;
    }
    
    // Distribute boys round-robin
    while (boys.length > 0) {
      groups[groupIndex % numberOfGroups].students.push(boys.pop()!);
      groupIndex++;
    }

    // Distribute others
    while (others.length > 0) {
      groups[groupIndex % numberOfGroups].students.push(others.pop()!);
      groupIndex++;
    }

  } else {
    // Standard round-robin distribution
    shuffledStudents.forEach((student, index) => {
      groups[index % numberOfGroups].students.push(student);
    });
  }

  return groups;
}
