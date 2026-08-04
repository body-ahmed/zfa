export async function GET() {
  return Response.json({ ok: true, app: "zaffa", timestamp: new Date().toISOString() });
}
