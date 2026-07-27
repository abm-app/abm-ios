import apiClient from '../client';

export const getRoomTypes = async (): Promise<string[]> => {
  const response = await apiClient.get<string[]>('/status/room-types');
  return response.data;
};
