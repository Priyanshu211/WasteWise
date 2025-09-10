
'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import type { Complaint } from '@/lib/types';
import { complaints as initialComplaints } from '@/lib/data';

interface ComplaintsContextType {
  complaints: Complaint[];
  updateComplaint: (updatedComplaint: Complaint) => void;
}

const ComplaintsContext = createContext<ComplaintsContextType | undefined>(undefined);

export function ComplaintsProvider({ children }: { children: ReactNode }) {
  const [complaints, setComplaints] = useState<Complaint[]>(initialComplaints);

  const updateComplaint = (updatedComplaint: Complaint) => {
    setComplaints(prevComplaints =>
      prevComplaints.map(c => (c.id === updatedComplaint.id ? updatedComplaint : c))
    );
  };

  return (
    <ComplaintsContext.Provider value={{ complaints, updateComplaint }}>
      {children}
    </ComplaintsContext.Provider>
  );
}

export function useComplaints() {
  const context = useContext(ComplaintsContext);
  if (context === undefined) {
    throw new Error('useComplaints must be used within a ComplaintsProvider');
  }
  return context;
}
