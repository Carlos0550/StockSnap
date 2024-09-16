export const config = {
    apiBaseUrl: 
    process.env.NODE_ENV === 'production'
    ? "https://stocksnap-server.vercel.app"
    : "http://localhost:4000"
}