import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import SiteContent from '@/models/SiteContent';
import { portfolioConfig } from '@/config/portfolio';
import { verifyAdminPassword } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const section = searchParams.get('section');

    await connectDB();

    if (section) {
      const content = await SiteContent.findOne({ section });
      if (content) {
        return NextResponse.json({ data: content.data });
      }

      // If not found in DB, return default from portfolioConfig
      const defaultData = (portfolioConfig as any)[section];
      if (defaultData) {
        return NextResponse.json({ data: defaultData });
      }
      
      // Special case for branding if not in portfolioConfig
      if (section === 'branding') {
        return NextResponse.json({ data: { logo: '', heading: 'PORTFOLIO' } });
      }

      return NextResponse.json({ data: null });
    }

    const content = await SiteContent.find({});
    
    // Convert array to object
    const contentObj = content.reduce((acc, item) => {
      acc[item.section] = item.data;
      return acc;
    }, {} as Record<string, any>);

    // Ensure baseline keys exist
    const baseline = {
      hero: portfolioConfig.hero,
      about: portfolioConfig.about,
      skills: portfolioConfig.skills,
      footer: portfolioConfig.footer,
      socials: portfolioConfig.socials,
      ...contentObj
    };

    return NextResponse.json(baseline);
  } catch (error) {
    const err = error as Error;
    console.error('GET /api/content error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { section, data, password } = body;

    const isAuthorized = await verifyAdminPassword(password);
    if (!isAuthorized) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const content = await SiteContent.findOneAndUpdate(
      { section },
      { data },
      { upsert: true, new: true }
    );

    return NextResponse.json(content);
  } catch (error) {
    const err = error as Error;
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
