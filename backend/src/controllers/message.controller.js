import prisma from "../prisma/client.js";

export const getChannelMessages =
  async (req, res) => {

    try {

      const { channelId } = req.params;

      const messages =
        await prisma.message.findMany({
          where: {
            channelId,
          },

          include: {
            sender: {
              select: {
                id: true,
                username: true,
              },
            },
          },

          orderBy: {
            createdAt: "asc",
          },
        });

      return res.status(200).json({
        messages,
      });

    } catch (error) {

      console.log(error);

      return res.status(500).json({
        message: "Internal server error",
      });

    }
};