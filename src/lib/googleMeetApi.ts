export interface MeetSpaceConfig {
  accessType?: 'OPEN' | 'TRUSTED' | 'RESTRICTED';
  entryPointAccess?: 'ALL' | 'CREATOR_APP_ONLY';
}

export interface GoogleMeetSpace {
  name: string; // e.g. "spaces/s-pa-ce-id"
  meetingUri: string; // e.g. "https://meet.google.com/abc-defg-hij"
  meetingCode: string; // e.g. "abc-defg-hij"
  config?: MeetSpaceConfig;
  activeConference?: {
    conferenceRecord?: string;
  };
  createdAt?: string;
  title?: string;
}

/**
 * Creates a new Google Meet space using Google Meet REST API v2
 */
export async function createGoogleMeetSpace(
  accessToken: string,
  options?: {
    title?: string;
    accessType?: 'OPEN' | 'TRUSTED' | 'RESTRICTED';
  }
): Promise<GoogleMeetSpace> {
  const bodyPayload: any = {};
  if (options?.accessType) {
    bodyPayload.config = {
      accessType: options.accessType,
      entryPointAccess: 'ALL',
    };
  }

  const response = await fetch('https://meet.googleapis.com/v2/spaces', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(bodyPayload),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const message =
      errorData?.error?.message ||
      `Failed to create Google Meet space (${response.status}: ${response.statusText})`;
    throw new Error(message);
  }

  const data = await response.json();
  return {
    ...data,
    createdAt: new Date().toISOString(),
    title: options?.title || 'Ankit Patel Portfolio Consultation',
  };
}

/**
 * Fetches an existing Google Meet space
 */
export async function getGoogleMeetSpace(
  accessToken: string,
  spaceName: string
): Promise<GoogleMeetSpace> {
  const cleanName = spaceName.startsWith('spaces/') ? spaceName : `spaces/${spaceName}`;
  const response = await fetch(`https://meet.googleapis.com/v2/${cleanName}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData?.error?.message || `Failed to fetch Google Meet space (${response.status})`
    );
  }

  return await response.json();
}

/**
 * Updates meeting space settings with mandatory user confirmation
 */
export async function updateGoogleMeetSpaceConfig(
  accessToken: string,
  spaceName: string,
  newAccessType: 'OPEN' | 'TRUSTED' | 'RESTRICTED',
  userConfirmed: boolean
): Promise<GoogleMeetSpace> {
  if (!userConfirmed) {
    throw new Error('Operation cancelled: User confirmation required to modify space settings.');
  }

  const cleanName = spaceName.startsWith('spaces/') ? spaceName : `spaces/${spaceName}`;
  const response = await fetch(
    `https://meet.googleapis.com/v2/${cleanName}?updateMask=config.accessType`,
    {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        config: {
          accessType: newAccessType,
        },
      }),
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData?.error?.message || `Failed to update Google Meet settings (${response.status})`
    );
  }

  return await response.json();
}

/**
 * Ends an active conference with explicit confirmation
 */
export async function endActiveGoogleMeetConference(
  accessToken: string,
  spaceName: string,
  userConfirmed: boolean
): Promise<void> {
  if (!userConfirmed) {
    throw new Error('Operation cancelled: User confirmation required to end conference.');
  }

  const cleanName = spaceName.startsWith('spaces/') ? spaceName : `spaces/${spaceName}`;
  const response = await fetch(
    `https://meet.googleapis.com/v2/${cleanName}:endActiveConference`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData?.error?.message || `Failed to end active conference (${response.status})`
    );
  }
}
