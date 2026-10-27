import type { Project } from "../data/projects";
import { getProjectPage } from "../data/projectPage";

// Shared type and grid of the case study pages: two columns with a wide gutter
export const TWO_COLUMNS = "md:grid md:grid-cols-2 md:gap-x-[11.3%]";
export const LABEL = "text-[10px] font-semibold uppercase tracking-[0.16em] text-[#737373]";
export const BODY = "text-[13px] leading-[1.75] text-ink/75";
export const HAIRLINE = "border-[#E2DCD4]";

export function Column({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className={`${LABEL} border-b ${HAIRLINE} pb-3`}>{label}</p>
      <div className="mt-5">{children}</div>
    </div>
  );
}

/**
 * The opening of a case study: title, role and year, then the problem and my
 * role. The landing page shows the selected project's opening under the
 * carousel, laid out exactly as on the project page, so scrolling from one into
 * the other never moves the text being read.
 */
export default function CaseStudyIntro({ project, heading: Heading = "h1" }: { project: Project; heading?: "h1" | "h2" }) {
  const content = getProjectPage(project);
  return (
    <>
      <div className={`flex flex-col gap-6 ${TWO_COLUMNS} md:items-start`}>
        <Heading className="text-[34px] font-medium leading-[1.1] tracking-[-0.8px] text-ink md:text-[38px]">{project.name}</Heading>
        <dl className="flex items-start justify-between gap-6 md:pt-2">
          <div className="flex flex-col gap-2">
            <dt className={LABEL}>Role</dt>
            <dd className="text-[14px] text-ink">{project.role}</dd>
          </div>
          <div className="flex flex-col gap-2 text-right">
            <dt className={LABEL}>Year</dt>
            <dd className="text-[14px] text-ink">{project.year}</dd>
          </div>
        </dl>
      </div>

      <div className={`mt-9 flex flex-col gap-10 ${TWO_COLUMNS} md:items-start`}>
        <Column label="Problem">
          <p className={BODY}>{content.problem}</p>
        </Column>
        <Column label="My role">
          <p className={BODY}>{content.myRole}</p>
        </Column>
      </div>
    </>
  );
}
