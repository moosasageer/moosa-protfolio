import { PageHeader } from "@/components/admin/ui";
import ProjectForm, { emptyProject } from "@/components/admin/ProjectForm";

export default function NewProjectPage() {
  return (
    <div>
      <PageHeader title="Add Project" description="Create a new project — save as a draft or publish immediately." />
      <ProjectForm initial={emptyProject} />
    </div>
  );
}
