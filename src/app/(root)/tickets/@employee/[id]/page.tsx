import SingleIssue from "../../_components/[id]/ticket-id.main";

export default function Page({ params }: { params: { id: string } }) {
  return <SingleIssue params={params} />;
}
