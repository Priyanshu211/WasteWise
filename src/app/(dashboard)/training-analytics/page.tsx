
'use client';

import { PageHeader } from '@/components/common/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TrainingParticipationChart } from '@/components/dashboard/training-participation-chart';
import { TrainingCompletionByAudienceChart } from '@/components/dashboard/training-completion-by-audience-chart';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { trainingFeedback } from '@/lib/data';
import { Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';


export default function TrainingAnalyticsPage() {
    
    const renderStars = (rating: number) => {
        return (
            <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                    <Star
                        key={i}
                        className={`h-4 w-4 ${i < rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`}
                    />
                ))}
            </div>
        )
    };

    return (
        <>
            <PageHeader
                title="Training Analytics & Feedback"
                description="Analyze training effectiveness and view participant feedback."
            />

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5 mb-6">
                <Card className="lg:col-span-3">
                    <CardHeader>
                        <CardTitle>Participation Trends</CardTitle>
                        <CardDescription>Monthly enrollment in training programs.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <TrainingParticipationChart />
                    </CardContent>
                </Card>
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Completion by Audience</CardTitle>
                        <CardDescription>Breakdown of completion rates by role.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <TrainingCompletionByAudienceChart />
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Participant Feedback</CardTitle>
                    <CardDescription>Recent feedback submitted by training participants.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Participant</TableHead>
                                <TableHead>Program</TableHead>
                                <TableHead>Rating</TableHead>
                                <TableHead>Comment</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {trainingFeedback.map(feedback => (
                                <TableRow key={feedback.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-9 w-9">
                                                <AvatarImage src={feedback.avatarUrl} alt={feedback.name} />
                                                <AvatarFallback>{feedback.name.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <span className="font-medium">{feedback.name}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline">{feedback.programName}</Badge>
                                    </TableCell>
                                    <TableCell>
                                        {renderStars(feedback.rating)}
                                    </TableCell>
                                    <TableCell className="text-muted-foreground">{feedback.comment}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </>
    )
}
