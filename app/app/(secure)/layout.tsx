import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import { auth } from '@/app/_helpers/server';
import { Alert, Nav } from '@/app/_components';

export default Layout;

async function Layout({ children }: { children: React.ReactNode }) {
    // if not logged in redirect to login page
    const isAuthed = await auth.isAuthenticated()
    const headrs = await headers()
    const returnUrl = encodeURIComponent((headrs).get('x-invoke-path') || '/');
    if(!isAuthed) {
        redirect(`/app/account/login?returnUrl=${returnUrl}`);
    }

    return (
        <div className="app-container bg-light">
            <Nav />
            <Alert />
            <div className="p-4">
                <div className="container">
                    {children}
                </div>
            </div>
        </div>
    );
}
