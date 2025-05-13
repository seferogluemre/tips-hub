import { treaty } from "@elysiajs/eden";
import type { App } from "../../../api/src/index";

const app = treaty<App>("localhost:3000");

// response type: 'Hi Elysia'
const { data } = await app.api.tips.get();

console.log("ÖRNEK EDEN API Çagrısı", data);

export default app;
