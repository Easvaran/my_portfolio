import connectDB from './mongodb';
import SiteContent from '@/models/SiteContent';
import Project from '@/models/Project';
import { portfolioConfig } from '@/config/portfolio';

export async function getInitialContent() {
  try {
    const db = await connectDB();
    if (!db) {
      return portfolioConfig;
    }

    const content = await SiteContent.find({});
    
    // Convert array to object
    const contentObj = content.reduce((acc, item) => {
      acc[item.section] = item.data;
      return acc;
    }, {} as Record<string, any>);

    // Ensure baseline keys exist
    const baseline = {
      ...portfolioConfig,
      ...contentObj
    };

    return baseline;
  } catch (error) {
    console.error('getInitialContent error:', error);
    return portfolioConfig;
  }
}

export async function getInitialProjects() {
  try {
    const db = await connectDB();
    if (!db) {
      return portfolioConfig.projects.items;
    }

    const projects = await Project.find({}).sort({ order: 1 });
    
    // Return plain objects for serialization
    return JSON.parse(JSON.stringify(projects));
  } catch (error) {
    console.error('getInitialProjects error:', error);
    return portfolioConfig.projects.items;
  }
}
