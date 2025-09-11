
'use client';
import { PageHeader } from '@/components/common/page-header';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { FileDown, Medal, Users, User, Home } from 'lucide-react';
import { workers, complaints, societies } from '@/lib/data';
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useMemo } from 'react';
import { Progress } from '@/components/ui/progress';

type CitizenLeaderboardEntry = {
    userName: string;
    userPhotoUrl: string;
    complaintsFiled: number;
}

export default function LeaderboardPage() {
  const sortedWorkers = [...workers].sort((a, b) => b.tasksCompleted - a.tasksCompleted);

  const citizenLeaderboard = useMemo(() => {
    const citizenCounts = complaints.reduce((acc, complaint) => {
        if (!acc[complaint.userName]) {
            acc[complaint.userName] = {
                userName: complaint.userName,
                userPhotoUrl: complaint.userPhotoUrl,
                complaintsFiled: 0
            };
        }
        acc[complaint.userName].complaintsFiled++;
        return acc;
    }, {} as Record<string, CitizenLeaderboardEntry>);

    return Object.values(citizenCounts).sort((a,b) => b.complaintsFiled - a.complaintsFiled);
  }, []);

  const sortedSocieties = [...societies].sort((a, b) => b.cleanlinessScore - a.cleanlinessScore);

  const getBadge = (rank: number) => {
    if (rank === 0) return <Medal className="h-5 w-5 text-yellow-500" />;
    if (rank === 1) return <Medal className="h-5 w-5 text-gray-400" />;
    if (rank === 2) return <Medal className="h-5 w-5 text-yellow-700" />;
    return <span className="text-sm text-muted-foreground">{rank + 1}</span>;
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 75) return 'text-yellow-600';
    return 'text-red-600';
  }

  return (
    <>
      <PageHeader
        title="Leaderboard"
        description="Recognize top performers and foster healthy competition."
      >
        <Button variant="outline">
          <FileDown className="mr-2 h-4 w-4" />
          Export
        </Button>
      </PageHeader>
      <Tabs defaultValue="workers">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="workers">
            <Users className="mr-2 h-4 w-4" />
            Worker Leaderboard
            </TabsTrigger>
          <TabsTrigger value="citizens">
            <User className="mr-2 h-4 w-4" />
            Citizen Leaderboard
          </TabsTrigger>
          <TabsTrigger value="societies">
            <Home className="mr-2 h-4 w-4" />
            Societies & Localities
          </TabsTrigger>
        </TabsList>
        <TabsContent value="workers">
            <Card>
                <CardHeader>
                <CardTitle>Top Performing Workers</CardTitle>
                <CardDescription>Ranked by tasks completed this month.</CardDescription>
                </CardHeader>
                <CardContent>
                <Table>
                    <TableHeader>
                    <TableRow>
                        <TableHead className="w-[80px]">Rank</TableHead>
                        <TableHead>Worker</TableHead>
                        <TableHead className="text-right">Tasks Completed</TableHead>
                        <TableHead className="text-right">Performance Score</TableHead>
                    </TableRow>
                    </TableHeader>
                    <TableBody>
                    {sortedWorkers.map((worker, index) => (
                        <TableRow key={worker.workerId}>
                        <TableCell>
                            <div className="flex items-center justify-center font-bold">
                                {getBadge(index)}
                            </div>
                        </TableCell>
                        <TableCell className="font-medium">{worker.name}</TableCell>
                        <TableCell className="text-right">{worker.tasksCompleted}</TableCell>
                        <TableCell className="text-right">{worker.performance}%</TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
                </CardContent>
            </Card>
        </TabsContent>
        <TabsContent value="citizens">
            <Card>
                <CardHeader>
                <CardTitle>Top Contributing Citizens</CardTitle>
                <CardDescription>Ranked by number of complaints filed.</CardDescription>
                </CardHeader>
                <CardContent>
                <Table>
                    <TableHeader>
                    <TableRow>
                        <TableHead className="w-[80px]">Rank</TableHead>
                        <TableHead>Citizen</TableHead>
                        <TableHead className="text-right">Complaints Filed</TableHead>
                    </TableRow>
                    </TableHeader>
                    <TableBody>
                    {citizenLeaderboard.map((citizen, index) => (
                        <TableRow key={citizen.userName}>
                        <TableCell>
                             <div className="flex items-center justify-center font-bold">
                                {getBadge(index)}
                            </div>
                        </TableCell>
                        <TableCell className="font-medium">
                           <div className="flex items-center gap-3">
                                <Avatar className="h-9 w-9">
                                <AvatarImage src={citizen.userPhotoUrl} alt={citizen.userName} />
                                <AvatarFallback>{citizen.userName.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <span>{citizen.userName}</span>
                            </div>
                        </TableCell>
                        <TableCell className="text-right">{citizen.complaintsFiled}</TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
                </CardContent>
            </Card>
        </TabsContent>
        <TabsContent value="societies">
            <Card>
                <CardHeader>
                <CardTitle>Top Cleanest Societies & Localities</CardTitle>
                <CardDescription>Ranked by overall cleanliness and citizen participation.</CardDescription>
                </CardHeader>
                <CardContent>
                <Table>
                    <TableHeader>
                    <TableRow>
                        <TableHead className="w-[80px]">Rank</TableHead>
                        <TableHead>Society / Locality</TableHead>
                        <TableHead>Ward</TableHead>
                        <TableHead>Participation Rate</TableHead>
                        <TableHead className="text-right">Cleanliness Score</TableHead>
                    </TableRow>
                    </TableHeader>
                    <TableBody>
                    {sortedSocieties.map((society, index) => (
                        <TableRow key={society.id}>
                        <TableCell>
                            <div className="flex items-center justify-center font-bold">
                                {getBadge(index)}
                            </div>
                        </TableCell>
                        <TableCell className="font-medium">{society.name}</TableCell>
                        <TableCell>{society.ward}</TableCell>
                        <TableCell>
                            <div className="flex items-center gap-2">
                                <Progress value={society.participationRate} className="w-24 h-2" />
                                <span className="text-xs text-muted-foreground">{society.participationRate}%</span>
                            </div>
                        </TableCell>
                        <TableCell className={`text-right font-bold ${getScoreColor(society.cleanlinessScore)}`}>
                            {society.cleanlinessScore} / 100
                        </TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
                </CardContent>
            </Card>
        </TabsContent>
      </Tabs>
    </>
  );
}
