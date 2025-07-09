// eslint-disable-next-line import/no-extraneous-dependencies
import { Incident as BaseIncident } from 'common/Incident';

export type OfflineIncident = Omit<BaseIncident, 'reportedBy'> & {
    id: string;
    expiresAt: string;
    offline: true;
  };