import cors from "cors";

export default cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    headers: ['Content-Type', 'Authorization']
});