import { Router } from "express";
import { authRouter } from "../modules/auth/auth.routes";
import { adminEventRouter, eventRouter, organizerEventRouter } from "../modules/events/events.routes";
import { rewardRouter, adminRewardRouter, adminRedemptionRouter } from "../modules/rewards/rewards.routes";
import { adminOrganizerRouter, adminUserRouter, userRouter } from "../modules/users/users.routes";
import { dashboardRouter } from "../modules/dashboard/dashboard.routes";
import { metaRouter } from "../modules/meta/meta.routes";
import { adminBookRouter, bookRouter, organizerBookRouter } from "../modules/books/books.routes";

export const apiRouter = Router();

apiRouter.use("/auth", authRouter);
apiRouter.use("/events", eventRouter);
apiRouter.use("/rewards", rewardRouter);
apiRouter.use("/users", userRouter);
apiRouter.use("/dashboard", dashboardRouter);
apiRouter.use("/meta", metaRouter);
apiRouter.use("/books", bookRouter);

apiRouter.use("/organizer/events", organizerEventRouter);
apiRouter.use("/organizer/books", organizerBookRouter);
apiRouter.use("/admin/events", adminEventRouter);
apiRouter.use("/admin/books", adminBookRouter);
apiRouter.use("/admin/rewards", adminRewardRouter);
apiRouter.use("/admin/redemptions", adminRedemptionRouter);
apiRouter.use("/admin/users", adminUserRouter);
apiRouter.use("/admin/organizers", adminOrganizerRouter);
