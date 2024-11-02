// import 'bootstrap/dist/css/bootstrap.min.css';
import CaptchaProvider from '@/components/CaptchaProvider';
import './globals.css';

export const metadata = {
    title: 'Learn anything, together'
}

export default Layout;

function Layout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body>
                <CaptchaProvider>
                    {children}
                </CaptchaProvider>
                {/* credits */}
                <div className="text-center mt-4">
                    <p>
                        <a href="https://massless.ltd" target="_blank">MASSLESS LTD.</a>
                    </p>                    
                </div>
            </body>
        </html>
    );
}
