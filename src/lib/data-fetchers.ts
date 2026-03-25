import { cache } from 'react';
import connectDB from './mongodb';
import SiteContent from '@/models/SiteContent';
import Project from '@/models/Project';
import Contact from '@/models/Contact';
import { portfolioConfig } from '@/config/portfolio';

import { stat } from 'fs/promises';
import { join } from 'path';

export const getInitialContent = cache(async () => {
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
});

export const getInitialProjects = cache(async () => {
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
});

export const getInitialMessages = cache(async () => {
  try {
    const db = await connectDB();
    if (!db) {
      return [];
    }

    const messages = await Contact.find({}).sort({ createdAt: -1 });
    
    // Return plain objects for serialization
    return JSON.parse(JSON.stringify(messages));
  } catch (error) {
    console.error('getInitialMessages error:', error);
    return [];
  }
});

export const getInitialCV = cache(async () => {
  try {
    const cvPath = join(process.cwd(), 'public', 'cv.pdf');
    const stats = await stat(cvPath);
    return {
      url: '/cv.pdf',
      lastModified: stats.mtime.toISOString(),
    };
  } catch (error) {
    return null;
  }
});
