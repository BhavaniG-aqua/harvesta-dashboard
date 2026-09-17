import { useState, useCallback } from "react";
import {
  preparationCategoriesMock,
  preparationTopicsMock,
} from "../data/mockData";

// Local state hook for Preparation Categories + Topics.
// Seeded from mock data now; swap the initial state / add Supabase calls
// later without changing the consuming components' API.
export function usePreparationData() {
  const [categories, setCategories] = useState(preparationCategoriesMock);
  const [topics, setTopics] = useState(preparationTopicsMock);

  const addCategory = useCallback((name) => {
    setCategories((prev) => [
      ...prev,
      { id: `cat-${Date.now()}`, name },
    ]);
  }, []);

  const addTopic = useCallback((categoryId, name) => {
    setTopics((prev) => [
      ...prev,
      { id: `top-${Date.now()}`, categoryId, name, status: "NEW" },
    ]);
  }, []);

  const updateTopicStatus = useCallback((topicId, status) => {
    setTopics((prev) =>
      prev.map((t) => (t.id === topicId ? { ...t, status } : t))
    );
  }, []);

  const deleteTopic = useCallback((topicId) => {
    setTopics((prev) => prev.filter((t) => t.id !== topicId));
  }, []);

  return {
    categories,
    topics,
    addCategory,
    addTopic,
    updateTopicStatus,
    deleteTopic,
  };
}
