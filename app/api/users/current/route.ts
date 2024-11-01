import { usersRepo } from '@/app/_helpers/server';
import { apiHandler } from '@/app/_helpers/server/api/api-handler';

module.exports = apiHandler({
    GET: getCurrent
});

async function getCurrent() {
    return await usersRepo.getCurrent();
}