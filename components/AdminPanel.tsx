"use client";

import { FormEvent, useMemo, useState } from "react";
import type { WorkFrame, WorkInput, WorkKind, WorkRow } from "@/lib/work-types";

type FormState = {
  title: string;
  type: WorkKind;
  video_url: string;
  frame: WorkFrame;
  sort_order: string;
  is_published: boolean;
};

const emptyForm: FormState = {
  title: "",
  type: "youtube",
  video_url: "",
  frame: "16:9",
  sort_order: "100",
  is_published: true,
};

export function AdminPanel({
  accessKey,
  adminPath,
}: {
  accessKey: string;
  adminPath: string;
}) {
  const [password, setPassword] = useState("");
  const [works, setWorks] = useState<WorkRow[]>([]);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [status, setStatus] = useState("Введите пароль администратора.");
  const [isBusy, setIsBusy] = useState(false);

  const adminUrl = useMemo(
    () => `${adminPath}?key=${accessKey}`,
    [accessKey, adminPath],
  );

  async function requestAdmin(body: Record<string, unknown>) {
    let response: Response;

    try {
      response = await fetch("/api/admin/works", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          accessKey,
          password,
          ...body,
        }),
      });
    } catch {
      throw new Error(
        "Не удалось подключиться к API админки. Обнови страницу и проверь, что сайт уже redeploy после переменных Vercel.",
      );
    }

    const result = (await response.json().catch(() => ({
      error: `Admin API returned ${response.status}.`,
    }))) as {
      works?: WorkRow[];
      work?: WorkRow;
      ok?: boolean;
      error?: string;
    };

    if (!response.ok) {
      throw new Error(result.error || "Request failed.");
    }

    return result;
  }

  async function loadWorks() {
    setIsBusy(true);
    setStatus("Загружаю работы.");

    try {
      const result = await requestAdmin({ action: "list" });
      setWorks(result.works || []);
      setStatus("Доступ открыт.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Ошибка входа.");
    } finally {
      setIsBusy(false);
    }
  }

  function toWorkInput(): WorkInput {
    return {
      title: form.title.trim(),
      type: form.type,
      video_url: form.video_url.trim(),
      frame: form.frame,
      sort_order: Number.parseInt(form.sort_order, 10) || 100,
      is_published: form.is_published,
    };
  }

  async function saveWork(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsBusy(true);
    setStatus(editingId ? "Обновляю работу." : "Добавляю работу.");

    try {
      const work = toWorkInput();
      const action = editingId ? "update" : "create";
      await requestAdmin(
        editingId ? { action, id: editingId, work } : { action, work },
      );
      setForm(emptyForm);
      setEditingId(null);
      await loadWorks();
      setStatus("Сохранено.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Не удалось сохранить.");
    } finally {
      setIsBusy(false);
    }
  }

  async function deleteWork(id: string) {
    setIsBusy(true);
    setStatus("Удаляю работу.");

    try {
      await requestAdmin({ action: "delete", id });
      setWorks((current) => current.filter((work) => work.id !== id));
      setStatus("Удалено.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Не удалось удалить.");
    } finally {
      setIsBusy(false);
    }
  }

  function editWork(work: WorkRow) {
    setEditingId(work.id);
    setForm({
      title: work.title,
      type: work.type,
      video_url: work.video_url,
      frame: work.frame,
      sort_order: String(work.sort_order),
      is_published: work.is_published,
    });
    setStatus("Редактирование работы.");
  }

  return (
    <main className="min-h-[100dvh] bg-[#050506] px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <header className="rounded-[28px] border border-white/10 bg-white/[0.04] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.36)] sm:p-8">
          <p className="font-mono text-sm text-[#ff4b50]">Hidden admin</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-[-0.04em]">
            Fofan montage
          </h1>
          <p className="mt-4 max-w-2xl text-zinc-300">
            Эта страница не видна на сайте. Открывай ее только по личной ссылке:
            <span className="mt-2 block break-all font-mono text-xs text-zinc-500">
              {adminUrl}
            </span>
          </p>
        </header>

        <section className="mt-6 grid gap-6 lg:grid-cols-[0.75fr_1.25fr]">
          <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-6">
            <label className="block text-sm font-semibold text-zinc-200">
              Пароль администратора
            </label>
            <input
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              type="password"
              className="mt-3 h-12 w-full rounded-full border border-white/10 bg-black/30 px-4 text-white outline-none transition focus:border-[#ff4b50]"
              placeholder="ADMIN_PASSWORD"
            />
            <button
              type="button"
              onClick={loadWorks}
              disabled={isBusy || !password}
              className="mt-4 inline-flex h-12 w-full items-center justify-center rounded-full bg-[#e3272d] px-5 font-semibold text-white shadow-[0_18px_60px_rgba(227,39,45,0.2)] transition hover:bg-[#ff4b50] disabled:cursor-not-allowed disabled:opacity-60"
            >
              Открыть работы
            </button>
            <p className="mt-4 text-sm text-zinc-400">{status}</p>
          </div>

          <form
            onSubmit={saveWork}
            className="rounded-[28px] border border-white/10 bg-white/[0.04] p-6"
          >
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-2xl font-semibold tracking-[-0.03em]">
                {editingId ? "Редактировать" : "Добавить работу"}
              </h2>
              {editingId ? (
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(null);
                    setForm(emptyForm);
                  }}
                  className="rounded-full border border-white/10 px-4 py-2 text-sm text-zinc-300"
                >
                  Отмена
                </button>
              ) : null}
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <label className="sm:col-span-2">
                <span className="text-sm text-zinc-300">Название</span>
                <input
                  value={form.title}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      title: event.target.value,
                    }))
                  }
                  className="mt-2 h-12 w-full rounded-2xl border border-white/10 bg-black/30 px-4 outline-none transition focus:border-[#ff4b50]"
                  required
                />
              </label>

              <label className="sm:col-span-2">
                <span className="text-sm text-zinc-300">Ссылка на видео</span>
                <input
                  value={form.video_url}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      video_url: event.target.value,
                    }))
                  }
                  className="mt-2 h-12 w-full rounded-2xl border border-white/10 bg-black/30 px-4 outline-none transition focus:border-[#ff4b50]"
                  placeholder="https://..."
                  required
                />
              </label>

              <label>
                <span className="text-sm text-zinc-300">Тип</span>
                <select
                  value={form.type}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      type: event.target.value as WorkKind,
                    }))
                  }
                  className="mt-2 h-12 w-full rounded-2xl border border-white/10 bg-black/30 px-4 outline-none transition focus:border-[#ff4b50]"
                >
                  <option value="youtube">YouTube</option>
                  <option value="reels">TikTok/Reels</option>
                </select>
              </label>

              <label>
                <span className="text-sm text-zinc-300">Формат</span>
                <select
                  value={form.frame}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      frame: event.target.value as WorkFrame,
                    }))
                  }
                  className="mt-2 h-12 w-full rounded-2xl border border-white/10 bg-black/30 px-4 outline-none transition focus:border-[#ff4b50]"
                >
                  <option value="16:9">16:9</option>
                  <option value="9:16">9:16</option>
                </select>
              </label>

              <label>
                <span className="text-sm text-zinc-300">Порядок</span>
                <input
                  value={form.sort_order}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      sort_order: event.target.value,
                    }))
                  }
                  type="number"
                  className="mt-2 h-12 w-full rounded-2xl border border-white/10 bg-black/30 px-4 outline-none transition focus:border-[#ff4b50]"
                />
              </label>

              <label className="flex items-end gap-3 pb-3">
                <input
                  checked={form.is_published}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      is_published: event.target.checked,
                    }))
                  }
                  type="checkbox"
                  className="h-5 w-5 accent-[#e3272d]"
                />
                <span className="text-sm text-zinc-300">Опубликовано</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isBusy || !password}
              className="mt-6 inline-flex h-12 w-full items-center justify-center rounded-full bg-[#e3272d] px-5 font-semibold text-white shadow-[0_18px_60px_rgba(227,39,45,0.2)] transition hover:bg-[#ff4b50] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {editingId ? "Сохранить" : "Добавить"}
            </button>
          </form>
        </section>

        <section className="mt-6 rounded-[28px] border border-white/10 bg-white/[0.04] p-6">
          <h2 className="text-2xl font-semibold tracking-[-0.03em]">Работы</h2>
          <div className="mt-5 grid gap-3">
            {works.length ? (
              works.map((work) => (
                <article
                  key={work.id}
                  className="rounded-2xl border border-white/10 bg-black/20 p-4"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap gap-2 font-mono text-xs text-zinc-500">
                        <span>{work.type}</span>
                        <span>{work.frame}</span>
                        <span>order {work.sort_order}</span>
                        <span>{work.is_published ? "published" : "hidden"}</span>
                      </div>
                      <h3 className="mt-2 text-xl font-semibold">{work.title}</h3>
                      <a
                        href={work.video_url}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-2 block break-all text-sm text-zinc-400 transition hover:text-white"
                      >
                        {work.video_url}
                      </a>
                    </div>
                    <div className="flex shrink-0 gap-2">
                      <button
                        type="button"
                        onClick={() => editWork(work)}
                        className="rounded-full border border-white/10 px-4 py-2 text-sm text-zinc-200 transition hover:border-[#ff4b50]"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteWork(work.id)}
                        className="rounded-full border border-[#e3272d]/50 px-4 py-2 text-sm text-[#ff4b50] transition hover:bg-[#e3272d]/10"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </article>
              ))
            ) : (
              <p className="text-sm text-zinc-400">
                После входа здесь появятся работы из Supabase.
              </p>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
