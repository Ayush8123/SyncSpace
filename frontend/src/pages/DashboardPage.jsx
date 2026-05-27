import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";

function DashboardPage() {

  const navigate = useNavigate();

  const [workspaces, setWorkspaces] = useState([]);

  const [workspaceName, setWorkspaceName] =
    useState("");

  const [inviteCode, setInviteCode] =
    useState("");

  const fetchWorkspaces = async () => {
    try {

      const response =
        await api.get("/workspaces");

      setWorkspaces(response.data.workspaces);

    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchWorkspaces();
  }, []);

  const handleCreateWorkspace = async (e) => {
    e.preventDefault();

    try {

      await api.post("/workspaces", {
        name: workspaceName,
      });

      setWorkspaceName("");

      fetchWorkspaces();

    } catch (error) {

      alert(
        error.response?.data?.message
      );

    }
  };

  const handleJoinWorkspace = async (e) => {
    e.preventDefault();

    try {

      await api.post("/workspaces/join", {
        inviteCode,
      });

      setInviteCode("");

      fetchWorkspaces();

    } catch (error) {

      alert(
        error.response?.data?.message
      );

    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-10">

      <div className="flex justify-between items-center mb-10">

        <h1 className="text-4xl font-bold">
          SyncSpace Dashboard
        </h1>

        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-6 py-3 rounded-lg"
        >
          Logout
        </button>

      </div>

      <div className="grid grid-cols-2 gap-10">

        <div className="bg-white p-6 rounded-xl shadow">

          <h2 className="text-2xl font-bold mb-4">
            Create Workspace
          </h2>

          <form
            onSubmit={handleCreateWorkspace}
            className="space-y-4"
          >

            <input
              type="text"
              placeholder="Workspace name"
              value={workspaceName}
              onChange={(e) =>
                setWorkspaceName(e.target.value)
              }
              className="w-full border p-3 rounded-lg"
            />

            <button
              type="submit"
              className="w-full bg-black text-white py-3 rounded-lg"
            >
              Create
            </button>

          </form>

        </div>

        <div className="bg-white p-6 rounded-xl shadow">

          <h2 className="text-2xl font-bold mb-4">
            Join Workspace
          </h2>

          <form
            onSubmit={handleJoinWorkspace}
            className="space-y-4"
          >

            <input
              type="text"
              placeholder="Invite code"
              value={inviteCode}
              onChange={(e) =>
                setInviteCode(e.target.value)
              }
              className="w-full border p-3 rounded-lg"
            />

            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-3 rounded-lg"
            >
              Join
            </button>

          </form>

        </div>

      </div>

      <div className="mt-10 bg-white p-6 rounded-xl shadow">

        <h2 className="text-2xl font-bold mb-6">
          Your Workspaces
        </h2>

        <div className="space-y-4">

          {workspaces.map((item) => (

            <Link
            to={`/workspace/${item.workspace.id}`}
            key={item.workspace.id}
            className="border p-4 rounded-lg block hover:bg-gray-100 transition"
          >

            <h3 className="text-xl font-semibold">
              {item.workspace.name}
            </h3>

            <p className="text-gray-500">
              Invite Code:
              {" "}
              {item.workspace.inviteCode}
            </p>

            <p className="text-gray-500">
              Role:
              {" "}
              {item.role}
            </p>
                    </Link>

          ))}

        </div>

      </div>

    </div>
  );
}

export default DashboardPage;