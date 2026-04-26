import { readFile } from 'fs/promises';
import { join } from 'path';

export async function GET() {
  try {
    const filePath = join(process.cwd(), 'docs', 'discoverability', 'llms.txt');
    let content = await readFile(filePath, 'utf-8');

    // Token replacement
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://theflytrapferndale.com';
    content = content.replace(/{{HOST}}/g, baseUrl);
    content = content.replace(/{{HOURS}}/g, 'Mon-Sun 8am-3pm');
    content = content.replace(/{{PHONE}}/g, '(248) 399-5150');
    content = content.replace(/{{ADDRESS}}/g, '22950 Woodward Ave, Ferndale MI 48220');

    return new Response(content, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
      },
    });
  } catch (error) {
    return new Response('Not configured', {
      status: 200,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
      },
    });
  }
}
