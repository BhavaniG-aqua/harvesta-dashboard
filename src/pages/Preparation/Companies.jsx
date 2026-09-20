import { useMemo, useState } from "react";
import PageHeader from "../../components/common/PageHeader";
import PreparationTabs from "../../components/preparation/PreparationTabs";
import StatusFilterTabs from "../../components/preparation/StatusFilterTabs";
import TopicGroup from "../../components/preparation/TopicGroup";
import AddTopicForm from "../../components/preparation/AddTopicForm";
import InlineAddForm from "../../components/common/InlineAddForm";
import EmptyState from "../../components/common/EmptyState";
import { usePreparationContext } from "../../services/PreparationContext";
import { usePlacementsContext } from "../../services/PlacementsContext";

// Preparation by Company: Company -> Topics hierarchy. Each interview
// typically needs a different set of topics, so this view lets you see
// (and build) exactly what's prepped for a given company. A topic can be
// tagged with more than one company.
function PreparationCompaniesPage() {
  const {
    categories,
    companies,
    topics,
    addCompany,
    renameCompany,
    deleteCompany,
    addTopic,
    renameTopic,
    updateTopicStatus,
    deleteTopic,
  } = usePreparationContext();
  const { events } = usePlacementsContext();

  const placementCompanyNames = useMemo(
    () => [...new Set(events.map((e) => e.company).filter(Boolean))],
    [events]
  );

  const [activeStatus, setActiveStatus] = useState([]);

  const statusCounts = useMemo(
    () => ({
      ALL: topics.length,
      NEW: topics.filter((t) => t.status === "NEW").length,
      COMPLETED: topics.filter((t) => t.status === "COMPLETED").length,
      REVISE: topics.filter((t) => t.status === "REVISE").length,
    }),
    [topics]
  );

  const visibleTopics = useMemo(
    () =>
      activeStatus.length === 0
        ? topics
        : topics.filter((t) => activeStatus.includes(t.status)),
    [topics, activeStatus]
  );

  const orderedCompanies = useMemo(
    () => [...companies].sort((a, b) => a.name.localeCompare(b.name)),
    [companies]
  );

  function handleAddTopic({ name, categoryId, categoryName, companyIds, companyNames, companyName }) {
    addTopic({ name, categoryId, categoryName, companyIds, companyNames, companyName });
  }

  return (
    <div>
      <PageHeader title="Preparation" subtitle="Track prep topics by company" />
      <PreparationTabs />

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <StatusFilterTabs active={activeStatus} onChange={setActiveStatus} counts={statusCounts} />
      </div>

      <div className="mb-5 flex flex-wrap gap-2">
        <InlineAddForm
          placeholder="New company name"
          buttonLabel="+ Company"
          onSubmit={addCompany}
        />
      </div>

      <div className="mb-5">
        <AddTopicForm
          categories={categories}
          companies={companies}
          placementCompanyNames={placementCompanyNames}
          onSubmit={handleAddTopic}
        />
      </div>

      {orderedCompanies.length === 0 ? (
        <EmptyState
          icon="🏢"
          title="No companies yet"
          description="Add a company, e.g. 'Siemens', then tag topics for it."
        />
      ) : (
        orderedCompanies.map((company) => {
          const companyTopics = visibleTopics.filter((t) =>
            (t.companyIds || []).includes(company.id)
          );
          if (activeStatus.length > 0 && companyTopics.length === 0) return null;
          return (
            <TopicGroup
              key={company.id}
              title={company.name}
              topics={companyTopics}
              onStatusChange={updateTopicStatus}
              onDelete={deleteTopic}
              onRename={renameTopic}
              onRenameGroup={(name) => renameCompany(company.id, name)}
              onDeleteGroup={() => deleteCompany(company.id)}
              emptyLabel="No topics tagged with this company yet."
            />
          );
        })
      )}
    </div>
  );
}

export default PreparationCompaniesPage;
