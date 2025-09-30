import { getTokenFromSession } from "@/server/helper";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const orgid = searchParams.get('orgid');
    const token = await getTokenFromSession();
  
    if (!orgid) {
      return new Response(JSON.stringify({ error: 'Missing orgid' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  
    const res = await fetch(`https://gcp-api.edify.club/edifybackend/v1/quality-check/org-report/ai-summary/${orgid}`, {
      method: 'POST',
      headers: {
        Authorization:
          `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}), // if you have any extra data, you can hardcode or skip
    });
  
    const data = await res.json();
    return new Response(JSON.stringify(data), {
      status: res.status,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
  