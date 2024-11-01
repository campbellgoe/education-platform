import { redirect } from 'next/navigation';

import { auth } from '@/app/_helpers/server';
import { Alert } from '@/app/_components';

export default Layout;

async function Layout({ children }: { children: React.ReactNode }) {
    // if logged in redirect to home page
    const isAuthed = await auth.isAuthenticated()
    if(isAuthed) redirect('/app');
    

    return (
        <>
            <Alert />
            <div className="col-md-6 offset-md-3 mt-5">
                {children}
            </div>
        </>
    );
}