import express from "express";

import customerRoutes from "./routes/customer.route";
import vehicleRoutes from "./routes/vehicle.route";
import reservationRoutes from "./routes/reservation.route";

const app = express();

app.use(express.json());

app.use("/customer", customerRoutes);
app.use("/vehicle", vehicleRoutes);
app.use("/reservation", reservationRoutes);

export default app;
