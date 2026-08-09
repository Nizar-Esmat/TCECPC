import { useState } from 'react';
import type { FormEvent } from 'react';
import toast from 'react-hot-toast';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { useUsersStore } from '../../stores/users.store';
import { UserRole } from '../../types/enums';

const HALL_NUMBERS = [1, 2, 3, 4];

export function BulkCreateUsersModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const createBulk = useUsersStore((s) => s.createBulk);
  const [role, setRole] = useState<UserRole>(UserRole.VOLUNTEER);
  const [hall, setHall] = useState(1);
  const [names, setNames] = useState<string[]>(['']);
  const [submitting, setSubmitting] = useState(false);

  const reset = () => {
    setRole(UserRole.VOLUNTEER);
    setHall(1);
    setNames(['']);
  };

  const trimmedNames = names.map((n) => n.trim()).filter(Boolean);
  const canSubmit = trimmedNames.length > 0 && !submitting;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setSubmitting(true);
    try {
      await createBulk({
        role,
        hall,
        users: trimmedNames.map((name) => ({ name })),
      });
      reset();
      onClose();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Could not create users');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Add Users">
      <form onSubmit={(e) => void handleSubmit(e)} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Role</label>
            <Select value={role} onChange={(e) => setRole(e.target.value as UserRole)}>
              <option value={UserRole.VOLUNTEER}>Volunteer</option>
              <option value={UserRole.LEADER}>Leader</option>
            </Select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Hall</label>
            <Select value={hall} onChange={(e) => setHall(Number(e.target.value))}>
              {HALL_NUMBERS.map((h) => (
                <option key={h} value={h}>
                  Hall {h}
                </option>
              ))}
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700">Names</label>
          {names.map((name, i) => (
            <div key={i} className="flex gap-2">
              <Input
                autoFocus={i === 0}
                placeholder="Jane Doe"
                value={name}
                onChange={(e) =>
                  setNames((prev) => prev.map((n, idx) => (idx === i ? e.target.value : n)))
                }
              />
              {names.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setNames((prev) => prev.filter((_, idx) => idx !== i))}
                >
                  Remove
                </Button>
              )}
            </div>
          ))}
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => setNames((prev) => [...prev, ''])}
          >
            + Add another
          </Button>
        </div>

        <Button type="submit" className="w-full" loading={submitting} disabled={!canSubmit}>
          Create {trimmedNames.length > 1 ? `${trimmedNames.length} users` : 'user'}
        </Button>
      </form>
    </Modal>
  );
}
