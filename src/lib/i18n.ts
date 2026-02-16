import messages from '@/locales/es.json';

export const locale = 'es';

export function t(key: string, vars?: Record<string, any>) {
  const parts = key.split('.');
  let val: any = messages as any;
  for (const p of parts) {
    if (val == null) return key;
    val = val[p];
  }
  if (val == null) return key;
  if (typeof val === 'string' && vars) {
    return val.replace(/\{(\w+)\}/g, (_, name) => {
      return vars[name] ?? `{${name}}`;
    });
  }
  return val;
}

export default t;
