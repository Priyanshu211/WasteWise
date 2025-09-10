export type Worker = {
  workerId: string;
  name: string;
  area: string;
  trainingPhase: 'Phase 1' | 'Phase 2' | 'Completed';
  tasksCompleted: number;
  performance: number;
  location: {
    lat: number;
    lng: number;
  };
  skills: string[];
};

export type Complaint = {
  id: string;
  userName: string;
  userPhotoUrl: string;
  location: string;
  wasteCategory: 'Organic' | 'Recyclable' | 'Hazardous' | 'Mixed';
  status: 'Pending' | 'In Progress' | 'Completed';
  assignedWorker?: string;
  createdAt: string;
  imageUrl: string;
};

export type Facility = {
  id: string;
  name: string;
  type: 'Recycling Center' | 'Compost Plant' | 'Scrap Shop';
  location: string;
};
