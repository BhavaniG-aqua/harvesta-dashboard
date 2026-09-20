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
import { OTHERS_CATEGORY_ID } from "../../hooks/usePreparationData";

// Preparation home: Categories -> Topics hierarchy. Each interview may
// need different topics, so categories keep those topics grouped and
// easy to scan instead of one long scattered list.
function PreparationCategoriesPage() {
  const {
    categories,
    companies,
    topics,
    addCategory,
    renameCategory,
    deleteCategory,
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

  // Sort so "Others" always appears last.
  const orderedCategories = useMemo(() => {
    return [...categories].sort((a, b) => {
      if (a.id === OTHERS_CATEGORY_ID) return 1;
      if (b.id === OTHERS_CATEGORY_ID) return -1;
      return a.name.localeCompare(b.name);
    });
  }, [categories]);

  function handleAddTopic({ name, categoryId, categoryName, companyIds, companyNames, companyName }) {
    addTopic({ name, categoryId, categoryName, companyIds, companyNames, companyName });
  }

  return (
    <div>
      <PageHeader title="Preparation" subtitle="Track your core prep topics" />
      <PreparationTabs />

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <StatusFilterTabs active={activeStatus} onChange={setActiveStatus} counts={statusCounts} />
      </div>

      <div className="mb-5 flex flex-wrap gap-2">
        <InlineAddForm
          placeholder="New category name"
          buttonLabel="+ Category"
          onSubmit={addCategory}
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

      {orderedCategories.length === 0 ? (
        <EmptyState
          icon="🎯"
          title="No categories yet"
          description="Add a category, e.g. 'Power Systems', then add topics under it."
        />
      ) : (
        orderedCategories.map((cat) => {
          const catTopics = visibleTopics.filter((t) => t.categoryId === cat.id);
          if (activeStatus.length > 0 && catTopics.length === 0) return null;
          return (
            <TopicGroup
              key={cat.id}
              title={cat.name}
              topics={catTopics}
              onStatusChange={updateTopicStatus}
              onDelete={deleteTopic}
              onRename={renameTopic}
              onRenameGroup={
                cat.id === OTHERS_CATEGORY_ID
                  ? undefined
                  : (name) => renameCategory(cat.id, name)
              }
              onDeleteGroup={
                cat.id === OTHERS_CATEGORY_ID ? undefined : () => deleteCategory(cat.id)
              }
              deletable={cat.id !== OTHERS_CATEGORY_ID}
              emptyLabel="No topics in this category yet."
            />
          );
        })
      )}
    </div>
  );
}

export default PreparationCategoriesPage;
