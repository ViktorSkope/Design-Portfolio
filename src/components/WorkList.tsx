interface WorkItem {
  name: string;
  description: string;
}

interface WorkSection {
  label: string;
  items: WorkItem[];
}

const sections: WorkSection[] = [
  {
    label: "Current Work",
    items: [{ name: "Athos Commerce", description: "Lead Product Designer" }],
  },
  {
    label: "Side Quests",
    items: [
      {
        name: "Blindspot",
        description: "A notetaking app for busy (or attention deprived) people",
      },
    ],
  },
  {
    label: "Featured Work",
    items: [
      {
        name: "Ingrid",
        description:
          "Agriculture surveillance map for large scale in Brazil's countryside",
      },
      {
        name: "Whirl",
        description: "A location-based community discovery app",
      },
      {
        name: "Watchson",
        description: "HR and Development resourcing gamified tool",
      },
    ],
  },
];

export default function WorkList() {
  return (
    <section id="work" className="px-8 pb-16 flex flex-col gap-8">
      {sections.map((section) => (
        <div key={section.label} className="flex flex-col gap-3">
          <span className="text-[#737373] text-xs font-semibold uppercase tracking-widest">
            {section.label}
          </span>
          <div className="flex flex-col gap-[26px]">
            {section.items.map((item) => (
              <div
                key={item.name}
                className="grid grid-cols-2 gap-8 group cursor-pointer"
              >
                <p className="text-[#222841] text-[15px] font-medium group-hover:text-[#00a223] transition-colors">
                  {item.name}
                </p>
                <p className="text-[#737373] text-[12px] font-normal">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}
