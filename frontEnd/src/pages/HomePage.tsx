import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Select } from '../components/ui/Select';
import { Spinner } from '../components/ui/Spinner';
import { useTeamsStore } from '../stores/teams.store';
import { useRequestsStore } from '../stores/requests.store';
import { RequestType } from '../types/enums';
import type { RequestDto } from '../types/models';
import { formatHall, formatRequestType, formatTeam } from '../utils/formatters';

const REQUEST_TYPE_OPTIONS: { type: RequestType; label: string; icon: string }[] = [
  { type: RequestType.BATHROOM, label: 'Bathroom', icon: '🚻' },
  { type: RequestType.PRAYER, label: 'Prayer', icon: '🕌' },
  { type: RequestType.SMOKING, label: 'Smoking', icon: '🚬' },
  { type: RequestType.OTHER, label: 'Other', icon: '✋' },
];

export function HomePage() {
  const teams = useTeamsStore((s) => s.teams);
  const teamsLoading = useTeamsStore((s) => s.loading);
  const fetchTeams = useTeamsStore((s) => s.fetch);
  const createRequest = useRequestsStore((s) => s.create);

  const [hall, setHall] = useState('');
  const [teamId, setTeamId] = useState('');
  const [requestType, setRequestType] = useState<RequestType | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState<RequestDto | null>(null);

  useEffect(() => {
    void fetchTeams();
  }, [fetchTeams]);

  const halls = useMemo(() => {
    const unique = Array.from(new Set(teams.map((t) => t.hall)));
    return unique.sort();
  }, [teams]);

  const teamsInHall = useMemo(
    () => teams.filter((t) => t.hall === hall).sort((a, b) => a.teamNumber - b.teamNumber),
    [teams, hall],
  );

  const canSubmit = Boolean(teamId && requestType) && !submitting;

  const handleSubmit = async () => {
    if (!teamId || !requestType) return;
    setSubmitting(true);
    try {
      const created = await createRequest({ teamId, requestType });
      setSubmitted(created);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Could not submit your request');
    } finally {
      setSubmitting(false);
    }
  };

  const reset = () => {
    setSubmitted(null);
    setHall('');
    setTeamId('');
    setRequestType(null);
  };

  if (submitted) {
    return (
      <div className="mx-auto max-w-md">
        <Card className="text-center">
          <p className="text-4xl">✅</p>
          <h1 className="mt-3 text-xl font-bold text-slate-900">Request submitted</h1>
          <p className="mt-2 text-sm text-slate-500">
            {formatTeam(submitted.team.hall, submitted.team.teamNumber)} ·{' '}
            {formatRequestType(submitted.requestType)}
          </p>
          <p className="mt-4 text-sm text-slate-500">
            A volunteer will come find you shortly. No need to wait here — this page won't track
            it live, so there's nothing more to do.
          </p>
          <Button className="mt-6 w-full" onClick={reset}>
            Submit another request
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold text-slate-900">Need help?</h1>
        <p className="mt-1 text-sm text-slate-500">
          Tell us where you are and what you need — no login required.
        </p>
      </div>

      <Card className="space-y-5">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Hall</label>
          {teamsLoading ? (
            <Spinner />
          ) : (
            <Select
              value={hall}
              onChange={(e) => {
                setHall(e.target.value);
                setTeamId('');
              }}
            >
              <option value="">Select your hall…</option>
              {halls.map((h) => (
                <option key={h} value={h}>
                  {formatHall(h)}
                </option>
              ))}
            </Select>
          )}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Team number</label>
          <Select value={teamId} onChange={(e) => setTeamId(e.target.value)} disabled={!hall}>
            <option value="">Select your team…</option>
            {teamsInHall.map((t) => (
              <option key={t.id} value={t.id}>
                Team {t.teamNumber}
              </option>
            ))}
          </Select>
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
