import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Spinner } from '../components/ui/Spinner';
import { EmptyState } from '../components/ui/EmptyState';
import { UsersTable } from '../components/users/UsersTable';
import { CreateUserModal } from '../components/users/CreateUserModal';
import { RevealCodeModal } from '../components/users/RevealCodeModal';
import { useUsersStore } from '../stores/users.store';
import type { VolunteerStatus } from '../types/enums';

export function LeaderUsersPage() {
  const users = useUsersStore((s) => s.users);
  const loading = useUsersStore((s) => s.loading);
  const fetch = useUsersStore((s) => s.fetch);
  const updateStatus = useUsersStore((s) => s.updateStatus);
  const updateCapacity = useUsersStore((s) => s.updateCapacity);
  const removeUser = useUsersStore((s) => s.remove);
  const lastCreatedCode = useUsersStore((s) => s.lastCreatedCode);
  const clearLastCreatedCode = useUsersStore((s) => s.clearLastCreatedCode);

  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    void fetch();
  }, [fetch]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return users;
    return users.filter(
      (u) => u.name.toLowerCase().includes(q) || u.code.toLowerCase().includes(q),
    );
  }, [users, search]);

  const handleStatusChange = async (id: string, status: VolunteerStatus) => {
    try {
      await updateStatus(id, status);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Could not update status');
    }
  };

  const handleCapacityChange = async (id: string, capacity: number) => {
    try {
      await updateCapacity(id, capacity);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Could not update capacity');
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Delete ${name}? They will no longer be able to log in.`)) {
      return;
    }
    try {
      await removeUser(id);
      toast.success(`${name} deleted`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Could not delete user');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-xl font-bold text-slate-900">Users</h1>
        <div className="flex gap-2">
          <Input
            placeholder="Search name or code…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="sm:w-64"
          />
          <Button onClick={() => setModalOpen(true)}>+ Add User</Button>
        </div>
      </div>

      {loading && users.length === 0 ? (
        <div className="flex justify-center py-16">
          <Spinner />
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState title="No users found" />
      ) : (
        <UsersTable
          users={filtered}
          onStatusChange={(id, status) => void handleStatusChange(id, status)}
          onCapacityChange={(id, capacity) => void handleCapacityChange(id, capacity)}
          onDelete={(id) => {
            const user = filtered.find((u) => u.id === id);
            void handleDelete(id, user?.name ?? 'this user');
          }}
        />
      )}

      <CreateUserModal open={modalOpen} onClose={() => setModalOpen(false)} />
      <RevealCodeModal code={lastCreatedCode} onClose={clearLastCreatedCode} />
    </div>
  );
}
