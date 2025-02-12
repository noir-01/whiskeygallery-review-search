import { getSession } from "next-auth/react";
import { Session } from "next-auth";
import { GetServerSidePropsContext } from "next";

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getSession({ req: context.req }); // 변경된 부분

  if (!session) {
    return {
      redirect: {
        destination: "/admin/login",
        permanent: false,
      },
    };
  }

  return {
    props: { session },
  };
}

interface AdminPageProps {
  session: Session | null; // session이 null일 수도 있으므로 수정
}

const AdminPage = ({ session }: AdminPageProps) => {
  if (!session) return <p>Loading...</p>; // session이 null일 때 처리

  return (
    <div>
      <h1>Admin Page</h1>
      <p>Welcome, {session.user?.name ?? "Admin"}</p> {/* 기본값 추가 */}
    </div>
  );
};

export default AdminPage;
