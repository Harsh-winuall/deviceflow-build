import { getSession } from "@/server/helper";
import AdminDashboard from "./_components/admin-page";
import UserDashboard from "./_components/user-page";
import Error from "@/app/error/page";

export default async function Dashboard() {
  const sess = await getSession();

  if (!sess) {
    return <Error />;
  }

  return (
    <div className="h-full overflow-y-auto">
      {sess?.user?.user?.role !== 1 ? <AdminDashboard /> : <UserDashboard />}
    </div>
  );
}