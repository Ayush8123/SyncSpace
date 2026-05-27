import prisma from "../prisma/client.js";

export const createChannel = async (req, res) => {
  try {

    const { name, workspaceId } = req.body;

    if (!name || !workspaceId) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const membership =
      await prisma.workspaceMember.findUnique({
        where: {
          userId_workspaceId: {
            userId: req.user.id,
            workspaceId,
          },
        },
      });

    if (!membership) {
      return res.status(403).json({
        message: "Access denied",
      });
    }

    const existingChannel =
      await prisma.channel.findFirst({
        where: {
          name,
          workspaceId,
        },
      });

    if (existingChannel) {
      return res.status(400).json({
        message: "Channel already exists",
      });
    }

    const channel = await prisma.channel.create({
      data: {
        name,
        workspaceId,
      },
    });

    return res.status(201).json({
      message: "Channel created successfully",
      channel,
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      message: "Internal server error",
    });

  }
};

export const getWorkspaceChannels = async (req, res) => {
  try {

    const { workspaceId } = req.params;

    const membership =
      await prisma.workspaceMember.findUnique({
        where: {
          userId_workspaceId: {
            userId: req.user.id,
            workspaceId,
          },
        },
      });

    if (!membership) {
      return res.status(403).json({
        message: "Access denied",
      });
    }

    const channels = await prisma.channel.findMany({
      where: {
        workspaceId,
      },

      orderBy: {
        createdAt: "asc",
      },
    });

    return res.status(200).json({
      channels,
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      message: "Internal server error",
    });

  }
};