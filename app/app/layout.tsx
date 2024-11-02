// import 'bootstrap/dist/css/bootstrap.min.css';
import './globals.css';

export const metadata = {
    title: 'Next.js 13 - User Registration and Login Example'
}

export default Layout;

function Layout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body>
                {children}

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
