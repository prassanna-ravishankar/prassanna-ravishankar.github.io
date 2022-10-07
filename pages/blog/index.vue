<template>
  <div>
    <header class="pt-16 pb-9 sm:pb-16 sm:text-center">
      <h1
        class="mb-4 text-8xl sm:text-4xl tracking-tight text-slate-800 font-extrabold dark:text-slate-200"
      >
        Blog
      </h1>
      <p class="text-lg text-slate-700 dark:text-slate-400">
        My thoughts on Technology, Philosophy, Poetry and Python.
      </p>
    </header>
    <div class="space-y-16 mx-auto max-w-7xl">
      <blog-item
        v-for="article in articles"
        :key="article.title"
        :title="article.title"
        :description="article.description"
        :date="article.date"
        :slug="article.slug"
        :image="article.image"
      ></blog-item>
    </div>
  </div>
</template>

<script>
export default {
  async asyncData({ $content, params }) {
    const articles = await $content("articles")
      .only([
        "title",
        "description",
        "image",
        "slug",
        "tag",
        "author",
        "date",
        "draft",
      ])
      .sortBy("date", "desc")
      .fetch();

    return {
      articles,
    };
  },
  head: {
    title: "Prass | Blogs",
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      {
        hid: "description",
        name: "description",
        content: "Its Prass's Pen and Paper to write ",
      },
    ],
    link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
  },
};
</script>

<style></style>
