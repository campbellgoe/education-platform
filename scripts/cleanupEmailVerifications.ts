// import cron from 'node-cron';
// import EmailVerification from '@/models/EmailVerification';
// import dbConnect from '@/lib/dbConnect';

// export function scheduleCleanup() {
//   // Run the cleanup task every day at midnight
//   cron.schedule('0 0 * * *', async () => {
//     console.log('Running email verification cleanup task');
//     await dbConnect();

//     try {
//       const result = await EmailVerification.deleteMany({
//         expiresAt: { $lt: new Date() }
//       });
//       console.log(`Deleted ${result.deletedCount} expired email verifications`);
//     } catch (error) {
//       console.error('Error cleaning up email verifications:', error);
//     }
//   });
// }