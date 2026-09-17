import { useCallback } from "react";
import { useLocalStorageState } from "./useLocalStorageState";
import {
  preparationCategoriesMock,
  preparationTopicsMock,
} from "../data/mockData";

// Persisted state hook for Preparation Categories + Topics.
export function usePreparationData() {
  const [categories, setCategories] = useLocalStorageState(
    "dashboard.preparationCategories",
    preparationCategoriesMock
  );
  const [topics, setTopics] = useLocalStorageState(
    "dashboard.preparationTopics",
    preparationTopicsMock
  );

  const addCategory = useCallback(
    (name) => {
      const id = `cat-${Date.now()}`;
      setCategories((prev) => [...prev, { id, name }]);
      return id;
    },
    [setCategories]
  );

  const renameCategory = useCallback(
    (categoryId, name) => {
      setCategories((prev) =>
        prev.map((c) => (c.id === categoryId ? { ...c, name } : c))
      );
    },
    [setCategories]
  );

  const deleteCategory = useCallback(
    (categoryId) => {
      setCategories((prev) => prev.filter((c) => c.id !== categoryId));
      setTopics((prev) => prev.filter((t) => t.categoryId !== categoryId));
    },
    [setCategories, setTopics]
  );

  const addTopic = useCallback(
    (categoryId, name) => {
      setTopics((prev) => [
        ...prev,
        { id: `top-${Date.now()}`, categoryId, name, status: "NEW" },
      ]);
    },
    [setTopics]
  );

  const renameTopic = useCallback(
    (topicId, name) => {
      setTopics((prev) =>
        prev.map((t) => (t.id === topicId ? { ...t, name } : t))
      );
    },
    [setTopics]
  );

  const updateTopicStatus = useCallback(
    (topicId, status) => {
      setTopics((prev) =>
        prev.map((t) => (t.id === topicId ? { ...t, status } : t))
      );
    },
    [setTopics]
  );

  const deleteTopic = useCallback(
    (topicId) => {
      setTopics((prev) => prev.filter((t) => t.id !== topicId));
    },
    [setTopics]
  );

  return {
    categories,
    topics,
    addCategory,
    renameCategory,
    deleteCategory,
    addTopic,
    renameTopic,
    updateTopicStatus,
    deleteTopic,
  };
}
