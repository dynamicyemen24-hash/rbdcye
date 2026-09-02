// API for contact form messages
const API_BASE = import.meta.env.VITE_API_URL || '';

interface MessagePayload {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

interface MessageResult {
  success: boolean;
  error?: string;
  id?: string;
}

export async function sendMessage(payload: MessagePayload): Promise<MessageResult> {
  try {
    // Try to send to the API endpoint
    const response = await fetch(`${API_BASE}/api/contact`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    return { success: true, id: data.id };
  } catch (err) {
    // Fallback: store locally if API is unavailable
    try {
      const localMessages = JSON.parse(localStorage.getItem('contact_messages') || '[]');
      localMessages.push({
        ...payload,
        id: `msg_${Date.now()}`,
        createdAt: new Date().toISOString(),
      });
      localStorage.setItem('contact_messages', JSON.stringify(localMessages));
      return { success: true, id: `local_${Date.now()}` };
    } catch {
      return { success: false, error: err instanceof Error ? err.message : 'Failed to send message' };
    }
  }
}

export async function getMessages(): Promise<MessagePayload[]> {
  try {
    const response = await fetch(`${API_BASE}/api/contact`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!response.ok) throw new Error('Failed to fetch');
    return await response.json();
  } catch {
    // Fallback to local storage
    return JSON.parse(localStorage.getItem('contact_messages') || '[]');
  }
}

