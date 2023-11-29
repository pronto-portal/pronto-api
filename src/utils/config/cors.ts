import cors from "cors";

const allowedOriginsFromEnv: string[] = [
  process.env.API_GATEWAY_DNS!,
  process.env.ALB_DNS ? `https://${process.env.ALB_DNS}` : undefined,
].filter(
  (origin) => origin !== undefined && origin !== "" && origin !== null
) as string[];

console.log("allowedOriginsFromEnv: ", allowedOriginsFromEnv);

const corsConfig = cors({
  // origin: [
  //   "http://localhost:3000",
  //   "https://prontotranslationservices.com",
  //   process.env.API_GATEWAY_DNS!,
  //   "https://checkout.stripe.com",
  //   ...allowedOriginsFromEnv,
  // ], // frontend domain
  origin: "*",
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
