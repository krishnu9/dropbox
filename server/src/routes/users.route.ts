import { Router } from "express";
import prisma from "../config/prisma";

const router = Router();

router.route("/").get(async (req, res) => {
  const users = await prisma.user.findMany();
  res.status(200).json(users);
});

router
  .route("/:id")
  //@ts-ignore
  .get(async (req, res) => {
    const userId = req.params.id
    return prisma.user
      .findUnique({ where: { id: userId } })
      .then((user: any) => res.status(200).json(user));
  })
  //@ts-ignore
  .patch(async (req, res) => {
    const userId = req.params.id
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return res
        .status(400)
        .json({ status: false, message: "Not found the user!" });
    }

    const { email, name } = req.body;
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { email, name },
    });

    return res.status(200).json(updatedUser);
  });

export default router;
