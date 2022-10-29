const mode = process.env.NODE_ENV
const baseUrl = mode === "development" ? "http://localhost:3000" : "."

export const glossaryEndpoint = `${baseUrl}/api/glossary`
export const termEndpoint = `${baseUrl}/api/term`
