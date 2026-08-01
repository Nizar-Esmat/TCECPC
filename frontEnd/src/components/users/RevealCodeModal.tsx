import { useState } from 'react';
import toast from 'react-hot-toast';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';

export function RevealCodeModal({ code, onClose }: { code: string | null; onClose: () => void }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!code) return;
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      toast.error('Could not copy to clipboard');
    }
  };

  return (
    <Modal open={Boolean(code)} onClose={onClose} title="User created">
      <div className="space-y-4 text-center">
        <p className="text-sm text-slate-500">
          Save this login code now — it won't be shown again anywhere in the app.
        </p>
        <p className="rounded-xl bg-slate-100 py-4 font-mono text-2xl font-bold tracking-widest text-slate-900">
          {code}
        </p>
        <div className="flex gap-2">
          <Button variant="secondary" className="flex-1" onClick={() => void handleCopy()}>
            {copied ? 'Copied ✓' : 'Copy code'}
          </Button>
          <Button className="flex-1" onClick={onClose}>
            Done
          </Button>
        </div>
      </div>
    </Modal>
  );
}
