import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useInitials } from '@/hooks/use-initials';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { Mentor } from './columns';

export default function MentorDetail({ mentor }: { mentor: Mentor }) {
    const getInitials = useInitials();
    return (
        <div className="space-y-6 rounded-lg border p-4">
            <h2 className="text-lg font-medium">Data Mentor</h2>

            <Table>
                <TableBody>
                    <TableRow>
                        <TableCell>Nama Mentor</TableCell>
                        <TableCell>{mentor.name}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Email</TableCell>
                        <TableCell>{mentor.email}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Nomor Telepon</TableCell>
                        <TableCell>{mentor.phone_number}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Komisi</TableCell>
                        <TableCell>{mentor.commission} %</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Foto Mentor</TableCell>
                        <TableCell>
                            <Avatar className="h-16 w-16">
                                <AvatarImage 
                                    src={mentor.photo_url ? (mentor.photo_url.startsWith('http') ? mentor.photo_url : `/storage/${mentor.photo_url}`) : (mentor.avatar || undefined)} 
                                    alt={mentor.name} 
                                    className="object-cover"
                                />
                                <AvatarFallback className="rounded-full bg-neutral-200 text-lg font-medium text-black dark:bg-neutral-700 dark:text-white">
                                    {getInitials(mentor.name)}
                                </AvatarFallback>
                            </Avatar>
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </div>
    );
}
