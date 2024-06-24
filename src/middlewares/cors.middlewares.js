import cors from "cors";

export default cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    headers: ['Content-Type', 'Authorization']
});