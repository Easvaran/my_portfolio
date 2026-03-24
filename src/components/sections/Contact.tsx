'use client';

import Section from '../Section';
import ContactForm from '../ContactForm';
import { useContent } from '@/context/ContentContext';
import * as Icons from 'lucide-react';

const Contact = () => {
  const { content } = useContent();
  const { title, subtitle, details, info } = content.contact || {
    title: 'Get In Touch',
    subtitle: "Have a project in mind or just want to say hello? I'd love to hear from you.",
    details: "I'm always open to discussing new projects, creative ideas or opportunities to be part of your visions.",
    info: [
      { icon: 'Mail', label: 'Email', value: 'contact@example.com', href: 'mailto:contact@example.com' },
      { icon: 'Phone', label: 'Phone', value: '+1 (234) 567-890', href: 'tel:+1234567890' },
      { icon: 'MapPin', label: 'Location', value: 'San Francisco, CA', href: '#' },
    ],
  };

  const socials = content.socials || [];

  return (
    <Section
      id="contact"
      title={title}
      subtitle={subtitle}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        {/* Contact Info */}
        <div className="space-y-12">
          <div className="space-y-8">
            <h3 className="text-3xl font-black tracking-tight text-foreground">Contact Information</h3>
            <p className="text-secondary text-lg leading-relaxed">
              {details}
            </p>
          </div>

          <div className="space-y-8">
            {info.map((item: any, index: number) => {
              const IconComponent = (Icons as any)[item.icon] || Icons.HelpCircle;
              return (
                <a
                  key={index}
                  href={item.href}
                  className="flex items-center gap-6 group p-4 -ml-4 rounded-2xl hover:bg-white/5 transition-all duration-300 backdrop-blur-sm"
                >
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-inner">
                    <IconComponent size={28} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-secondary uppercase tracking-widest mb-1">{item.label}</p>
                    <p className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">{item.value}</p>
                  </div>
                </a>
              );
            })}
          </div>

          <div className="pt-10 border-t border-white/10">
            <h4 className="text-sm font-bold text-secondary uppercase tracking-widest mb-6">
              {content.socials_section?.title || 'Follow Me'}
            </h4>
            <div className="flex gap-4">
              {socials.map((social: any, index: number) => {
                const IconComponent = (Icons as any)[social.icon] || Icons.Link;
                return (
                  <a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-secondary hover:bg-primary hover:text-white hover:scale-110 transition-all duration-300 border border-white/10"
                    aria-label={social.name}
                  >
                    <IconComponent size={24} />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <ContactForm />
      </div>
    </Section>
  );
};

export default Contact;
