import { SetMetadata } from '@nestjs/common';

export const DASHBOARD_KEY = 'dashboard';

export const DashboardOnly = () =>
  SetMetadata(DASHBOARD_KEY, true);