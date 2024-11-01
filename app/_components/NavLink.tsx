'use client';

import { usePathname } from 'next/navigation';
import Link, { LinkProps } from 'next/link';
import React from 'react';
import clsx from 'clsx';

export { NavLink };

function NavLink({ children, href, exact = false, className, ...props }: INavLink) {
    const pathname = usePathname();
    const isActive = exact ? pathname === href : pathname?.startsWith(href);

    
    return (
        <Link href={href} {...props} className={clsx(className,
            {
                active: isActive
            })}>
            {children}
        </Link>
    );
}

interface INavLink extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'>, LinkProps {
    children: React.ReactNode;
    href: string;
    exact?: boolean;
}