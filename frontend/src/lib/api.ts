const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

async function request<T>(
  path: string,
  options: RequestInit = {},
  sessionToken?: string,
): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };
  if (sessionToken) headers['x-session-token'] = sessionToken;

  const res = await fetch(`${API_URL}${path}`, { ...options, headers });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(err.message || 'Request failed');
  }
  return res.json();
}

export const api = {
  // Rooms
  createRoom: (data: { name: string; moderatorName: string }) =>
    request('/api/rooms', { method: 'POST', body: JSON.stringify(data) }),

  getRoom: (code: string) =>
    request(`/api/rooms/${code}`),

  joinRoom: (code: string, data: { name: string }) =>
    request(`/api/rooms/${code}/join`, { method: 'POST', body: JSON.stringify(data) }),

  reconnect: (code: string, sessionToken: string) =>
    request(`/api/rooms/${code}/reconnect`, { method: 'POST', body: JSON.stringify({ sessionToken }) }),

  getParticipants: (code: string) =>
    request(`/api/rooms/${code}/participants`),

  transferModerator: (code: string, newModeratorId: string, sessionToken: string) =>
    request(`/api/rooms/${code}/transfer-moderator`, { method: 'PATCH', body: JSON.stringify({ newModeratorId }) }, sessionToken),

  // Tickets
  createTicket: (code: string, data: { title: string; description?: string }, sessionToken: string) =>
    request(`/api/rooms/${code}/tickets`, { method: 'POST', body: JSON.stringify(data) }, sessionToken),

  getTickets: (code: string) =>
    request(`/api/rooms/${code}/tickets`),

  startVoting: (code: string, ticketId: string, sessionToken: string) =>
    request(`/api/rooms/${code}/tickets/${ticketId}/start-voting`, { method: 'PATCH' }, sessionToken),

  revealVotes: (code: string, ticketId: string, sessionToken: string) =>
    request(`/api/rooms/${code}/tickets/${ticketId}/reveal`, { method: 'PATCH' }, sessionToken),

  completeTicket: (code: string, ticketId: string, data: { finalEstimate: string }, sessionToken: string) =>
    request(`/api/rooms/${code}/tickets/${ticketId}/complete`, { method: 'PATCH', body: JSON.stringify(data) }, sessionToken),

  // Votes
  castVote: (code: string, ticketId: string, data: { value: string; sessionToken: string }) =>
    request(`/api/rooms/${code}/tickets/${ticketId}/votes`, { method: 'POST', body: JSON.stringify(data) }),

  getVotes: (code: string, ticketId: string) =>
    request(`/api/rooms/${code}/tickets/${ticketId}/votes`),
};
