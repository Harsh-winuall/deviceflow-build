// app/api/proxy/route.ts
export async function POST(req: Request) {
  const body = await req.json();

  const res = await fetch("http://34.47.231.108:8080/generate-summary", {
    method: "POST",
    headers: {
      Authorization:
        "Bearer mOgvFKFWg9LLGIHqvqRe6HVgIkHUYUjGidJhAdRdMP9WCAzZoo1YSdIBk5QsZX66",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const data = await res.json();
  return new Response(JSON.stringify(data), {
    status: res.status,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
