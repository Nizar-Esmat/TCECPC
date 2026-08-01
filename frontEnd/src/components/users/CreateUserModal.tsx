import { useState } from 'react';
import type { FormEvent } from 'react';
import toast from 'react-hot-toast';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { useUsersStore } from '../../stores/users.store';
import { UserRole } from '../../types/enums';

export function CreateUserModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const create = useUsersStore((s) => s.create);
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole>(UserRole.VOLUNTEER);
  const [submitting, setSubmitting] = useState(false);

  const reset = () => {
    setName('');
    setRole(UserRole.VOLUNTEER);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setSubmitting(true);
    try {
      await create({ name: name.trim(), role });
      reset();
      onClose();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Could not create user');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Add User">
      <form onSubmit={(e) => void handleSubmit(e)} className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Name</label>
          <Input
            autoFocus
            placeholder="Jane Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Role</label>
          <Select value={role} onChange={(e) => setRole(e.target.value as UserRole)}>
            <option value={UserRole.VOLUNTEER}>Volunteer</option>
            <option value={UserRole.LEADER}>Leader</option>
          </Select>
        </div>
        <Button type="submit" className="w-full" loading={submitting} disabled={!name.trim()}>
          Create
        </Button>
      </form>
    </Modal>
  );
}
