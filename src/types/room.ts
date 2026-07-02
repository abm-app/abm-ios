export interface Room {
  rmCode: string;
  name: string;
  property: string;
}

export const ROOMS_DB: Record<string, string> = {
  DLX_CV: 'Deluxe City View Room',
  EXEC_SU: 'Executive Suite',
  STD_Q: 'Standard Queen Room',
  STD_K: 'Standard King Room',
  PREM_SU: 'Premium Suite',
  PRES_SU: 'Presidential Suite',
};
