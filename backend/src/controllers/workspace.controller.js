import prisma from "../prisma/client.js";

const generateInviteCode = () => {
  return Math.random().toString(36).substring(2, 8);
};

export const createWorkspace = async (req, res) => {
  try {

    const { name } = req.body;

    if (!name) {
      return res.status(400).json({
        message: "Workspace name is required",
      });
    }

    const inviteCode = generateInviteCode();

    const workspace = await prisma.workspace.create({
      data: {
        name,
        inviteCode,

        members: {
          create: {
            userId: req.user.id,
            role: "OWNER",
          },
        },
      },

      include: {
        members: true,
      },
    });

    return res.status(201).json({
      message: "Workspace created successfully",
      workspace,
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      message: "Internal server error",
    });

  }
};

export const joinWorkspace = async (req, res) => {
  try {

    const { inviteCode } = req.body;

    const workspace = await prisma.workspace.findUnique({
      where: {
        inviteCode,
      },
    });

    if (!workspace) {
      return res.status(404).json({
        message: "Workspace not found",
      });
    }

    const existingMembership =
      await prisma.workspaceMember.findUnique({
        where: {
          userId_workspaceId: {
            userId: req.user.id,
            workspaceId: workspace.id,
          },
        },
      });

    if (existingMembership) {
      return res.status(400).json({
        message: "Already a member",
      });
    }

    await prisma.workspaceMember.create({
      data: {
        userId: req.user.id,
        workspaceId: workspace.id,
      },
    });

    return res.status(200).json({
      message: "Joined workspace successfully",
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      message: "Internal server error",
    });

  }
};

export const getUserWorkspaces = async (req, res) => {
  try {

    const workspaces =
      await prisma.workspaceMember.findMany({
        where: {
          userId: req.user.id,
        },

        include: {
          workspace: true,
        },
      });

    return res.status(200).json({
      workspaces,
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      message: "Internal server error",
    });

  }
};

export const getWorkspaceById = async (req, res) => {
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

    const workspace =
      await prisma.workspace.findUnique({
        where: {
          id: workspaceId,
        },
      });

    return res.status(200).json({
      workspace,
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      message: "Internal server error",
    });

  }
};