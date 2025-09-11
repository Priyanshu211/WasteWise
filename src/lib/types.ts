

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
  safetyGearIssued?: boolean;
  attendance?: number;
  status?: 'On-Duty' | 'Off-Duty';
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
  location: {
    lat: number;
    lng: number;
  };
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
  seatsFilled: number;
};

export type TrainingFeedback = {
    id: string;
    name: string;
    avatarUrl: string;
    programName: string;
    rating: number;
    comment: string;
};

export type Citizen = {
  id: string;
  name: string;
  ward: string;
  training: 'Completed' | 'In Progress' | 'Not Started';
  dustbin: boolean;
  compost: boolean;
  avatar: string;
};

    