export const MIN_PASSWORD_LENGTH = 6
export const MIN_PASSWORD_MESSAGE = `Password must be at least ${MIN_PASSWORD_LENGTH} characters long`;

export const baseUrl = process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://education-platform-phi.vercel.app'