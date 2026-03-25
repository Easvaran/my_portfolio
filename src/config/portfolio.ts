export const portfolioConfig = {
  navigation: [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Skills', href: '#skills' },
    { name: 'Projects', href: '#projects' },
    { name: 'Contact', href: '#contact' },
  ],
  hero: {
    name: 'Alex Johnson',
    title: 'Full Stack Developer',
    subtitle: 'Building Digital Masterpieces',
    description: 'I design and build high-performance, modern web applications with cutting-edge technologies. Turning complex problems into elegant digital solutions.',
    ctaPrimary: { text: 'View My Work', href: '#projects' },
    ctaSecondary: { text: 'Download CV', href: '/resume.pdf' },
    profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=1000', // Example professional headshot
  },
  about: {
    title: 'About Me',
    subtitle: "I'm a passionate full-stack developer with a focus on building modern, performant web applications. I love turning complex ideas into simple, elegant digital solutions.",
    stats: [
      { label: 'Years Experience', value: '5+', icon: 'Rocket' },
      { label: 'Projects Completed', value: '50+', icon: 'Code' },
      { label: 'Design Skills', value: '90%', icon: 'Palette' },
      { label: 'Client Satisfaction', value: '100%', icon: 'User' },
    ],
    details: {
      title: 'A Little More About Me',
      paragraphs: [
        "My journey as a developer started with a simple curiosity about how things work on the web. Over the years, I've honed my skills in both frontend and backend development, working with diverse clients and projects.",
        "I believe in writing clean, maintainable code and building interfaces that provide a seamless user experience. When I'm not coding, you'll find me exploring new technologies, contributing to open-source projects, or sharing my knowledge with the developer community.",
      ],
      values: [
        { title: 'Innovation', description: 'Constantly pushing boundaries with new ideas.', color: 'emerald' },
        { title: 'Performance', description: 'Building fast, optimized web experiences.', color: 'blue' },
        { title: 'Accessibility', description: 'Ensuring the web is inclusive for everyone.', color: 'purple' },
      ],
    },
  },
  skills: {
    title: 'My Skills',
    subtitle: "I've spent years mastering these tools and technologies to build high-quality web applications.",
    categories: [
      {
        title: 'Frontend',
        icon: 'Layout',
        skills: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'Redux'],
      },
      {
        title: 'Backend',
        icon: 'Server',
        skills: ['Node.js', 'Express', 'MongoDB', 'PostgreSQL', 'REST API', 'GraphQL'],
      },
      {
        title: 'Tools & DevOps',
        icon: 'Wrench',
        skills: ['Git', 'Docker', 'AWS', 'Vercel', 'Firebase', 'CI/CD'],
      },
      {
        title: 'Other',
        icon: 'Plus',
        skills: ['UI/UX Design', 'Agile', 'Unit Testing', 'SEO', 'Mobile First', 'Microservices'],
      },
    ],
  },
  projects: {
    title: 'Featured Projects',
    subtitle: 'A collection of my most impactful projects, showcasing my expertise in various technologies.',
    items: [
      {
        title: 'E-commerce Platform',
        description: 'A full-stack e-commerce solution built with Next.js, Stripe, and MongoDB. Features include real-time inventory and modern UI.',
        image: 'https://images.unsplash.com/photo-1557821552-17105176677c?auto=format&fit=crop&q=80&w=1000',
        tags: ['Next.js', 'Stripe', 'MongoDB', 'Tailwind'],
        live: 'https://example.com',
        github: 'https://github.com',
      },
      {
        title: 'SaaS Dashboard',
        description: 'An analytics dashboard with data visualization and real-time updates. Designed for performance and ease of use.',
        image: 'https://images.unsplash.com/photo-1551288049-bbda38a5f971?auto=format&fit=crop&q=80&w=1000',
        tags: ['React', 'Chart.js', 'Firebase', 'TypeScript'],
        live: 'https://example.com',
        github: 'https://github.com',
      },
      {
        title: 'AI Image Generator',
        description: 'A web app that generates high-quality images using AI models. Features user authentication and gallery sharing.',
        image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=1000',
        tags: ['Next.js', 'OpenAI API', 'Supabase', 'Framer Motion'],
        live: 'https://example.com',
        github: 'https://github.com',
      },
    ],
    githubLink: 'https://github.com',
  },
  socials: [
    { name: 'Github', href: 'https://github.com', icon: 'Github' },
    { name: 'Linkedin', href: 'https://linkedin.com', icon: 'Linkedin' },
    { name: 'Twitter', href: 'https://twitter.com', icon: 'Twitter' },
    { name: 'Email', href: 'mailto:contact@example.com', icon: 'Mail' },
  ],
  footer: {
    text: 'A professional developer portfolio showcasing expertise in building modern, scalable web applications.',
    copyright: `© ${new Date().getFullYear()} Professional Developer Portfolio. All rights reserved.`,
  },
};
