import { cookies } from 'next/headers';
import joi from 'joi';

import { usersRepo } from '@/app/_helpers/server/users-repo';
import dbConnect from '@/lib/dbConnect';

export async function POST(request: Request): Promise<Response> {
    await dbConnect()
    const body = await request.json();
    console.log('body:', body)
    const { user, token } = await usersRepo.authenticate(body);

    // return jwt token in http only cookie
    (await cookies()).set('authorization', token, { httpOnly: true });

    return Response.json(user);
}

POST.schema = joi.object({
    email: joi.string().required(),
    password: joi.string().required(),
});