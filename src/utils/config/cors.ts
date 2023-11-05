import cors from "cors";

const corsConfig = cors({
  origin: [
    "http://localhost:3000",
    process.env.API_GATEWAY_DNS!,
    "https://checkout.stripe.com",
  ], // frontend domain
  credentials: true,
  methods: ["POST", "GET", "OPTIONS"],
  exposedHeaders: ["set-cookie", "Cookie"],
  allowedHeaders: [
    "set-cookie",
    "Cookie",
    "Content-Type",
    "Origin",
    "Accept",
    "X-XSS-Protection",
    "Authorization",
  ],
});

export default corsConfig;
