import Stripe from "stripe";
import { env } from "./env";
const stripe = new Stripe(env.strip_secret_key);

export default stripe;
