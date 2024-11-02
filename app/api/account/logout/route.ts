import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function GET(){
    (await cookies()).delete('authorization');
    return redirect('/app');
}