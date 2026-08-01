import { useState } from 'react';
import toast from 'react-hot-toast';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Select } from '../components/ui/Select';
import { Input } from '../components/ui/Input';
import { useRequestsStore } from '../stores/requests.store';
import { Gender, Hall, RequestType } from '../types/enums';
import { formatGender, formatHall, formatTeam } from '../utils/formatters';

const REQUEST_TYPE_OPTIONS: { type: RequestType; label: string; icon: string }[] = [
  { type: RequestType.BATHROOM, label: 'Bathroom', icon: '🚻' },
  { type: RequestType.PRAYER, label: 'Prayer', icon: '🕌' },
  { type: RequestType.SMOKING, label: 'Smoking', icon: '🚬' },
  { type: RequestType.OTHER, label: 'Other', icon: '✋' },
];

const GENDER_OPTIONS = Object.values(Gender);

const HALL_OPTIONS = Object.values(Hall);

export function HomePage() {
  const createRequest = useRequestsStore((s) => s.create);

  const [hall, setHall] = useState('');
  const [teamNumber, setTeamNumber] = useState('');
  const [gender, setGender] = useState<Gender | null>(null);
  const [requestType, setRequestType] = useState<RequestType | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const parsedTeamNumber = Number(teamNumber);
  const canSubmit =
    Boolean(hall) &&
    Boolean(gender) &&
    Boolean(requestType) &&
    Number.isInteger(parsedTeamNumber) &&
    parsedTeamNumber > 0 &&
    !submitting;

  const handleSubmit = async () => {
    if (!hall || !gender || !requestType || !canSubmit) return;
    setSubmitting(true);
    try {
      const created = await createRequest({
        hall: hall as Hall,
        teamNumber: parsedTeamNumber,
        gender,
        requestType,
      });
      toast.success(
        `Request submitted — ${formatTeam(created.hall, created.teamNumber)}. A volunteer will come find you shortly.`,
      );
      setHall('');
      setTeamNumber('');
      setGender(null);
      setRequestType(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Could not submit your request');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-md">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold text-slate-900">Need help?</h1>
        <p className="mt-1 text-sm text-slate-500">
          Tell us where you are and what you need — no login required.
        </p>
      </div>

      <Card className="space-y-5">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Hall</label>
            <Select value={hall} onChange={(e) => setHall(e.target.value)}>
              <option value="">Select…</option>
              {HALL_OPTIONS.map((h) => (
                <option key={h} value={h}>
                  {formatHall(h)}
                </option>
              ))}
            </Select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Team number</label>
            <Input
              type="number"
              min={1}
              inputMode="numeric"
              placeholder="e.g. 12"
              value={teamNumber}
              onChange={(e) => setTeamNumber(e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">Gender</label>
          <div className="grid grid-cols-2 gap-2">
            {GENDER_OPTIONS.map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => setGender(g)}
                className={`rounded-xl border px-3 py-3 text-sm font-medium transition-colors ${
                  gender === g
                    ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                    : 'border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
              >
                {formatGender(g)}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">What do you need?</label>
          <div className="grid grid-cols-2 gap-2">
            {REQUEST_TYPE_OPTIONS.map((opt) => (
              <button
                key={opt.type}
                type="button"
                onClick={() => setRequestType(opt.type)}
                className={`flex flex-col items-center gap-1 rounded-xl border px-3 py-3 text-sm font-medium transition-colors ${
                  requestType === opt.type
                    ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                    : 'border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
              >
                <span className="text-xl">{opt.icon}</span>
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <Button
          size="lg"
          className="w-full"
          disabled={!canSubmit}
          loading={submitting}
          onClick={() => void handleSubmit()}
        >
          Request Help
        </Button>
      </Card>
    </div>
  );
}
