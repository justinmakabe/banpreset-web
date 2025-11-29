'use client';

import { useState } from 'react';
import { Facebook, Instagram, Twitter, Youtube } from 'lucide-react';

interface SocialLinksProps {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    youtube?: string;
}

export default function SocialLinks({ facebook, instagram, twitter, youtube }: SocialLinksProps) {
    const links = [
        { icon: Facebook, url: facebook, label: 'Facebook' },
        { icon: Instagram, url: instagram, label: 'Instagram' },
        { icon: Twitter, url: twitter, label: 'Twitter' },
        { icon: Youtube, url: youtube, label: 'YouTube' }
    ].filter(link => link.url);

    if (links.length === 0) return null;

    return (
        <div className="flex items-center gap-3">
            {links.map(({ icon: Icon, url, label }) => (
                <a
                    key={label}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-white/5 hover:bg-primary/20 border border-white/10 hover:border-primary flex items-center justify-center text-gray-400 hover:text-primary transition-all"
                    aria-label={label}
                >
                    <Icon size={18} />
                </a>
            ))}
        </div>
    );
}
