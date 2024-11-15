import joi from 'joi';

import { usersRepo } from '@/app/_helpers/server/users-repo';
import { MIN_PASSWORD_LENGTH } from '@/app/_helpers/shared/config';
import dbConnect from '@/lib/dbConnect';

export async function POST(req: Request): Promise<Response> {
    await dbConnect()
    const body = await req.json();
    const user = await usersRepo.create(body);
    return Response.json(user)
}
POST.schema = joi.object({
    email: joi.string().required(),
    password: joi.string().min(MIN_PASSWORD_LENGTH).required(),
});