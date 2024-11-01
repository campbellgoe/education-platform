import { cookies } from 'next/headers';

import { apiHandler } from '@/app/_helpers/server/api/api-handler';

module.exports = apiHandler({
    POST: logout
});

async function logout() {
    (await cookies()).delete('authorization');
}