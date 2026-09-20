import { useCallback, useEffect, useState } from "react";
import { supabase } from "../services/supabaseClient";

export const OTHERS_CATEGORY_ID = "00000000-0000-0000-0000-000000000001";
export const OTHERS_CATEGORY_NAME = "Others";

function fromTopicRow(row, companyIds = []) {
  return {
    id: row.id,
    categoryId: row.category_id,
    name: row.name,
    status: row.status,
    companyIds,
  };
}

// Supabase-backed hook for Preparation: Categories, Companies & Topics.
//
// Hierarchy:
//   Category  -> many Topics (a topic has exactly ONE category)
//   Company   -> many Topics (a topic can be tagged with MANY companies,
//                via the preparation_topic_companies join table)
// Adding/renaming/deleting a category or company is reflected everywhere
// a topic references it, since topics only store ids.
export function usePreparationData() {
  const [categories, setCategories] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadAll = useCallback(async () => {
    const [
      { data: categoryRows, error: catErr },
      { data: companyRows, error: compErr },
      { data: topicRows, error: topicErr },
      { data: linkRows, error: linkErr },
    ] = await Promise.all([
      supabase.from("preparation_categories").select("*"),
      supabase.from("preparation_companies").select("*"),
      supabase.from("preparation_topics").select("*"),
      supabase.from("preparation_topic_companies").select("*"),
    ]);
    if (catErr) console.error("Failed to load categories:", catErr);
    if (compErr) console.error("Failed to load companies:", compErr);
    if (topicErr) console.error("Failed to load topics:", topicErr);
    if (linkErr) console.error("Failed to load topic-company links:", linkErr);

    setCategories((categoryRows || []).map((r) => ({ id: r.id, name: r.name })));
    setCompanies((companyRows || []).map((r) => ({ id: r.id, name: r.name })));
    setTopics(
      (topicRows || []).map((row) =>
        fromTopicRow(
          row,
          (linkRows || [])
            .filter((l) => l.topic_id === row.id)
            .map((l) => l.company_id)
        )
      )
    );
    setLoading(false);
  }, []);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  const findCategoryByName = useCallback(
    (name) =>
      categories.find((c) => c.name.trim().toLowerCase() === name.trim().toLowerCase()) ||
      null,
    [categories]
  );

  const findCompanyByName = useCallback(
    (name) =>
      companies.find((c) => c.name.trim().toLowerCase() === name.trim().toLowerCase()) ||
      null,
    [companies]
  );

  const addCategory = useCallback(async (name) => {
    const trimmed = name.trim();
    if (!trimmed) return null;
    const existing = findCategoryByName(trimmed);
    if (existing) return existing.id;
    const { data, error } = await supabase
      .from("preparation_categories")
      .insert({ name: trimmed })
      .select()
      .single();
    if (error) {
      console.error("Failed to add category:", error);
      return null;
    }
    setCategories((prev) => [...prev, { id: data.id, name: data.name }]);
    return data.id;
  }, [findCategoryByName]);

  // Finds a category by name (case-insensitive) or creates it. Falls
  // back to the fixed "Others" category when no name is supplied.
  const getOrCreateCategory = useCallback(async (name) => {
    const trimmed = (name || "").trim();
    if (!trimmed) return OTHERS_CATEGORY_ID;
    const existing = findCategoryByName(trimmed);
    if (existing) return existing.id;
    const { data, error } = await supabase
      .from("preparation_categories")
      .insert({ name: trimmed })
      .select()
      .single();
    if (error) {
      console.error("Failed to create category:", error);
      return OTHERS_CATEGORY_ID;
    }
    setCategories((prev) => [...prev, { id: data.id, name: data.name }]);
    return data.id;
  }, [findCategoryByName]);

  const getOrCreateCompany = useCallback(async (name) => {
    const trimmed = (name || "").trim();
    if (!trimmed) return null;
    const existing = findCompanyByName(trimmed);
    if (existing) return existing.id;
    const { data, error } = await supabase
      .from("preparation_companies")
      .insert({ name: trimmed })
      .select()
      .single();
    if (error) {
      console.error("Failed to create company:", error);
      return null;
    }
    setCompanies((prev) => [...prev, { id: data.id, name: data.name }]);
    return data.id;
  }, [findCompanyByName]);

  const addCompany = useCallback(
    (name) => getOrCreateCompany(name),
    [getOrCreateCompany]
  );

  const renameCategory = useCallback(async (categoryId, name) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    const { error } = await supabase
      .from("preparation_categories")
      .update({ name: trimmed })
      .eq("id", categoryId);
    if (error) {
      console.error("Failed to rename category:", error);
      return;
    }
    setCategories((prev) =>
      prev.map((c) => (c.id === categoryId ? { ...c, name: trimmed } : c))
    );
  }, []);

  const renameCompany = useCallback(async (companyId, name) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    const { error } = await supabase
      .from("preparation_companies")
      .update({ name: trimmed })
      .eq("id", companyId);
    if (error) {
      console.error("Failed to rename company:", error);
      return;
    }
    setCompanies((prev) =>
      prev.map((c) => (c.id === companyId ? { ...c, name: trimmed } : c))
    );
  }, []);

  // Deletes a category and reassigns its topics to "Others" (via the
  // `on delete set null` FK + a follow-up update) instead of deleting
  // them. The fixed "Others" category itself can never be deleted.
  const deleteCategory = useCallback(async (categoryId) => {
    if (categoryId === OTHERS_CATEGORY_ID) return;
    await supabase
      .from("preparation_topics")
      .update({ category_id: OTHERS_CATEGORY_ID })
      .eq("category_id", categoryId);
    const { error } = await supabase
      .from("preparation_categories")
      .delete()
      .eq("id", categoryId);
    if (error) {
      console.error("Failed to delete category:", error);
      return;
    }
    await loadAll();
  }, [loadAll]);

  // Deletes a company; `preparation_topic_companies` rows referencing it
  // cascade-delete automatically, un-tagging it from every topic.
  const deleteCompany = useCallback(async (companyId) => {
    const { error } = await supabase
      .from("preparation_companies")
      .delete()
      .eq("id", companyId);
    if (error) {
      console.error("Failed to delete company:", error);
      return;
    }
    await loadAll();
  }, [loadAll]);

  // Adds a topic. Accepts either an existing categoryId OR a free-typed
  // categoryName (creating it if needed, falling back to "Others" when
  // blank), plus any number of company references: existing companyIds,
  // and/or free-typed company names via `companyName` (singular, kept
  // for backward compatibility) and/or `companyNames` (array — used when
  // the user picks a company that only exists in the Placements list
  // and doesn't have a `preparation_companies` row yet; it's created on
  // the fly here).
  const addTopic = useCallback(async ({ name, categoryId, categoryName, companyName, companyNames = [], companyIds = [] }) => {
    const trimmedName = (name || "").trim();
    if (!trimmedName) return null;

    const resolvedCategoryId = categoryId || (await getOrCreateCategory(categoryName));
    const resolvedCompanyIds = [...companyIds];
    const allNewCompanyNames = [...companyNames];
    if (companyName && companyName.trim()) {
      allNewCompanyNames.push(companyName.trim());
    }
    for (const rawName of allNewCompanyNames) {
      const companyId = await getOrCreateCompany(rawName);
      if (companyId && !resolvedCompanyIds.includes(companyId)) {
        resolvedCompanyIds.push(companyId);
      }
    }

    const { data, error } = await supabase
      .from("preparation_topics")
      .insert({ category_id: resolvedCategoryId, name: trimmedName, status: "NEW" })
      .select()
      .single();
    if (error) {
      console.error("Failed to add topic:", error);
      return null;
    }

    if (resolvedCompanyIds.length > 0) {
      await supabase
        .from("preparation_topic_companies")
        .insert(resolvedCompanyIds.map((companyId) => ({ topic_id: data.id, company_id: companyId })));
    }

    setTopics((prev) => [...prev, fromTopicRow(data, resolvedCompanyIds)]);
    return data.id;
  }, [getOrCreateCategory, getOrCreateCompany]);

  const renameTopic = useCallback(async (topicId, name) => {
    const { error } = await supabase
      .from("preparation_topics")
      .update({ name })
      .eq("id", topicId);
    if (error) {
      console.error("Failed to rename topic:", error);
      return;
    }
    setTopics((prev) => prev.map((t) => (t.id === topicId ? { ...t, name } : t)));
  }, []);

  const updateTopicStatus = useCallback(async (topicId, status) => {
    const { error } = await supabase
      .from("preparation_topics")
      .update({ status })
      .eq("id", topicId);
    if (error) {
      console.error("Failed to update topic status:", error);
      return;
    }
    setTopics((prev) => prev.map((t) => (t.id === topicId ? { ...t, status } : t)));
  }, []);

  const updateTopicCategory = useCallback(async (topicId, categoryId) => {
    const { error } = await supabase
      .from("preparation_topics")
      .update({ category_id: categoryId })
      .eq("id", topicId);
    if (error) {
      console.error("Failed to update topic category:", error);
      return;
    }
    setTopics((prev) => prev.map((t) => (t.id === topicId ? { ...t, categoryId } : t)));
  }, []);

  const setTopicCompanies = useCallback(async (topicId, companyIds) => {
    await supabase.from("preparation_topic_companies").delete().eq("topic_id", topicId);
    if (companyIds.length > 0) {
      await supabase
        .from("preparation_topic_companies")
        .insert(companyIds.map((companyId) => ({ topic_id: topicId, company_id: companyId })));
    }
    setTopics((prev) => prev.map((t) => (t.id === topicId ? { ...t, companyIds } : t)));
  }, []);

  const toggleTopicCompany = useCallback(async (topicId, companyId) => {
    const topic = topics.find((t) => t.id === topicId);
    if (!topic) return;
    const current = topic.companyIds || [];
    const isLinked = current.includes(companyId);

    if (isLinked) {
      await supabase
        .from("preparation_topic_companies")
        .delete()
        .eq("topic_id", topicId)
        .eq("company_id", companyId);
    } else {
      await supabase
        .from("preparation_topic_companies")
        .insert({ topic_id: topicId, company_id: companyId });
    }

    const next = isLinked
      ? current.filter((id) => id !== companyId)
      : [...current, companyId];
    setTopics((prev) => prev.map((t) => (t.id === topicId ? { ...t, companyIds: next } : t)));
  }, [topics]);

  const deleteTopic = useCallback(async (topicId) => {
    const { error } = await supabase
      .from("preparation_topics")
      .delete()
      .eq("id", topicId);
    if (error) {
      console.error("Failed to delete topic:", error);
      return;
    }
    setTopics((prev) => prev.filter((t) => t.id !== topicId));
  }, []);

  const getTopicsByCategory = useCallback(
    (categoryId) => topics.filter((t) => t.categoryId === categoryId),
    [topics]
  );

  const getTopicsByCompany = useCallback(
    (companyId) => topics.filter((t) => (t.companyIds || []).includes(companyId)),
    [topics]
  );

  return {
    categories,
    companies,
    topics,
    loading,
    addCategory,
    renameCategory,
    deleteCategory,
    addCompany,
    renameCompany,
    deleteCompany,
    addTopic,
    renameTopic,
    updateTopicStatus,
    updateTopicCategory,
    setTopicCompanies,
    toggleTopicCompany,
    deleteTopic,
    getTopicsByCategory,
    getTopicsByCompany,
    getOrCreateCategory,
    getOrCreateCompany,
  };
}
