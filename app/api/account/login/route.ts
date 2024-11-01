import { cookies } from 'next/headers';
import joi from 'joi';

import { usersRepo } from '@/app/_helpers/server';
import { apiHandler } from '@/app/_helpers/server/api/api-handler';

module.exports = apiHandler({
    POST: login
});

async function login(req: Request) {
    const body = await req.json();
    const { user, token } = await usersRepo.authenticate(body);

    // return jwt token in http only cookie
    (await cookies()).set('authorization', token, { httpOnly: true });

    return user;
}

login.schema = joi.object({
    username: joi.string().required(),
    password: joi.string().required()
});