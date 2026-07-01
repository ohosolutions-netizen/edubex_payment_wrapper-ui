type ZohoRecordResponse = {
  data?: Array<Record<string, unknown>>;
};

type PaymentSchedule = {
  status: string;
  formUrl: string;
  isPending: boolean;
};

const requiredEnv = [
  "ZOHO_ACCOUNTS_BASE_URL",
  "ZOHO_API_BASE_URL",
  "ZOHO_CLIENT_ID",
  "ZOHO_CLIENT_SECRET",
  "ZOHO_REFRESH_TOKEN",
  "ZOHO_PAYMENT_MODULE_API_NAME",
  "ZOHO_STATUS_FIELD_API_NAME",
  "ZOHO_FORM_URL_FIELD_API_NAME"
] as const;

function env(name: (typeof requiredEnv)[number]) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }

  return value;
}

function normalize(value: unknown) {
  return String(value ?? "").trim();
}

function csvEnv(name: string, fallback: string[]) {
  return (process.env[name] ?? fallback.join(","))
    .split(",")
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);
}

async function getAccessToken() {
  const body = new URLSearchParams({
    refresh_token: env("ZOHO_REFRESH_TOKEN"),
    client_id: env("ZOHO_CLIENT_ID"),
    client_secret: env("ZOHO_CLIENT_SECRET"),
    grant_type: "refresh_token"
  });

  const response = await fetch(`${env("ZOHO_ACCOUNTS_BASE_URL")}/oauth/v2/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body,
    cache: "no-store"
  });

  if (!response.ok) {
    throw new Error(`Zoho OAuth failed with HTTP ${response.status}.`);
  }

  const payload = (await response.json()) as { access_token?: string };

  if (!payload.access_token) {
    throw new Error("Zoho OAuth response did not include an access token.");
  }

  return payload.access_token;
}

/*export async function getPaymentSchedule(recordId: string): Promise<PaymentSchedule> {
  const accessToken = await getAccessToken();
  const moduleApiName = env("ZOHO_PAYMENT_MODULE_API_NAME");
  const statusField = env("ZOHO_STATUS_FIELD_API_NAME");
  const formUrlField = env("ZOHO_FORM_URL_FIELD_API_NAME");
  const fields = encodeURIComponent(`${statusField},${formUrlField}`);

 console.log("Zoho lookup debug", {
  apiBaseUrl: env("ZOHO_API_BASE_URL"),
  moduleApiName,
  recordId,
  statusField,
  formUrlField,
  fields
});

  const response = await fetch(
    `${env("ZOHO_API_BASE_URL")}/crm/v8/${moduleApiName}/${recordId}?fields=${fields}`,
    {
      headers: {
        Authorization: `Zoho-oauthtoken ${accessToken}`
      },
      cache: "no-store"
    }
  );

  if (!response.ok) {
    throw new Error(`Zoho CRM record lookup failed with HTTP ${response.status}.`);
  }

  const payload = (await response.json()) as ZohoRecordResponse;
  const record = payload.data?.[0];

  if (!record) {
    throw new Error("No Zoho CRM record was found for this payment schedule.");
  }

  const status = normalize(record[statusField]);
  const formUrl = normalize(record[formUrlField]);
  const pendingStatuses = csvEnv("PENDING_STATUS_VALUES", ["pending"]);

  return {
    status,
    formUrl,
    isPending: pendingStatuses.includes(status.toLowerCase())
  };
}*/
export async function getPaymentSchedule(recordId: string): Promise<PaymentSchedule> {
  if (!recordId) {
    throw new Error(`recordId is missing. Received: ${recordId}`);
  }

  // existing code
   const accessToken = await getAccessToken();
  const moduleApiName = env("ZOHO_PAYMENT_MODULE_API_NAME");
  const statusField = env("ZOHO_STATUS_FIELD_API_NAME");
  const formUrlField = env("ZOHO_FORM_URL_FIELD_API_NAME");
  const fields = encodeURIComponent(`${statusField},${formUrlField}`);

 console.log("Zoho lookup debug", {
  apiBaseUrl: env("ZOHO_API_BASE_URL"),
  moduleApiName,
  recordId,
  statusField,
  formUrlField,
  fields
});

  const response = await fetch(
    `${env("ZOHO_API_BASE_URL")}/crm/v8/${moduleApiName}/${recordId}?fields=${fields}`,
    {
      headers: {
        Authorization: `Zoho-oauthtoken ${accessToken}`
      },
      cache: "no-store"
    }
  );

  if (!response.ok) {
    throw new Error(`Zoho CRM record lookup failed with HTTP ${response.status}.`);
  }

  const payload = (await response.json()) as ZohoRecordResponse;
  const record = payload.data?.[0];

  if (!record) {
    throw new Error("No Zoho CRM record was found for this payment schedule.");
  }

  const status = normalize(record[statusField]);
  const formUrl = normalize(record[formUrlField]);
  const completedStatuses = csvEnv("COMPLETED_STATUS_VALUES", [
    "payment completed",
    "completed"
  ]);

  return {
    status,
    formUrl,
    isPending: !completedStatuses.includes(status.toLowerCase())
  };
}
