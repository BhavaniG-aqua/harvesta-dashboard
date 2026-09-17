import { useMemo, useState } from "react";
import PageHeader from "../../components/common/PageHeader";
import PreparationTabs from "../../components/preparation/PreparationTabs";
import CategoryTabs from "../../components/preparation/CategoryTabs";
import StatusFilterTabs from "../../components/preparation/StatusFilterTabs";
import TopicItem from "../../components/preparation/TopicItem";
import InlineAddForm from "../../components/common/InlineAddForm";
import EmptyState from "../../components/common/EmptyState";
import { usePreparationData } from "../../hooks/usePreparationData";

function PreparationTopicsPage() {
  const {
    categories,
    topics,
    addCategory,
    addTopic,
    updateTopicStatus,
    deleteTopic,
  } = usePreparationData();

  const [activeCategoryId, setActiveCategoryId] = useState(null);
  const [activeStatus, setActiveStatus] = useState("ALL");

  const filteredTopics = useMemo(() => {
    return topics.filter((t) => {
      const matchesCategory =
        activeCategoryId === null || t.categoryId === activeCategoryId;
      const matchesStatus = activeStatus === "ALL" || t.status === activeStatus;
      return matchesCategory && matchesStatus;
    });
  }, [topics, activeCategoryId, activeStatus]);

  const statusCounts = useMemo(() => {
    const scoped =
      activeCategoryId === null
        ? topics
        : topics.filter((t) => t.categoryId === activeCategoryId);
    return {
      ALL: scoped.length,
      NEW: scoped.filter((t) => t.status === "NEW").length,
      COMPLETED: scoped.filter((t) => t.status === "COMPLETED").length,
      REVISE: scoped.filter((t) => t.status === "REVISE").length,
    };
  }, [topics, activeCategoryId]);

  function handleAddTopic(name) {
    const categoryId = activeCategoryId ?? categories[0]?.id;
    if (!categoryId) return;
    addTopic(categoryId, name);
  }

  return (
    <div>
      <PageHeader title="Preparation" subtitle="Track your core prep topics" />
      <PreparationTabs />

      <div className="mb-4">
        <CategoryTabs
          categories={categories}
          activeId={activeCategoryId}
          onChange={setActiveCategoryId}
        />
      </div>

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <StatusFilterTabs
          active={activeStatus}
          onChange={setActiveStatus}
          counts={statusCounts}
        />
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        <InlineAddForm
          placeholder="New category name"
          buttonLabel="+ Category"
          onSubmit={addCategory}
        />
        <InlineAddForm
          placeholder="New topic name"
          buttonLabel="+ Topic"
          onSubmit={handleAddTopic}
        />
      </div>

      {filteredTopics.length === 0 ? (
        <EmptyState
          icon="🎯"
          title="No topics here yet"
          description="Add a topic to start tracking its preparation status."
        />
      ) : (
        <div className="flex flex-col gap-3">
          {filteredTopics.map((topic) => (
            <TopicItem
              key={topic.id}
              topic={topic}
              onStatusChange={updateTopicStatus}
              onDelete={deleteTopic}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default PreparationTopicsPage;
