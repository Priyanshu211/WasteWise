

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
  locationCoords: {
    lat: number;
    lng: number;
  };
  wasteCategory: 'Organic' | 'Recyclable' | 'Hazardous' | 'Mixed';
  status: 'Pending' | 'In Progress' | 'Completed';
  assignedWorker?: string;
  createdAt: string;
  imageUrl: string;
};

export type Facility = {
  id: string;
  name: string;
  type: 'W-to-E' | 'Biomethanization' | 'Recycling Center' | 'Scrap Shop';
  address: string;
  capacity: string;
  status: 'Active' | 'Under Maintenance';
};

export type TrainingProgress = {
  workerId: string;
  workerName: string;
  module: 'Hazardous Waste 101' | 'Advanced Composting' | 'Heavy Machinery Ops' | 'Safety Procedures';
  completion: number;
  lastAccessed: string;
};

export type TrainingProgram = {
  id: string;
  name: string;
  audience: 'Workers' | 'Citizens';
  phase: string;
  duration: string;
  status: 'Active' | 'Upcoming' | 'Completed';
  description: string;
  trainerName: string;
  startDate: string;
  endDate: string;
};



