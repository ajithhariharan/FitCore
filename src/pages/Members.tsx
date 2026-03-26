import { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, query, where } from 'firebase/firestore';
import { db } from '../firebase';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '../components/ui/dialog';
import { Label } from '../components/ui/label';
import { Badge } from '../components/ui/badge';
import { Search, Plus } from 'lucide-react';

export function Members() {
  const [members, setMembers] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newMember, setNewMember] = useState({ name: '', email: '', phone: '', plan: 'Basic' });

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    const q = query(collection(db, 'users'), where('role', '==', 'member'));
    const querySnapshot = await getDocs(q);
    const membersData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    // If no real members yet, let's mock some for the UI
    if (membersData.length === 0) {
      setMembers([
        { id: '1', name: 'Alex Johnson', email: 'alex@example.com', phone: '555-0101', plan: 'Premium', status: 'Active' },
        { id: '2', name: 'Sarah Smith', email: 'sarah@example.com', phone: '555-0102', plan: 'Basic', status: 'Active' },
        { id: '3', name: 'Mike Brown', email: 'mike@example.com', phone: '555-0103', plan: 'Pro', status: 'Inactive' },
      ]);
    } else {
      setMembers(membersData);
    }
  };

  const handleAddMember = async () => {
    // In a real app, this would create an auth user or send an invite link
    // For now, we just add to the UI list
    const memberToAdd = {
      ...newMember,
      id: Math.random().toString(36).substr(2, 9),
      status: 'Active',
      role: 'member'
    };
    
    setMembers([...members, memberToAdd]);
    setIsAddModalOpen(false);
    setNewMember({ name: '', email: '', phone: '', plan: 'Basic' });
  };

  const filteredMembers = members.filter(m => 
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    m.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Members</h1>
          <p className="text-muted-foreground">Manage your gym members and their subscriptions.</p>
        </div>
        
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Member
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Member</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" value={newMember.name} onChange={e => setNewMember({...newMember, name: e.target.value})} placeholder="John Doe" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={newMember.email} onChange={e => setNewMember({...newMember, email: e.target.value})} placeholder="john@example.com" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" value={newMember.phone} onChange={e => setNewMember({...newMember, phone: e.target.value})} placeholder="(555) 000-0000" />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
              <Button onClick={handleAddMember}>Save Member</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search members..." 
            className="pl-8" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Plan</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredMembers.map((member) => (
              <TableRow key={member.id}>
                <TableCell className="font-medium">{member.name}</TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="text-sm">{member.email}</span>
                    <span className="text-xs text-muted-foreground">{member.phone}</span>
                  </div>
                </TableCell>
                <TableCell>{member.plan || 'Basic'}</TableCell>
                <TableCell>
                  <Badge variant={member.status === 'Active' ? 'default' : 'secondary'}>
                    {member.status || 'Active'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm">Edit</Button>
                </TableCell>
              </TableRow>
            ))}
            {filteredMembers.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  No members found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
