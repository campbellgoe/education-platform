import joi from 'joi';

import { usersRepo } from '@/app/_helpers/server';
import { apiHandler } from '@/app/_helpers/server/api/api-handler';
import { MIN_PASSWORD_LENGTH } from '@/app/_helpers/shared/config';

module.exports = apiHandler({
    POST: register
});

async function register(req: Request) {
    const body = await req.json();
    await usersRepo.create(body);
}

register.schema = joi.object({
    firstName: joi.string().required(),
    lastName: joi.string().required(),
    username: joi.string().required(),
    password: joi.string().min(MIN_PASSWORD_LENGTH).required(),
});