import { NextRequest } from 'next/server';

import { auth } from '@/app/_helpers/server/auth';

export { jwtMiddleware };

async function jwtMiddleware(req: NextRequest) {
    if (isPublicPath(req))
        return;

    // verify token in request cookie
    const id = await auth.verifyToken();
    req.headers.set('userId', id);
    console.log('jwt middleware ran. userId header set:', id)
}

function isPublicPath(req: NextRequest) {
    // public routes that don't require authentication
    const publicPaths = [
        'POST:/api/account/login',
        'POST:/api/account/logout',
        'POST:/api/account/register'
    ];
    return publicPaths.includes(`${req.method}:${req.nextUrl.pathname}`);
}