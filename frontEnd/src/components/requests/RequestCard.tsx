import type { ReactNode } from 'react';
import { Card } from '../ui/Card';
import { StatusBadge } from './StatusBadge';
import type { RequestDto } from '../../types/models';
import { formatRequestType, formatTeam, timeAgo } from '../../utils/formatters';

export function RequestCard({
  request,
  actions,
}: {
  request: RequestDto;
  actions?: ReactNode;
}) {
  return (
    <Card className="flex flex-col gap-3">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-sm font-semibold text-slate-900">
            {formatTeam(request.team.hall, request.team.teamNumber)}
          </p>
          <p className="text-sm text-slate-500">{formatRequestType(request.requestType)}</p>
        </div>
        <StatusBadge status={request.status} />
      </div>

      {request.volunteer && (
        <p className="text-xs text-slate-500">
          Volunteer: <span className="font-medium text-slate-700">{request.volunteer.name}</span>
        </p>
      )}

      <p className="text-xs text-slate-400">Created {timeAgo(request.createdAt)}</p>

      {actions && <div className="mt-1 flex flex-wrap gap-2">{actions}</div>}
    </Card>
  );
}
