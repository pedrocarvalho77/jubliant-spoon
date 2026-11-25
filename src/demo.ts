// Demo mode (REACT_APP_DEMO=true): the runner is simulated in the browser,
// so the app works without a backend, e.g. on GitHub Pages.
export const DEMO = process.env.REACT_APP_DEMO === 'true';

const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status });

// shortcut: no real YAML parsing, only picks `- $action(...)` lines out of the text; use the real API for accurate results
export async function demoFetch(_url: string, init?: RequestInit): Promise<Response> {
  await new Promise(resolve => setTimeout(resolve, 600));
  const { configuration = '' } = JSON.parse(String(init?.body ?? '{}'));

  if (!configuration.trim()) return new Response('configuration is required', { status: 400 });
  if (!/^api-version:/m.test(configuration)) {
    return new Response('Error loading configuration: missing api-version', { status: 400 });
  }

  const actions: string[] = configuration
    .split('\n')
    .map((line: string) => line.match(/^\s*-\s*(\$\w+\(.*\))\s*$/)?.[1])
    .filter(Boolean);
  return json({ Statements: actions.map(Code => ({ Code })) });
}
