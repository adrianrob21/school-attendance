export type Student = {
  id: string;
  fullName: string;
  dateOfBirth: string;
  photoDataUrl?: string;
};

export type StudentDraft = Omit<Student, "id"> & { id?: string };

export type StudentPhotoCrop = {
  zoom: number;
  offsetX: number;
  offsetY: number;
};
